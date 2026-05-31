<?php
declare(strict_types=1);
require_once 'Database.php';

// ============================================
// USER MODEL
// ============================================

class User extends BaseModel {
    protected string $table = 'users';
    protected string $primaryKey = 'user_id';
    protected array $fillable = [
        'user_id', 'email', 'password_hash', 'full_name', 
        'bio', 'avatar_url', 'role_id', 'is_verified', 'is_active'
    ];
    protected array $hidden = ['password_hash'];
    
    /**
     * Register new user
     */
    public function register(
        string $email, 
        string $password, 
        string $fullName, 
        ?string $role = null
    ): static {
        $this->beginTransaction();
        
        try {
            $roleId = null;
            if ($role) {
                $stmt = $this->db->prepare(
                    "SELECT role_id FROM user_roles WHERE role_name = ?"
                );
                $stmt->execute([$role]);
                $roleId = $stmt->fetchColumn();
            }
            
            $user = $this->create([
                'email' => $email,
                'password_hash' => password_hash($password, PASSWORD_BCRYPT),
                'full_name' => $fullName,
                'role_id' => $roleId
            ]);
            
            $this->commit();
            return $user;
            
        } catch (Exception $e) {
            $this->rollback();
            throw $e;
        }
    }
    
    /**
     * Authenticate user
     */
    public function authenticate(string $email, string $password): ?static {
        $user = $this->findBy('email', $email);
        if ($user && password_verify($password, $user->attributes['password_hash'])) {
            return $user;
        }
        return null;
    }
    
    /**
     * Get user role
     */
    public function getRole(): ?string {
        if (!isset($this->attributes['role_id']) || !$this->attributes['role_id']) {
            return null;
        }
        
        $stmt = $this->db->prepare(
            "SELECT role_name FROM user_roles WHERE role_id = ?"
        );
        $stmt->execute([$this->attributes['role_id']]);
        return $stmt->fetchColumn() ?: null;
    }
    
    /**
     * Update profile
     */
    public function updateProfile(array $data): bool {
        return $this->update($data);
    }
    
    /**
     * Get designer profile if exists
     */
    public function getDesignerProfile(): ?Designer {
        $stmt = $this->db->prepare(
            "SELECT * FROM designers WHERE user_id = ?"
        );
        $stmt->execute([$this->user_id]);
        $data = $stmt->fetch();
        
        if (!$data) return null;
        
        $designer = new Designer();
        $designer->attributes = $data;
        return $designer;
    }
    
    /**
     * Get client profile if exists
     */
    public function getClientProfile(): ?Client {
        $stmt = $this->db->prepare(
            "SELECT * FROM clients WHERE user_id = ?"
        );
        $stmt->execute([$this->user_id]);
        $data = $stmt->fetch();
        
        if (!$data) return null;
        
        $client = new Client();
        $client->attributes = $data;
        return $client;
    }
}

// ============================================
// DESIGNER MODEL
// ============================================

class Designer extends BaseModel {
    protected string $table = 'designers';
    protected string $primaryKey = 'designer_id';
    protected array $fillable = [
        'designer_id', 'user_id', 'portfolio_url', 'rating'
    ];
    
    /**
     * Create designer profile
     */
    public function createProfile(string $userId, array $data = []): static {
        $data['designer_id'] = $this->generateUUID();
        $data['user_id'] = $userId;
        
        $this->beginTransaction();
        
        try {
            $designer = $this->create($data);
            
            // Update user role to Designer if not set
            $stmt = $this->db->prepare(
                "UPDATE users SET role_id = (SELECT role_id FROM user_roles WHERE role_name = 'Designer') 
                 WHERE user_id = ? AND role_id IS NULL"
            );
            $stmt->execute([$userId]);
            
            $this->commit();
            return $designer;
            
        } catch (Exception $e) {
            $this->rollback();
            throw $e;
        }
    }
    
    /**
     * Get associated user
     */
    public function getUser(): ?User {
        return (new User())->find($this->user_id);
    }
    
