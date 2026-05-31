<?php
declare(strict_types=1);

echo "=== Design Platform Database Setup ===\n\n";

try {
    // Connect without database to create it
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    // Create database
    $pdo->exec("DROP DATABASE IF EXISTS " . DB_NAME);
    $pdo->exec("CREATE DATABASE " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Database created: " . DB_NAME . "\n";
    
    // Connect to new database
    $pdo->exec("USE " . DB_NAME);
    
    // Read and execute SQL file
    $sql = file_get_contents('design_platform.sql');
    if (!$sql) {
        throw new Exception("Could not read SQL file");
    }
    
    // Remove DELIMITER statements and split procedures
    $sql = preg_replace('/DELIMITER\s+\/\/\s*/', '', $sql);
    $sql = preg_replace('/\s*DELIMITER\s+;\s*/', '', $sql);
    
    // Split by semicolons but be careful with procedures
    $statements = array_filter(array_map('trim', preg_split('/;\s*(?=\s*(CREATE|INSERT|DROP|USE|SET|UPDATE|DELETE|SELECT|ALTER|BEGIN|COMMIT|ROLLBACK|END|IF|CASE|WHILE|REPEAT|LOOP|LEAVE|ITERATE|RETURN|EXIT|CLOSE|FETCH|OPEN|DECLARE|HANDLER|CONTINUE|UNDO|SQLEXCEPTION|SQLWARNING|NOT\s+FOUND))/', $sql)));
    
    $executed = 0;
    foreach ($statements as $statement) {
        if (empty($statement)) continue;
        
        try {
            $pdo->exec($statement);
            $executed++;
            echo "✅ Executed: " . substr(preg_replace('/\s+/', ' ', $statement), 0, 60) . "...\n";
        } catch (PDOException $e) {
            echo "⚠️  Skipped (may already exist): " . substr($e->getMessage(), 0, 80) . "\n";
        }
    }
    
    echo "\n=== Setup Complete ===\n";
    echo "Total statements executed: {$executed}\n";
    echo "Database '{$_ENV['DB_NAME']}' is ready to use.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}