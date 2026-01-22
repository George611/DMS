Disaster Management System (DMS)

A real-time platform for national disaster management, designed to coordinate alerts, volunteers, and resources efficiently.

Features

Live Alerts: Real-time situational updates with dynamic tickers.

Multilingual Support: English, Spanish, French, and Arabic (with RTL support).

Role-Based Access: Customized dashboards for Authorities, Volunteers, and Citizens.

Resource Management: Track and allocate assets, beds, and personnel.

Audit Logs: Comprehensive logs for system activities and actions.

Frontend Setup (React + Vite)
Prerequisites

Node.js v18 or higher

npm or yarn

Installation
git clone https://github.com/George611/DMS.git
cd DMS
npm install

Running Locally
npm run dev


The app will be available at http://localhost:5173
.

Backend Setup (Node.js + MySQL)
1. Database Configuration

Install MySQL Server.

Create a database named dms_db.

Create the users table:

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
.

Project Structure
src/
├─ components/     # Reusable UI components
├─ context/        # React Context Providers (Auth, Theme, Language, Alert, Audit)
├─ pages/          # Page-level components (Public, Auth, Dashboard, etc.)
├─ services/       # API client & data services
├─ utils/          # Mock data & helper functions
server/            # Node.js Express backend (API)

Contributing

We welcome contributions!

Fork the repository.

Create a feature branch:

git checkout -b feature/YourFeatureName


Commit your changes:

git commit -m "Add some feature"


Push to your branch:

git push origin feature/YourFeatureName


Open a Pull Request.

License

© 2025 Disaster Management System