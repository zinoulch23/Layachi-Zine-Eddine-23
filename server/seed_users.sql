-- Seed accounts for DesignConnect (run after design_platform.sql)
-- Passwords: Password123, DemoPass, Sample@2024 (bcrypt hashes below)

USE design_platform;

INSERT INTO users (user_id, email, password_hash, full_name, role_id, is_verified) VALUES
('seed-0001', 'testuser1@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test Designer', 1, TRUE),
('seed-0002', 'demo.user@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo Client', 2, TRUE),
('seed-0003', 'sample@testdomain.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sample Designer', 1, TRUE)
ON DUPLICATE KEY UPDATE email=email;

INSERT INTO designers (designer_id, user_id) VALUES
('seed-d-01', 'seed-0001', TRUE),
('seed-d-03', 'seed-0003', TRUE)
ON DUPLICATE KEY UPDATE user_id=user_id;

INSERT INTO clients (client_id, user_id) VALUES
('seed-c-01', 'seed-0002', TRUE)
ON DUPLICATE KEY UPDATE user_id=user_id;

-- Note: Replace password_hash values with bcrypt hashes from setup.php for production.
