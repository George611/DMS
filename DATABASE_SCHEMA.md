# DMS Database Schema (MySQL)

This document defines the schema for the Disaster Management System (DMS).

## Category 1: Authentication & User Management
### `users`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `name`: VARCHAR(255) NOT NULL
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `password`: VARCHAR(255) NOT NULL
- `role`: ENUM('authority', 'volunteer', 'citizen') DEFAULT 'citizen'
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

### `roles`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `name`: VARCHAR(50) UNIQUE NOT NULL
- `description`: TEXT

### `permissions`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `name`: VARCHAR(100) UNIQUE NOT NULL
- `description`: TEXT

### `user_roles`
- `user_id`: INT, FOREIGN KEY (users.id)
- `role_id`: INT, FOREIGN KEY (roles.id)
- PRIMARY KEY (user_id, role_id)

### `role_permissions`
- `role_id`: INT, FOREIGN KEY (roles.id)
- `permission_id`: INT, FOREIGN KEY (permissions.id)
- PRIMARY KEY (role_id, permission_id)

### `user_sessions`
- `id`: VARCHAR(255) PRIMARY KEY
- `user_id`: INT, FOREIGN KEY (users.id)
- `token`: TEXT
- `expires_at`: TIMESTAMP
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### `password_resets`
- `email`: VARCHAR(255)
- `token`: VARCHAR(255)
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### `email_verifications`
- `email`: VARCHAR(255)
- `token`: VARCHAR(255)
- `verified`: BOOLEAN DEFAULT FALSE

## Category 2: Alert Management
### `alert_types`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `name`: VARCHAR(50) NOT NULL (e.g., 'Flash Flood', 'Fire')
- `severity_level`: ENUM('low', 'medium', 'high', 'critical')

### `alerts`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `type_id`: INT, FOREIGN KEY (alert_types.id)
- `title`: VARCHAR(255)
- `description`: TEXT
- `location_lat`: DECIMAL(10, 8)
- `location_lng`: DECIMAL(11, 8)
- `status`: ENUM('active', 'resolved', 'archived')
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### `alert_history`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `alert_id`: INT, FOREIGN KEY (alerts.id)
- `action`: VARCHAR(255)
- `timestamp`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### `alert_recipients`
- `alert_id`: INT, FOREIGN KEY (alerts.id)
- `user_id`: INT, FOREIGN KEY (users.id)
- `delivered_at`: TIMESTAMP

## Category 3: Incident / Disaster Management
### `incident_types`
- Same as alert_types or combined.

### `incidents`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `type_id`: INT
- `reporter_id`: INT (users.id)
- `severity`: ENUM
- `status`: ENUM('reported', 'investigating', 'responding', 'resolved')
- `created_at`: TIMESTAMP

### `incident_updates`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `incident_id`: INT
- `update_text`: TEXT
- `created_at`: TIMESTAMP

### `incident_attachments`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `incident_id`: INT
- `file_url`: VARCHAR(255)
- `file_type`: VARCHAR(50)

### `incident_assignments`
- `incident_id`: INT
- `team_id`: INT
- `assigned_at`: TIMESTAMP

## Category 4: Resource Management
### `volunteers`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `user_id`: INT (users.id)
- `status`: ENUM('available', 'deployed', 'on_leave')

### `volunteer_skills`
- `volunteer_id`: INT
- `skill`: VARCHAR(100)

### `volunteer_deployments`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `volunteer_id`: INT
- `incident_id`: INT
- `start_date`: TIMESTAMP
- `end_date`: TIMESTAMP

### `hospitals`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `name`: VARCHAR(255)
- `lat`: DECIMAL, `lng`: DECIMAL

### `hospital_capacity`
- `hospital_id`: INT
- `total_beds`: INT
- `available_beds`: INT
- `icu_available`: INT

### `inventory_categories`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `name`: VARCHAR(100)

### `inventory_items`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `category_id`: INT
- `name`: VARCHAR(255)

### `inventory_stock`
- `item_id`: INT
- `location_id`: INT
- `quantity`: INT

### `inventory_transactions`
- `id`: INT AUTO_INCREMENT PRIMARY KEY
- `item_id`: INT
- `type`: ENUM('in', 'out')
- `quantity`: INT
- `timestamp`: TIMESTAMP

## Category 5: Organization & Teams
### `organizations`, `departments`, `teams`, `team_members`
- Standard hierarchical structure with name, parent_id, and many-to-many relationships.

## Category 6: Geography & Locations
### `locations`, `zones`, `geofences`
- Spatial data (lat/lng, polygons, status).

## Category 7: Audit & Compliance
### `audit_logs`, `user_activities`
- `id`, `user_id`, `action`, `details`, `ip_address`, `timestamp`.

## Category 8: Notifications & Communication
### `notification_templates`, `notifications`, `notification_preferences`
- Template body, user_id, read_status, channels (email, sms, push).

## Category 9: System Configuration
### `system_settings`, `feature_flags`
- `key`, `value`, `type`, `is_enabled`.