    /**
     * Get skills
     */
    public function getSkills(): array {
        $stmt = $this->db->prepare(
            "SELECT ds.skill_name, dsa.proficiency_level
             FROM designer_skills ds
             JOIN designer_skill_assignments dsa ON ds.skill_id = dsa.skill_id
             WHERE dsa.designer_id = ?
             ORDER BY ds.skill_name"
        );
        $stmt->execute([$this->designer_id]);
        return $stmt->fetchAll();
    }
    
    /**
     * Add skill
     */
    public function addSkill(int $skillId, int $proficiency = 1): bool {
        $stmt = $this->db->prepare(
            "INSERT INTO designer_skill_assignments (designer_id, skill_id, proficiency_level)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE proficiency_level = ?"
        );
        return $stmt->execute([$this->designer_id, $skillId, $proficiency, $proficiency]);
    }
    
    /**
     * Remove skill
     */
    public function removeSkill(int $skillId): bool {
        $stmt = $this->db->prepare(
            "DELETE FROM designer_skill_assignments 
             WHERE designer_id = ? AND skill_id = ?"
        );
        return $stmt->execute([$this->designer_id, $skillId]);
    }
    
    /**
     * Get portfolio items
     */
    public function getPortfolioItems(): array {
        $stmt = $this->db->prepare(
            "SELECT pi.*, GROUP_CONCAT(c.category_name) AS categories
             FROM portfolio_items pi
             LEFT JOIN portfolio_item_categories pic ON pi.item_id = pic.item_id
             LEFT JOIN categories c ON pic.category_id = c.category_id
             WHERE pi.designer_id = ? AND pi.is_active = TRUE
             GROUP BY pi.item_id
             ORDER BY pi.created_at DESC"
        );
        $stmt->execute([$this->designer_id]);
        return $stmt->fetchAll();
    }
    
    /**
     * Add portfolio item
     */
    public function addPortfolioItem(array $data): PortfolioItem {
        $data['designer_id'] = $this->designer_id;
        return (new PortfolioItem())->create($data);
    }
    
    /**
     * Get posts (SHOWCASE type)
     */
    public function getPosts(): array {
        $stmt = $this->db->prepare(
            "SELECT p.*, pt.type_name
             FROM posts p
             JOIN post_types pt ON p.type_id = pt.type_id
             WHERE p.author_id = ? AND p.author_type = 'designer'
             ORDER BY p.created_at DESC"
        );
        $stmt->execute([$this->designer_id]);
        return $stmt->fetchAll();
    }
    
    /**
     * Create showcase post
     */
    public function createPost(string $caption, ?string $mediaUrl = null, ?float $budget = null): Post {
        $stmt = $this->db->prepare("CALL sp_create_designer_post(?, ?, ?, ?)");
        $stmt->execute([$this->designer_id, $caption, $mediaUrl, $budget]);
        $result = $stmt->fetch();
        
        return (new Post())->find($result['post_id']);
    }
    
    /**
     * Take designer test
     */
    public function takeDesignerTest(): array {
        // Business logic for skill assessment
        $score = rand(70, 100);
        return [
            'status' => 'completed',
            'score' => $score,
            'passed' => $score >= 75,
            'designer_id' => $this->designer_id
        ];
    }
    
    /**
     * Upload portfolio item with categories
     */
    public function uploadPortfolio(
        string $title, 
        string $mediaUrl, 
        array $categoryIds = [],
        ?string $description = null
    ): PortfolioItem {
        $this->beginTransaction();
        
        try {
            $item = $this->addPortfolioItem([
                'title' => $title,
                'media_url' => $mediaUrl,
                'description' => $description
            ]);
            
            if (!empty($categoryIds)) {
                $catStmt = $this->db->prepare(
                    "INSERT INTO portfolio_item_categories (item_id, category_id) VALUES (?, ?)"
                );
                foreach ($categoryIds as $catId) {
                    $catStmt->execute([$item->item_id, $catId]);
                }
            }
            
            $this->commit();
            return $item;
            
        } catch (Exception $e) {
            $this->rollback();
            throw $e;
        }
    }
}

// ============================================
// CLIENT MODEL
// ============================================

