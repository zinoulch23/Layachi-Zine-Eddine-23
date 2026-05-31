<?php
declare(strict_types=1);
require_once 'Models.php';

header('Content-Type: application/json');

// Simple JWT-like token validation (simplified)
function getAuthUserId(): ?string {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';
    // In production, validate JWT properly
    return str_replace('Bearer ', '', $token) ?: null;
}

function sendResponse(int $code, array $data): void {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function getInput(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $path = trim(str_replace('/api/', '', $path), '/');
    $parts = explode('/', $path);
    
    $resource = $parts[0] ?? '';
    $id = $parts[1] ?? null;
    $action = $parts[2] ?? null;
    
    switch ($resource) {
        // ========================================
        // AUTH ENDPOINTS
        // ========================================
        case 'auth':
            handleAuth($method, $action);
            break;
            
        // ========================================
        // USER ENDPOINTS
        // ========================================
        case 'users':
            handleUsers($method, $id, $action);
            break;
            
        // ========================================
        // DESIGNER ENDPOINTS
        // ========================================
        case 'designers':
            handleDesigners($method, $id, $action);
            break;
            
        // ========================================
        // CLIENT ENDPOINTS
        // ========================================
        case 'clients':
            handleClients($method, $id, $action);
            break;
            
        // ========================================
        // POST ENDPOINTS
        // ========================================
        case 'posts':
            handlePosts($method, $id, $action);
            break;
            
        // ========================================
        // SERVICE REQUEST ENDPOINTS
        // ========================================
        case 'requests':
            handleRequests($method, $id, $action);
            break;
            
        // ========================================
        // CHAT ENDPOINTS
        // ========================================
        case 'chats':
            handleChats($method, $id, $action);
            break;
            
        // ========================================
        // PORTFOLIO ENDPOINTS
        // ========================================
        case 'portfolio':
            handlePortfolio($method, $id, $action);
            break;
            
        default:
            sendResponse(404, ['error' => 'Endpoint not found']);
    }
    
} catch (Exception $e) {
    sendResponse(500, ['error' => $e->getMessage()]);
}

// ============================================
// HANDLER FUNCTIONS
// ============================================

function handleAuth(string $method, ?string $action): void {
    $input = getInput();
    
    if ($method === 'POST' && $action === 'register') {
        $user = new User();
        $result = $user->register(
            $input['email'],
            $input['password'],
            $input['full_name'],
            $input['role'] ?? null
        );
        sendResponse(201, ['success' => true, 'user' => $result->toArray()]);
    }
    
    if ($method === 'POST' && $action === 'login') {
        $userModel = new User();
        $existing = $userModel->findBy('email', $input['email'] ?? '');
        if (!$existing) {
            sendResponse(401, ['error' => 'Account not found. Please check your credentials or sign up.']);
        }
        $result = $userModel->authenticate($input['email'], $input['password']);
        if ($result) {
            sendResponse(200, [
                'success' => true,
                'user' => $result->toArray(),
                'role' => $result->getRole(),
                'token' => 'dummy_token_' . $result->user_id
            ]);
        }
        sendResponse(401, ['error' => 'Invalid password. Please try again.']);
    }
}

function handleUsers(string $method, ?string $id, ?string $action): void {
    $user = new User();
    
    switch ($method) {
        case 'GET':
            if ($id) {
                $result = $user->find($id);
                if (!$result) sendResponse(404, ['error' => 'User not found']);
                
                $data = $result->toArray();
                $data['role'] = $result->getRole();
                $data['designer_profile'] = $result->getDesignerProfile()?->toArray();
                $data['client_profile'] = $result->getClientProfile()?->toArray();
                sendResponse(200, $data);
            }
            sendResponse(200, $user->all((int)($_GET['page'] ?? 1)));
            
        case 'PUT':
            if (!$id) sendResponse(400, ['error' => 'ID required']);
            $existing = $user->find($id);
            if (!$existing) sendResponse(404, ['error' => 'User not found']);
            
            if ($existing->update(getInput())) {
                sendResponse(200, ['success' => true]);
            }
            sendResponse(400, ['error' => 'Update failed']);
            
        case 'DELETE':
            if (!$id) sendResponse(400, ['error' => 'ID required']);
            $existing = $user->find($id);
            if (!$existing) sendResponse(404, ['error' => 'User not found']);
            
            if ($existing->update(['is_active' => false])) {
                sendResponse(200, ['success' => true]);
            }
            sendResponse(400, ['error' => 'Delete failed']);
    }
}

function handleDesigners(string $method, ?string $id, ?string $action): void {
    $designer = new Designer();
    $input = getInput();
    
    switch ($method) {
        case 'GET':
            if ($id) {
                $result = $designer->find($id);
                if (!$result) sendResponse(404, ['error' => 'Designer not found']);
                
                $data = $result->toArray();
                $data['skills'] = $result->getSkills();
                $data['portfolio'] = $result->getPortfolioItems();
                $data['posts'] = $result->getPosts();
                $data['user'] = $result->getUser()?->toArray();
                sendResponse(200, $data);
            }
            
            // Browse designers
            $client = new Client();
            $results = $client->browseDesigners(
                $_GET['skill'] ?? null,
                isset($_GET['min_rating']) ? (float)$_GET['min_rating'] : null,
                (int)($_GET['page'] ?? 1)
            );
            sendResponse(200, $results);
            
        case 'POST':
            if ($action === 'test') {
                $existing = $designer->find($id);
                if (!$existing) sendResponse(404, ['error' => 'Designer not found']);
                sendResponse(200, $existing->takeDesignerTest());
            }
            
            $result = $designer->createProfile($input['user_id'], $input);
            sendResponse(201, ['success' => true, 'designer' => $result->toArray()]);
            
        case 'PUT':
            if (!$id) sendResponse(400, ['error' => 'ID required']);
            $existing = $designer->find($id);
            if (!$existing) sendResponse(404, ['error' => 'Designer not found']);
            
            if ($action === 'skill') {
                $success = $existing->addSkill(
                    (int)$input['skill_id'], 
                    (int)($input['proficiency'] ?? 1)
                );
                sendResponse(200, ['success' => $success]);
            }
            
            if ($existing->update($input)) {
                sendResponse(200, ['success' => true]);
            }
            sendResponse(400, ['error' => 'Update failed']);
    }
}

function handleClients(string $method, ?string $id, ?string $action): void {
    $client = new Client();
    $input = getInput();
    
    switch ($method) {
        case 'GET':
            if ($id) {
                $result = $client->find($id);
                if (!$result) sendResponse(404, ['error' => 'Client not found']);
                
                $data = $result->toArray();
                $data['requests'] = $result->getServiceRequests();
                $data['user'] = $result->getUser()?->toArray();
                sendResponse(200, $data);
            }
            sendResponse(200, $client->all((int)($_GET['page'] ?? 1)));
            
        case 'POST':
            $result = $client->createProfile($input['user_id'], $input);
            sendResponse(201, ['success' => true, 'client' => $result->toArray()]);
            
        case 'PUT':
            if (!$id) sendResponse(400, ['error' => 'ID required']);
            $existing = $client->find($id);
            if (!$existing) sendResponse(404, ['error' => 'Client not found']);
            
            if ($existing->update($input)) {
                sendResponse(200, ['success' => true]);
            }
            sendResponse(400, ['error' => 'Update failed']);
    }
}

function handlePosts(string $method, ?string $id, ?string $action): void {
    $post = new Post();
    $input = getInput();
    
    switch ($method) {
        case 'GET':
            if ($id) {
                $result = $post->find($id);
                if (!$result) sendResponse(404, ['error' => 'Post not found']);
                
                $data = $result->toArray();
                $data['author'] = $result->getAuthor();
                $data['type'] = $result->getType();
                sendResponse(200, $data);
            }
            
            // Feed
            $db = Database::getInstance();
            $type = $_GET['type'] ?? null;
            $sql = "
                SELECT p.*, pt.type_name 
                FROM posts p
                JOIN post_types pt ON p.type_id = pt.type_id
                WHERE p.is_published = TRUE
            ";
            $params = [];
            if ($type) {
                $sql .= " AND pt.type_name = ?";
                $params[] = $type;
            }
            $sql .= " ORDER BY p.created_at DESC LIMIT 20";
            
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            sendResponse(200, $stmt->fetchAll());
            
        case 'POST':
            $result = $post->create($input);
            sendResponse(201, ['success' => true, 'post' => $result->toArray()]);
            
        case 'PUT':
            if (!$id) sendResponse(400, ['error' => 'ID required']);
            $existing = $post->find($id);
            if (!$existing) sendResponse(404, ['error' => 'Post not found']);
            
            switch ($action) {
                case 'publish':
                    sendResponse(200, ['success' => $existing->publish()]);
                case 'like':
                    sendResponse(200, ['success' => $existing->like()]);
                case 'unlike':
                    sendResponse(200, ['success' => $existing->unlike()]);
                default:
                    sendResponse(200, ['success' => $existing->update($input)]);
            }
    }
}

function handleRequests(string $method, ?string $id, ?string $action): void {
    $request = new ServiceRequest();
    $input = getInput();
    
    switch ($method) {
        case 'GET':
            if ($id) {
                $result = $request->find($id);
                if (!$result) sendResponse(404, ['error' => 'Request not found']);
                
                $data = $result->toArray();
                $data['status'] = $result->getStatus();
                $data['client'] = $result->getClient()?->toArray();
                $data['designers'] = $result->getDesigners();
                $data['chat'] = $result->getChat()?->toArray();
                sendResponse(200, $data);
            }
            sendResponse(200, $request->all((int)($_GET['page'] ?? 1)));
            
        case 'POST':
            $result = $request->create($input);
            sendResponse(201, ['success' => true, 'request' => $result->toArray()]);
            
        case 'PUT':
            if (!$id) sendResponse(400, ['error' => 'ID required']);
            $existing = $request->find($id);
            if (!$existing) sendResponse(404, ['error' => 'Request not found']);
            
            switch ($action) {
                case 'accept':
                    sendResponse(200, [
                        'success' => $existing->accept($input['designer_id'])
                    ]);
                case 'cancel':
                    sendResponse(200, ['success' => $existing->cancel()]);
                case 'complete':
                    sendResponse(200, ['success' => $existing->complete()]);
                case 'invite':
                    sendResponse(200, [
                        'success' => $existing->inviteDesigner($input['designer_id'])
                    ]);
                default:
                    sendResponse(200, ['success' => $existing->update($input)]);
            }
    }
}

function handleChats(string $method, ?string $id, ?string $action): void {
    $chat = new Chat();
    $input = getInput();
    
    switch ($method) {
        case 'GET':
            if (!$id) sendResponse(400, ['error' => 'Chat ID required']);
            $result = $chat->find($id);
            if (!$result) sendResponse(404, ['error' => 'Chat not found']);
            
            $data = $result->toArray();
            $data['participants'] = $result->getParticipants();
            
            if ($action === 'history') {
                $data['messages'] = $result->getHistory(
                    $input['user_id'] ?? getAuthUserId(),
                    (int)($_GET['limit'] ?? 50)
                );
            }
            sendResponse(200, $data);
            
        case 'POST':
            $result = $chat->create($input);
            sendResponse(201, ['success' => true, 'chat' => $result->toArray()]);
            
        case 'PUT':
            if (!$id) sendResponse(400, ['error' => 'Chat ID required']);
            $existing = $chat->find($id);
            if (!$existing) sendResponse(404, ['error' => 'Chat not found']);
            
            switch ($action) {
                case 'message':
                    $message = $existing->sendMessage(
                        $input['sender_id'],
                        $input['content']
                    );
                    sendResponse(201, [
                        'success' => true,
                        'message' => $message->toArray()
                    ]);
                case 'join':
                    sendResponse(200, [
                        'success' => $existing->join($input['user_id'])
                    ]);
                case 'participant':
                    sendResponse(200, [
                        'success' => $existing->addParticipant(
                            $input['user_id'],
                            $input['is_admin'] ?? false
                        )
                    ]);
                default:
                    sendResponse(200, ['success' => $existing->update($input)]);
            }
    }
}

function handlePortfolio(string $method, ?string $id, ?string $action): void {
    $item = new PortfolioItem();
    $input = getInput();
    
    switch ($method) {
        case 'GET':
            if ($id) {
                $result = $item->find($id);
                if (!$result) sendResponse(404, ['error' => 'Item not found']);
                
                $data = $result->toArray();
                $data['categories'] = $result->getCategories();
                sendResponse(200, $data);
            }
            sendResponse(200, $item->all((int)($_GET['page'] ?? 1)));
            
        case 'POST':
            $result = $item->create($input);
            sendResponse(201, ['success' => true, 'item' => $result->toArray()]);
            
        case 'PUT':
            if (!$id) sendResponse(400, ['error' => 'ID required']);
            $existing = $item->find($id);
            if (!$existing) sendResponse(404, ['error' => 'Item not found']);
            
            if ($action === 'category') {
                sendResponse(200, [
                    'success' => $existing->addCategory((int)$input['category_id'])
                ]);
            }
            sendResponse(200, ['success' => $existing->update($input)]);
            
        case 'DELETE':
            if (!$id) sendResponse(400, ['error' => 'ID required']);
            $existing = $item->find($id);
            if (!$existing) sendResponse(404, ['error' => 'Item not found']);
            
            sendResponse(200, ['success' => $existing->deleteItem()]);
    }
}