<?php
declare(strict_types=1);

// ============================================
// CONFIGURATION
// ============================================
define('DB_HOST', 'localhost');
define('DB_NAME', 'design_platform');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// ============================================
// DATABASE CONNECTION (Singleton PDO)
// ============================================

class Database {
    private static ?PDO $instance = null;
    
    public static function getInstance(): PDO {
        if (self::$instance === null) {
            try {
                $dsn = sprintf(
                    "mysql:host=%s;dbname=%s;charset=%s",
                    DB_HOST, DB_NAME, DB_CHARSET
                );
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
                ]);
            } catch (PDOException $e) {
                error_log("Database connection failed: " . $e->getMessage());
                throw new Exception("Database connection failed");
            }
        }
        return self::$instance;
    }
    
    private function __clone() {}
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

// ============================================
// BASE MODEL (Active Record Pattern)
// ============================================

abstract class BaseModel {
    protected PDO $db;
    protected string $table;
    protected string $primaryKey = 'id';
    protected array $attributes = [];
    protected array $fillable = [];
    protected array $hidden = ['password_hash'];
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function __get(string $name): mixed {
        if (in_array($name, $this->hidden)) return null;
        return $this->attributes[$name] ?? null;
    }
    
    public function __set(string $name, mixed $value): void {
        if (empty($this->fillable) || in_array($name, $this->fillable)) {
            $this->attributes[$name] = $value;
        }
    }
    
    public function __isset(string $name): bool {
        return isset($this->attributes[$name]);
    }
    
    protected function generateUUID(): string {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
    
    public function find(string $id): ?static {
        $stmt = $this->db->prepare(
            "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = ? LIMIT 1"
        );
        $stmt->execute([$id]);
        $data = $stmt->fetch();
        
        if (!$data) return null;
        
        $instance = new static();
        $instance->attributes = $data;
        return $instance;
    }
    
    public function findBy(string $column, mixed $value): ?static {
        $stmt = $this->db->prepare(
            "SELECT * FROM {$this->table} WHERE {$column} = ? LIMIT 1"
        );
        $stmt->execute([$value]);
        $data = $stmt->fetch();
        
        if (!$data) return null;
        
        $instance = new static();
        $instance->attributes = $data;
        return $instance;
    }
    
    public function create(array $data): static {
        $instance = new static();
        
        if (!isset($data[$this->primaryKey])) {
            $data[$this->primaryKey] = $instance->generateUUID();
        }
        
        if (!empty($this->fillable)) {
            $data = array_intersect_key($data, array_flip($this->fillable));
        }
        
        $columns = array_keys($data);
        $placeholders = array_fill(0, count($columns), '?');
        
        $sql = sprintf(
            "INSERT INTO %s (%s) VALUES (%s)",
            $this->table,
            implode(', ', $columns),
            implode(', ', $placeholders)
        );
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array_values($data));
        
        $instance->attributes = $data;
        return $instance;
    }
    
    public function update(array $data): bool {
        if (empty($this->attributes[$this->primaryKey])) {
            return false;
        }
        
        if (!empty($this->fillable)) {
            $data = array_intersect_key($data, array_flip($this->fillable));
        }
        
        if (empty($data)) return false;
        
        $sets = [];
        $values = [];
        foreach ($data as $key => $value) {
            $sets[] = "{$key} = ?";
            $values[] = $value;
        }
        
        $values[] = $this->attributes[$this->primaryKey];
        
        $sql = sprintf(
            "UPDATE %s SET %s WHERE %s = ?",
            $this->table,
            implode(', ', $sets),
            $this->primaryKey
        );
        
        $stmt = $this->db->prepare($sql);
        if ($stmt->execute($values)) {
            $this->attributes = array_merge($this->attributes, $data);
            return true;
        }
        return false;
    }
    
    public function delete(): bool {
        if (empty($this->attributes[$this->primaryKey])) {
            return false;
        }
        
        $stmt = $this->db->prepare(
            "DELETE FROM {$this->table} WHERE {$this->primaryKey} = ?"
        );
        return $stmt->execute([$this->attributes[$this->primaryKey]]);
    }
    
    public function toArray(): array {
        return array_diff_key($this->attributes, array_flip($this->hidden));
    }
    
    public function all(int $page = 1, int $perPage = 20): array {
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            "SELECT * FROM {$this->table} LIMIT ? OFFSET ?"
        );
        $stmt->execute([$perPage, $offset]);
        return $stmt->fetchAll();
    }
    
    public function query(string $sql, array $params = []): array {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    public function beginTransaction(): bool {
        return $this->db->beginTransaction();
    }
    
    public function commit(): bool {
        return $this->db->commit();
    }
    
    public function rollback(): bool {
        return $this->db->rollBack();
    }
    
    public function lastInsertId(): string {
        return $this->db->lastInsertId();
    }
}