class Client extends BaseModel {
    protected string $table = 'clients';
    protected string $primaryKey = 'client_id';
    protected array $fillable = ['client_id', 'user_id', 'company_name'];
    
    /**
     * Create client profile
     */
    public function createProfile(string $userId, array $data = []): static {
        $data['client_id'] = $this->generateUUID();
        $data['user_id'] = $userId;
        
        $this->beginTransaction();
        
        try {
            $client = $this->create($data);
            
            // Update user role to Client if not set
            $stmt = $this->db->prepare(
                "UPDATE users SET role_id = (SELECT role_id FROM user_roles WHERE role_name = 'Client') 
                 WHERE user_id = ? AND role_id IS NULL"
            );
            $stmt->execute([$userId]);
            
            $this->commit();
            return $client;
            
        } catch (Exception $e) {
            $this->rollback();
            throw $e;
        }
    }
    
    /**
     * Get associated user
     */
    public function getUser(): ?User {
        return (new User())->find($this->user_id);
    }
    
    /**
     * Request service (creates BRIEF post + service request)
     */
    public function requestService(
        string $title,
        string $description,
        ?float $budget = null,
        ?string $mediaUrl = null
    ): array {
        $stmt = $this->db->prepare("CALL sp_create_client_request(?, ?, ?, ?, ?)");
        $stmt->execute([$this->client_id, $title, $description, $budget, $mediaUrl]);
        $result = $stmt->fetch();
        
        return [
            'post_id' => $result['post_id'],
            'request_id' => $result['request_id']
        ];
    }
    
    /**
     * Browse designers with filters
     */
    public function browseDesigners(
        ?string $skillFilter = null,
        ?float $minRating = null,
        int $page = 1,
        int $perPage = 20
    ): array {
        $stmt = $this->db->prepare("CALL sp_browse_designers(?, ?, ?, ?)");
        $stmt->execute([$skillFilter, $minRating, $page, $perPage]);
        return $stmt->fetchAll();
    }
    
    /**
     * Get service requests
     */
    public function getServiceRequests(): array {
        $stmt = $this->db->prepare(
            "SELECT sr.*, ss.status_name, p.caption, p.media_url
             FROM service_requests sr
             JOIN service_statuses ss ON sr.status_id = ss.status_id
             LEFT JOIN posts p ON sr.post_id = p.post_id
             WHERE sr.client_id = ?
             ORDER BY sr.created_at DESC"
        );
        $stmt->execute([$this->client_id]);
        return $stmt->fetchAll();
    }
}

// ============================================
// PORTFOLIO ITEM MODEL
// ============================================

class PortfolioItem extends BaseModel {
    protected string $table = 'portfolio_items';
    protected string $primaryKey = 'item_id';
    protected array $fillable = [
        'item_id', 'designer_id', 'title', 'media_url', 'description', 'is_active'
    ];
    
    /**
     * Upload media
     */
    public function upload(): void {
        $this->update(['is_active' => true]);
    }
    
    /**
     * Soft delete
     */
    public function deleteItem(): bool {
        return $this->update(['is_active' => false]);
    }
    
    /**
     * Hard delete
     */
    public function hardDelete(): bool {
        return $this->delete();
    }
    
    /**
     * Get categories
     */
    public function getCategories(): array {
        $stmt = $this->db->prepare(
            "SELECT c.* 
             FROM categories c
             JOIN portfolio_item_categories pic ON c.category_id = pic.category_id
             WHERE pic.item_id = ?"
        );
        $stmt->execute([$this->item_id]);
        return $stmt->fetchAll();
    }
    
    /**
     * Add category
     */
    public function addCategory(int $categoryId): bool {
        $stmt = $this->db->prepare(
            "INSERT IGNORE INTO portfolio_item_categories (item_id, category_id) VALUES (?, ?)"
        );
        return $stmt->execute([$this->item_id, $categoryId]);
    }
}

// ============================================
// POST MODEL
// ============================================

