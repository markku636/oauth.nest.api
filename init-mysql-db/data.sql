-- Insert 5 users with predefined email addresses
INSERT INTO `User` (email, password, clientId, clientSecret)
VALUES 
('user1@example.com', '$2b$10$ibQugUYqT.1RvqOZA3AqxuWbzo5QRsbQ1j9NnxTkQK/E5qpjPzpPu', 'clientId1', 'clientSecret1'),
('user2@example.com', '$2b$10$ibQugUYqT.1RvqOZA3AqxuWbzo5QRsbQ1j9NnxTkQK/E5qpjPzpPu', 'clientId2', 'clientSecret2'),
('user3@example.com', '$2b$10$ibQugUYqT.1RvqOZA3AqxuWbzo5QRsbQ1j9NnxTkQK/E5qpjPzpPu', 'clientId3', 'clientSecret3'),
('user4@example.com', '$2b$10$ibQugUYqT.1RvqOZA3AqxuWbzo5QRsbQ1j9NnxTkQK/E5qpjPzpPu', 'clientId4', 'clientSecret4'),
('user5@example.com', '$2b$10$ibQugUYqT.1RvqOZA3AqxuWbzo5QRsbQ1j9NnxTkQK/E5qpjPzpPu', 'clientId5', 'clientSecret5');
