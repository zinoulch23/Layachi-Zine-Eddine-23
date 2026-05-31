-- ============================================
-- DATABASE CREATION
-- ============================================
DROP DATABASE IF EXISTS design_platform;
CREATE DATABASE design_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE design_platform;

-- ============================================
-- ENUMERATIONS (Lookup Tables)
-- ============================================

CREATE TABLE user_roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name ENUM('Designer', 'Client') NOT NULL UNIQUE
);

INSERT INTO user_roles (role_name) VALUES ('Designer'), ('Client');

CREATE TABLE designer_skills (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO designer_skills (skill_name) VALUES 
('Logo design'), ('Brand identity'), ('Typography'), ('Color theory'),
('UI design'), ('UX research'), ('Wireframing & prototyping'),
('Illustration'), ('Motion design'), ('Design systems');

CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO categories (category_name) VALUES 
('Logo design'), ('Brand identity'), ('Typography'), ('Color theory'),
('UI design'), ('UX research'), ('Wireframing & prototyping'),
('Illustration'), ('Motion design'), ('Design systems');

CREATE TABLE post_types (
    type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name ENUM('SHOWCASE', 'BRIEF') NOT NULL UNIQUE,
    description VARCHAR(50)
);

INSERT INTO post_types (type_name, description) VALUES 
('SHOWCASE', 'designer work'),
('BRIEF', 'client request');

CREATE TABLE service_statuses (
    status_id INT PRIMARY KEY AUTO_INCREMENT,
    status_name ENUM('PENDING', 'ACTIVE', 'DONE', 'CANCELLED') NOT NULL UNIQUE
);

INSERT INTO service_statuses (status_name) VALUES 
('PENDING'), ('ACTIVE'), ('DONE'), ('CANCELLED');

CREATE TABLE chat_types (
    chat_type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO chat_types (type_name) VALUES ('Direct'), ('Group');

-- ============================================
-- CORE TABLES
-- ============================================

CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    role_id INT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES user_roles(role_id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_role (role_id)
);

CREATE TABLE designers (
    designer_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    portfolio_url VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT chk_designer_rating CHECK (rating >= 0 AND rating <= 5.0)
);

CREATE TABLE clients (
    client_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    company_name VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Junction: Designer Skills (many-to-many)
CREATE TABLE designer_skill_assignments (
    designer_id VARCHAR(36) NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level INT DEFAULT 1 CHECK (proficiency_level BETWEEN 1 AND 5),
    PRIMARY KEY (designer_id, skill_id),
    FOREIGN KEY (designer_id) REFERENCES designers(designer_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES designer_skills(skill_id) ON DELETE CASCADE
);

CREATE TABLE portfolio_items (
    item_id VARCHAR(36) PRIMARY KEY,
    designer_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    media_url VARCHAR(500) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (designer_id) REFERENCES designers(designer_id) ON DELETE CASCADE,
    INDEX idx_designer (designer_id)
);

-- Junction: Portfolio Categories (many-to-many)
CREATE TABLE portfolio_item_categories (
    item_id VARCHAR(36) NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (item_id, category_id),
    FOREIGN KEY (item_id) REFERENCES portfolio_items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

CREATE TABLE posts (
    post_id VARCHAR(36) PRIMARY KEY,
    author_id VARCHAR(36) NOT NULL,
    author_type ENUM('designer', 'client') NOT NULL,
    caption TEXT,
    media_url VARCHAR(500),
    likes_count INT DEFAULT 0,
    type_id INT NOT NULL,
    budget DECIMAL(12,2),
    is_published BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES post_types(type_id),
    INDEX idx_author (author_id, author_type),
    INDEX idx_type (type_id),
    INDEX idx_created (created_at)
);

CREATE TABLE service_requests (
    request_id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    post_id VARCHAR(36),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(12,2),
    status_id INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    accepted_at DATETIME,
    completed_at DATETIME,
    cancelled_at DATETIME,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES service_statuses(status_id),
    INDEX idx_client (client_id),
    INDEX idx_status (status_id)
);

-- Junction: Service Request Designers
CREATE TABLE service_request_designers (
    request_id VARCHAR(36) NOT NULL,
    designer_id VARCHAR(36) NOT NULL,
    relationship_type ENUM('invited', 'applied', 'assigned') DEFAULT 'invited',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (request_id, designer_id),
    FOREIGN KEY (request_id) REFERENCES service_requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (designer_id) REFERENCES designers(designer_id) ON DELETE CASCADE
);

CREATE TABLE chats (
    chat_id VARCHAR(36) PRIMARY KEY,
    chat_type_id INT NOT NULL DEFAULT 1,
    related_request_id VARCHAR(36),
    title VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_type_id) REFERENCES chat_types(chat_type_id),
    FOREIGN KEY (related_request_id) REFERENCES service_requests(request_id) ON DELETE SET NULL,
    INDEX idx_request (related_request_id)
);

-- Junction: Chat Participants
CREATE TABLE chat_participants (
    chat_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_read_at DATETIME,
    is_admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE messages (
    message_id VARCHAR(36) PRIMARY KEY,
    chat_id VARCHAR(36) NOT NULL,
    sender_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at DATETIME,
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_chat_sent (chat_id, sent_at)
);

-- ============================================
-- VIEWS
-- ============================================

CREATE VIEW designer_profiles AS
SELECT 
    u.user_id, u.email, u.full_name, u.bio, u.avatar_url, u.is_verified,
    d.designer_id, d.portfolio_url, d.rating, d.created_at,
    GROUP_CONCAT(DISTINCT ds.skill_name ORDER BY ds.skill_name) AS skills,
    COUNT(DISTINCT pi.item_id) AS portfolio_count,
    COUNT(DISTINCT p.post_id) AS post_count
FROM users u
JOIN designers d ON u.user_id = d.user_id
LEFT JOIN designer_skill_assignments dsa ON d.designer_id = dsa.designer_id
LEFT JOIN designer_skills ds ON dsa.skill_id = ds.skill_id
LEFT JOIN portfolio_items pi ON d.designer_id = pi.designer_id AND pi.is_active = TRUE
LEFT JOIN posts p ON d.designer_id = p.author_id AND p.author_type = 'designer'
GROUP BY u.user_id, d.designer_id;

CREATE VIEW client_profiles AS
SELECT 
    u.user_id, u.email, u.full_name, u.bio, u.avatar_url,
    c.client_id, c.company_name, c.created_at,
    COUNT(DISTINCT sr.request_id) AS total_requests,
    COUNT(DISTINCT CASE WHEN sr.status_id = 3 THEN sr.request_id END) AS completed_requests,
    COUNT(DISTINCT p.post_id) AS post_count
FROM users u
JOIN clients c ON u.user_id = c.user_id
LEFT JOIN service_requests sr ON c.client_id = sr.client_id
LEFT JOIN posts p ON c.client_id = p.author_id AND p.author_type = 'client'
GROUP BY u.user_id, c.client_id;

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER //

CREATE TRIGGER trg_update_request_status_timestamp
BEFORE UPDATE ON service_requests
FOR EACH ROW
BEGIN
    IF NEW.status_id != OLD.status_id THEN
        CASE NEW.status_id
            WHEN 2 THEN SET NEW.accepted_at = NOW();
            WHEN 3 THEN SET NEW.completed_at = NOW();
            WHEN 4 THEN SET NEW.cancelled_at = NOW();
        END CASE;
    END IF;
END//

CREATE TRIGGER trg_prevent_duplicate_chat_participants
BEFORE INSERT ON chat_participants
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM chat_participants 
        WHERE chat_id = NEW.chat_id AND user_id = NEW.user_id
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'User already in chat';
    END IF;
END//

DELIMITER ;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

CREATE PROCEDURE sp_create_designer_post(
    IN p_designer_id VARCHAR(36),
    IN p_caption TEXT,
    IN p_media_url VARCHAR(500),
    IN p_budget DECIMAL(12,2)
)
BEGIN
    DECLARE v_post_id VARCHAR(36);
    DECLARE v_type_id INT;
    
    SET v_post_id = UUID();
    SELECT type_id INTO v_type_id FROM post_types WHERE type_name = 'SHOWCASE';
    
    INSERT INTO posts (post_id, author_id, author_type, caption, media_url, type_id, budget)
    VALUES (v_post_id, p_designer_id, 'designer', p_caption, p_media_url, v_type_id, p_budget);
    
    SELECT v_post_id AS post_id;
END//

CREATE PROCEDURE sp_create_client_request(
    IN p_client_id VARCHAR(36),
    IN p_title VARCHAR(200),
    IN p_description TEXT,
    IN p_budget DECIMAL(12,2),
    IN p_media_url VARCHAR(500)
)
BEGIN
    DECLARE v_post_id VARCHAR(36);
    DECLARE v_request_id VARCHAR(36);
    DECLARE v_type_id INT;
    
    SET v_post_id = UUID();
    SET v_request_id = UUID();
    SELECT type_id INTO v_type_id FROM post_types WHERE type_name = 'BRIEF';
    
    START TRANSACTION;
    
    -- Create BRIEF post
    INSERT INTO posts (post_id, author_id, author_type, caption, media_url, type_id, budget)
    VALUES (v_post_id, p_client_id, 'client', p_description, p_media_url, v_type_id, p_budget);
    
    -- Create service request
    INSERT INTO service_requests (request_id, client_id, post_id, title, description, budget)
    VALUES (v_request_id, p_client_id, v_post_id, p_title, p_description, p_budget);
    
    -- Create chat for this request
    INSERT INTO chats (chat_id, chat_type_id, related_request_id, title)
    VALUES (UUID(), 1, v_request_id, CONCAT('Project: ', p_title));
    
    COMMIT;
    
    SELECT v_post_id AS post_id, v_request_id AS request_id;
END//

CREATE PROCEDURE sp_accept_service_request(
    IN p_request_id VARCHAR(36),
    IN p_designer_id VARCHAR(36)
)
BEGIN
    DECLARE v_chat_id VARCHAR(36);
    DECLARE v_user_id VARCHAR(36);
    
    START TRANSACTION;
    
    -- Update request status to ACTIVE
    UPDATE service_requests 
    SET status_id = 2, updated_at = NOW() 
    WHERE request_id = p_request_id;
    
    -- Assign designer
    INSERT INTO service_request_designers (request_id, designer_id, relationship_type)
    VALUES (p_request_id, p_designer_id, 'assigned')
    ON DUPLICATE KEY UPDATE relationship_type = 'assigned';
    
    -- Get chat ID and add designer to chat
    SELECT chat_id INTO v_chat_id FROM chats WHERE related_request_id = p_request_id;
    SELECT user_id INTO v_user_id FROM designers WHERE designer_id = p_designer_id;
    
    IF v_chat_id IS NOT NULL AND v_user_id IS NOT NULL THEN
        INSERT IGNORE INTO chat_participants (chat_id, user_id)
        VALUES (v_chat_id, v_user_id);
    END IF;
    
    COMMIT;
    
    SELECT p_request_id AS request_id, 'ACCEPTED' AS status;
END//

CREATE PROCEDURE sp_send_message(
    IN p_chat_id VARCHAR(36),
    IN p_sender_id VARCHAR(36),
    IN p_content TEXT
)
BEGIN
    DECLARE v_message_id VARCHAR(36);
    
    -- Verify sender is participant
    IF NOT EXISTS (
        SELECT 1 FROM chat_participants 
        WHERE chat_id = p_chat_id AND user_id = p_sender_id
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'User is not a participant of this chat';
    END IF;
    
    SET v_message_id = UUID();
    
    INSERT INTO messages (message_id, chat_id, sender_id, content)
    VALUES (v_message_id, p_chat_id, p_sender_id, p_content);
    
    -- Update chat timestamp
    UPDATE chats SET updated_at = NOW() WHERE chat_id = p_chat_id;
    
    SELECT v_message_id AS message_id;
END//

CREATE PROCEDURE sp_get_chat_history(
    IN p_chat_id VARCHAR(36),
    IN p_user_id VARCHAR(36),
    IN p_limit INT
)
BEGIN
    -- Verify user is participant
    IF NOT EXISTS (
        SELECT 1 FROM chat_participants 
        WHERE chat_id = p_chat_id AND user_id = p_user_id
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Access denied: not a participant';
    END IF;
    
    SELECT 
        m.message_id,
        m.sender_id,
        u.full_name AS sender_name,
        u.avatar_url AS sender_avatar,
        m.content,
        m.sent_at,
        m.is_read,
        m.is_edited,
        m.edited_at
    FROM messages m
    JOIN users u ON m.sender_id = u.user_id
    WHERE m.chat_id = p_chat_id
    ORDER BY m.sent_at DESC
    LIMIT p_limit;
    
    -- Mark messages as read
    UPDATE messages 
    SET is_read = TRUE 
    WHERE chat_id = p_chat_id 
    AND sender_id != p_user_id 
    AND is_read = FALSE;
END//

CREATE PROCEDURE sp_browse_designers(
    IN p_skill_filter VARCHAR(255),
    IN p_min_rating DECIMAL(2,1),
    IN p_page INT,
    IN p_per_page INT
)
BEGIN
    SET @offset = (p_page - 1) * p_per_page;
    
    SELECT 
        d.designer_id,
        u.full_name,
        u.avatar_url,
        d.portfolio_url,
        d.rating,
        GROUP_CONCAT(DISTINCT ds.skill_name) AS skills,
        COUNT(DISTINCT pi.item_id) AS portfolio_count
    FROM designers d
    JOIN users u ON d.user_id = u.user_id
    LEFT JOIN designer_skill_assignments dsa ON d.designer_id = dsa.designer_id
    LEFT JOIN designer_skills ds ON dsa.skill_id = ds.skill_id
    LEFT JOIN portfolio_items pi ON d.designer_id = pi.designer_id AND pi.is_active = TRUE
    WHERE (p_skill_filter IS NULL OR ds.skill_name = p_skill_filter)
    AND (p_min_rating IS NULL OR d.rating >= p_min_rating)
    GROUP BY d.designer_id
    ORDER BY d.rating DESC, d.created_at DESC
    LIMIT p_per_page OFFSET @offset;
END//

DELIMITER ;