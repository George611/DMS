Disaster Management System (DMS)
A real-time platform designed to coordinate disaster alerts, volunteers, and resources efficiently at a national level. DMS helps authorities respond faster, volunteers act smarter, and citizens stay informed.
________________________________________
Features
•	Live Alerts: Real-time notifications with dynamic tickers for ongoing disasters.
•	Multilingual Support: English, Spanish, French, and Arabic (with proper right-to-left layout support).
•	Role-Based Access: Different dashboards for Authorities, Volunteers, and Citizens.
•	Resource Management: Track and allocate assets, personnel, and available beds.
•	Audit Logs: Keep a record of all system activities for transparency and accountability.
________________________________________
Frontend Setup (React + Vite)
Prerequisites
•	Node.js v18 or higher
•	npm or yarn
Installation
git clone https://github.com/George611/DMS.git
cd DMS
npm install
Running Locally
npm run dev
Open your browser at: http://localhost:5173
________________________________________
Backend Setup (Node.js + MySQL)
1. Database Configuration
•	Install MySQL Server.
•	Create a database named dms_db.
•	Create the users table:
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('authority', 'volunteer', 'citizen') DEFAULT 'citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
2. Environment Variables
Create a .env file in the server/ directory:
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=dms_db
PORT=5000
3. Running the Server
cd server
npm install
node index.js
The backend will run at http://localhost:5000
________________________________________
Project Structure
src/
├─ components/     # Reusable UI components
├─ context/        # React Context Providers (Auth, Theme, Language, Alert, Audit)
├─ pages/          # Page-level components (Public, Auth, Dashboard, etc.)
├─ services/       # API client & data services
├─ utils/          # Mock data & helper functions
server/            # Node.js Express backend (API)
________________________________________
Quick Start & Example Flow
Here’s a simple walkthrough of how DMS works for each role:
________________________________________
1. Authority
•	Logs in to their dashboard.
•	Sends out live disaster alerts to all users.
•	Assigns volunteers and resources to affected areas.
•	Tracks beds, personnel, and assets in real time.
•	Can review audit logs to see all actions taken.
Example:
1.	A flood is reported.
2.	Authority logs in → creates a new alert → assigns 20 volunteers to affected zones.
3.	System automatically notifies volunteers and citizens.
________________________________________
2. Volunteer
•	Receives alerts in real-time.
•	Views their assigned tasks and locations.
•	Updates task status as completed.
Example:
1.	Volunteer sees flood alert → checks dashboard → sees they are assigned to Zone A.
2.	Confirms they are en route → updates status once the task is complete.
________________________________________
3. Citizen
•	Receives real-time alerts about disasters in their area.
•	Can view resources like shelters and aid stations.
Example:
1.	Citizen receives flood alert → sees nearby shelters and safe routes.
2.	Follows instructions to reach safety.
________________________________________
How it All Works Together
1.	Authority triggers alert → system updates in real-time.
2.	Volunteers and citizens get notified immediately.
3.	Resources and personnel are tracked and allocated dynamically.
4.	Audit logs ensure every action is recorded for accountability.
💡 Tip for Local Testing:
•	Open frontend at http://localhost:5173
•	Run backend at http://localhost:5000
•	Try logging in as different roles to see role-specific dashboards and alerts.