class Post extends BaseModel {
    protected string $table = 'posts';
    protected string $primaryKey = 'post_id';
    protected array $fillable = [
        'post_id', 'author_id', 'author_type', 'caption', 'media_url',
        'type_id', 'budget', 'is_published'
    ];
    
    /**
     * Publish post
     */
    public function publish(): bool {
        return $this->update(['is_published' => true]);
    }
    
    /**
     * Like post
     */
    public function like(): bool {
        $stmt = $this->db->prepare(
            "UPDATE posts SET likes_count = likes_count + 1 WHERE post_id = ?"
        );
        return $stmt->execute([$this->post_id]);
    }
    
    /**
     * Unlike post
     */
    public function unlike(): bool {
        $stmt = $this->db->prepare(
            "UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE post_id = ?"
        );
        return $stmt->execute([$this->post_id]);
    }
    
    /**
     * Add comment
     */
    public function comment(string $userId, string $content): bool {
        // Would need a comments table
        // Simplified implementation
        return true;
    }
    
    /**
     * Get author info
     */
    public function getAuthor(): array {
        if ($this->author_type === 'designer') {
            $stmt = $this->db->prepare(
                "SELECT d.*, u.full_name, u.avatar_url 
                 FROM designers d
                 JOIN users u ON d.user_id = u.user_id
                 WHERE d.designer_id = ?"
            );
        } else {
            $stmt = $this->db->prepare(
                "SELECT c.*, u.full_name, u.avatar_url 
                 FROM clients c
                 JOIN users u ON c.user_id = u.user_id
                 WHERE c.client_id = ?"
            );
        }
        $stmt->execute([$this->author_id]);
        return $stmt->fetch() ?: [];
    }
    
    /**
     * Get post type
     */
    public function getType(): ?string {
        $stmt = $this->db->prepare(
            "SELECT type_name FROM post_types WHERE type_id = ?"
        );
        $stmt->execute([$this->type_id]);
        return $stmt->fetchColumn() ?: null;
    }
}

// ============================================
// SERVICE REQUEST MODEL
// ============================================

class ServiceRequest extends BaseModel {
    protected string $table = 'service_requests';
    protected string $primaryKey = 'request_id';
    protected array $fillable = [
        'request_id', 'client_id', 'post_id', 'title', 
        'description', 'budget', 'status_id'
    ];
    
    /**
     * Submit request (set to PENDING)
     */
    public function submit(): bool {
        return $this->update(['status_id' => 1]);
    }
    
