# RPP Auto Database Schema

## Overview
Complete database schema with 18 core tables deployed to Supabase.

## Database Connection
- **Project**: gfhthbmbgoxqqbzxnauv
- **Host**: db.gfhthbmbgoxqqbzxnauv.supabase.co
- **Schema**: public

## Tables

### 1. users
User profiles extending Supabase auth.users
- `id` (UUID, PK) - References auth.users
- `email`, `full_name`, `phone`
- `preferences` (JSONB)
- RLS: Users can view/update own profile

### 2. vehicles
User's registered vehicles
- `id` (UUID, PK)
- `user_id` (FK → users)
- `vin` (unique), `make`, `model`, `year`
- `mileage`, `license_plate`, `nickname`
- RLS: Users manage own vehicles

### 3. obd2_connections
Bluetooth OBD2 device connections
- `id` (UUID, PK)
- `vehicle_id` (FK → vehicles)
- `device_mac_address`, `device_name`
- `is_active`, `last_connected_at`

### 4. diagnostic_codes
DTC code master database
- `id` (UUID, PK)
- `code` (unique), `description`
- `severity` (critical/warning/info)
- `category`, `recommended_action`

### 5. vehicle_diagnostics
Detected diagnostic issues
- `id` (UUID, PK)
- `vehicle_id`, `diagnostic_code_id`
- `detected_at`, `resolved_at`
- `status` (active/resolved/ignored)
- `ai_analysis`, `sensor_data` (JSONB)

### 6. vehicle_health_snapshots
Real-time vehicle health metrics
- `id` (UUID, PK)
- `vehicle_id` (FK)
- `health_score` (0-100)
- `battery_voltage`, `coolant_temp`
- `odometer_reading`, `tire_pressure` (JSONB)

### 7. service_providers
Mechanics and service centers
- `id` (UUID, PK)
- `name`, `business_type`
- `address`, `city`, `state`
- `latitude`, `longitude`
- `rating`, `certifications`

### 8. service_appointments
Scheduled service appointments
- `id` (UUID, PK)
- `user_id`, `vehicle_id`, `provider_id`
- `appointment_type`, `status`
- `scheduled_at`, `estimated_cost`

### 9. maintenance_history
Service history records
- `id` (UUID, PK)
- `vehicle_id`, `appointment_id`
- `service_type`, `service_date`
- `cost`, `parts_used` (JSONB)
- `next_service_mileage`, `next_service_date`

### 10. parts_catalog
Parts database
- `id` (UUID, PK)
- `part_number` (unique), `part_name`
- `compatible_makes`, `compatible_models`
- `average_price`, `specifications` (JSONB)

### 11. parts_recommendations
AI-recommended parts
- `id` (UUID, PK)
- `vehicle_id`, `diagnostic_id`, `part_id`
- `recommendation_reason`
- `priority`, `ai_confidence_score`

### 12. ai_conversations
AI chat conversations
- `id` (UUID, PK)
- `user_id`, `vehicle_id`
- `conversation_type`, `agent_type`
- `status` (active/resolved/archived)

### 13. ai_messages
Individual chat messages
- `id` (UUID, PK)
- `conversation_id` (FK)
- `sender_type` (user/agent)
- `message_text`, `intent_detected`
- `confidence_score`, `attachments` (JSONB)

### 14. ai_agent_actions
Agent actions and responses
- `id` (UUID, PK)
- `conversation_id`, `message_id`
- `action_type`, `action_status`
- `action_params`, `action_result` (JSONB)

### 15. notifications
Push/email notifications
- `id` (UUID, PK)
- `user_id`, `notification_type`
- `title`, `body`, `priority`
- `status` (unread/read/dismissed)
- `delivery_channels` (array)

### 16. user_activity_log
User activity tracking
- `id` (UUID, PK)
- `user_id`, `activity_type`
- `device_info` (JSONB), `ip_address`
- `timestamp`

### 17. app_feedback
User feedback and bug reports
- `id` (UUID, PK)
- `user_id`, `feedback_type`
- `rating` (1-5), `message`
- `screenshot_urls`, `device_info` (JSONB)

### 18. analytics_events
Analytics and usage data
- `id` (UUID, PK)
- `user_id`, `event_name`, `event_category`
- `event_properties` (JSONB)
- `screen_name`, `session_id`

## Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Policies: Users access only their own data
- ✅ Foreign key constraints
- ✅ Indexed for performance

## Created
January 13, 2026 - Week 1 Phase 1
