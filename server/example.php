<?php
declare(strict_types=1);
require_once 'Models.php';

echo "=== Design Platform Example Usage ===\n\n";

try {
    // 1. Create users
    $user = new User();
    
    // Register a designer
    $designerUser = $user->register(
        'designer@example.com',
        'password123',
        'Alice Designer',
        'Designer'
    );
    echo "✅ Designer user created: {$designerUser->full_name} ({$designerUser->user_id})\n";
    
    // Register a client
    $clientUser = $user->register(
        'client@example.com',
        'password123',
        'Bob Client',
        'Client'
    );
    echo "✅ Client user created: {$clientUser->full_name} ({$clientUser->user_id})\n";
    
    // 2. Create profiles
    $designer = (new Designer())->createProfile($designerUser->user_id, [
        'portfolio_url' => 'https://portfolio.com/alice',
        'rating' => 4.5
    ]);
    echo "✅ Designer profile created: {$designer->designer_id}\n";
    
    $client = (new Client())->createProfile($clientUser->user_id, [
        'company_name' => 'Acme Corporation'
    ]);
    echo "✅ Client profile created: {$client->client_id}\n";
    
    // 3. Add skills to designer
    $designer->addSkill(1, 5); // Logo design, proficiency 5
    $designer->addSkill(2, 4); // Brand identity, proficiency 4
    $designer->addSkill(5, 5); // UI design, proficiency 5
    echo "✅ Skills added to designer\n";
    
    // 4. Upload portfolio items
    $portfolioItem = $designer->uploadPortfolio(
        'Modern Logo Collection',
        'https://cdn.example.com/logo1.jpg',
        [1, 2], // Logo design, Brand identity categories
        'A collection of modern minimalist logos'
    );
    echo "✅ Portfolio item uploaded: {$portfolioItem->item_id}\n";
    
    // 5. Designer creates a SHOWCASE post
    $post = $designer->createPost(
        'Check out my latest UI design work!',
        'https://cdn.example.com/ui-work.jpg',
        null
    );
    $post->publish();
    echo "✅ Designer post published: {$post->post_id}\n";
    
    // 6. Client requests service (creates BRIEF post + service request)
    $requestData = $client->requestService(
        'Need a Mobile App UI Design',
        'Looking for a talented designer to create a modern mobile app interface',
        2500.00,
        'https://cdn.example.com/brief-assets.zip'
    );
    echo "✅ Service request created: {$requestData['request_id']}\n";
    echo "   Associated post: {$requestData['post_id']}\n";
    
    // 7. Designer accepts the request
    $serviceRequest = (new ServiceRequest())->find($requestData['request_id']);
    $serviceRequest->accept($designer->designer_id);
    echo "✅ Request accepted by designer\n";
    
    // 8. Chat is automatically created - send messages
    $chat = $serviceRequest->getChat();
    if ($chat) {
        $msg1 = $chat->sendMessage($clientUser->user_id, "Hi Alice! Excited to work with you.");
        echo "✅ Client sent message: {$msg1->message_id}\n";
        
        $msg2 = $chat->sendMessage($designerUser->user_id, "Thanks Bob! I'll start right away.");
        echo "✅ Designer sent message: {$msg2->message_id}\n";
        
        // Get chat history
        $history = $chat->getHistory($clientUser->user_id, 50);
        echo "✅ Chat history retrieved: " . count($history) . " messages\n";
    }
    
    // 9. Complete the request
    $serviceRequest->complete();
    echo "✅ Request marked as completed\n";
    
    // 10. Browse designers as client
    $designers = $client->browseDesigners('UI design', 4.0, 1);
    echo "✅ Found " . count($designers) . " designers matching criteria\n";
    
    echo "\n=== All operations completed successfully! ===\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}