    /**
     * Accept request (by designer)
     */
    public function accept(string $designerId): bool {
        try {
            $stmt = $this->db->prepare("CALL sp_accept_service_request(?, ?)");
            $stmt->execute([$this->request_id, $designerId]);
            return true;
        } catch (Exception $e) {
            error_log("Accept failed: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Cancel request
     */
    public function cancel(): bool {
        return $this->update(['status_id' => 4]); // CANCELLED
    }
    
    /**
     * Complete request
     */
    public function complete(): bool {
        return $this->update(['status_id' => 3]); // DONE
    }
    
    /**
     * Get status
     */
    public function getStatus(): ?string {
        $stmt = $this->db->prepare(
            "SELECT status_name FROM service_statuses WHERE status_id = ?"
        );
        $stmt->execute([$this->status_id]);
        return $stmt->fetchColumn() ?: null;
    }
    
    /**
     * Get associated chat
     */
    public function getChat(): ?Chat {
        $stmt = $this->db->prepare(
            "SELECT * FROM chats WHERE related_request_id = ?"
        );
        $stmt->execute([$this->request_id]);
        $data = $stmt->fetch();
        
        if (!$data) return null;
        
        $chat = new Chat();
        $chat->attributes = $data;
        return $chat;
    }
    
    /**
     * Get client
     */
    public function getClient(): ?Client {
        return (new Client())->find($this->client_id);
    }
    
    /**
     * Get assigned designers
     */
    public function getDesigners(): array {
        $stmt = $this->db->prepare(
            "SELECT d.*, u.full_name, srd.relationship_type
             FROM designers d
             JOIN service_request_designers srd ON d.designer_id = srd.designer_id
             JOIN users u ON d.user_id = u.user_id
             WHERE srd.request_id = ?"
        );
        $stmt->execute([$this->request_id]);
        return $stmt->fetchAll();
    }
    
    /**
     * Invite designer
     */
    public function inviteDesigner(string $designerId): bool {
        $stmt = $this->db->prepare(
            "INSERT INTO service_request_designers (request_id, designer_id, relationship_type)
             VALUES (?, ?, 'invited')
             ON DUPLICATE KEY UPDATE relationship_type = 'invited'"
        );
        return $stmt->execute([$this->request_id, $designerId]);
    }
}

// ============================================
// CHAT MODEL
// ============================================

class Chat extends BaseModel {
    protected string $table = 'chats';
    protected string $primaryKey = 'chat_id';
    protected array $fillable = [
        'chat_id', 'chat_type_id', 'related_request_id', 'title', 'is_active'
    ];
    
    /**
     * Send message
     */
    public function sendMessage(string $senderId, string $content): Message {
        $stmt = $this->db->prepare("CALL sp_send_message(?, ?, ?)");
        $stmt->execute([$this->chat_id, $senderId, $content]);
        $result = $stmt->fetch();
        
        return (new Message())->find($result['message_id']);
    }
    
    /**
     * Get chat history
     */
    public function getHistory(string $userId, int $limit = 50): array {
        $stmt = $this->db->prepare("CALL sp_get_chat_history(?, ?, ?)");
        $stmt->execute([$this->chat_id, $userId, $limit]);
        return $stmt->fetchAll();
    }
    
    /**
     * Add participant
     */
    public function addParticipant(string $userId, bool $isAdmin = false): bool {
        $stmt = $this->db->prepare(
            "INSERT INTO chat_participants (chat_id, user_id, is_admin) 
             VALUES (?, ?, ?)"
        );
        return $stmt->execute([$this->chat_id, $userId, $isAdmin]);
    }
    
    /**
     * Remove participant
     */
    public function removeParticipant(string $userId): bool {
        $stmt = $this->db->prepare(
            "DELETE FROM chat_participants WHERE chat_id = ? AND user_id = ?"
        );
        return $stmt->execute([$this->chat_id, $userId]);
    }
    
    /**
     * Get participants
     */
    public function getParticipants(): array {
        $stmt = $this->db->prepare(
            "SELECT u.user_id, u.full_name, u.avatar_url, 
                    cp.joined_at, cp.is_admin, cp.last_read_at
             FROM chat_participants cp
             JOIN users u ON cp.user_id = u.user_id
             WHERE cp.chat_id = ?"
        );
        $stmt->execute([$this->chat_id]);
        return $stmt->fetchAll();
    }
    
    /**
     * Open chat
     */
    public function open(): bool {
        return $this->update(['is_active' => true]);
    }
    
    /**
     * Close chat
     */
    public function close(): bool {
        return $this->update(['is_active' => false]);
    }
    
    /**
     * Join chat
     */
    public function join(string $userId): bool {
        return $this->addParticipant($userId);
    }
}

// ============================================
// MESSAGE MODEL
// ============================================

class Message extends BaseModel {
    protected string $table = 'messages';
    protected string $primaryKey = 'message_id';
    protected array $fillable = [
        'message_id', 'chat_id', 'sender_id', 'content', 'is_read'
    ];
    
    /**
     * Mark as read
     */
    public function markAsRead(): bool {
        return $this->update(['is_read' => true]);
    }
    
    /**
     * Edit message
     */
    public function edit(string $newContent): bool {
        return $this->update([
            'content' => $newContent,
            'is_edited' => true,
            'edited_at' => date('Y-m-d H:i:s')
        ]);
    }
    
    /**
     * Get sender info
     */
    public function getSender(): ?User {
        return (new User())->find($this->sender_id);
    }
    
    /**
     * Send (static factory)
     */
    public static function send(string $chatId, string $senderId, string $content): Message {
        $chat = (new Chat())->find($chatId);
        if (!$chat) {
            throw new Exception("Chat not found");
        }
        return $chat->sendMessage($senderId, $content);
    }
}