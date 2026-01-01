# Disaster Management System (DMS)

A real-time coordination and response platform for national disaster management.

## Features
- **Live Alerts**: Real-time situational awareness with dynamic tickers.
- **Multilingual Support**: English, Spanish, French, and Arabic (RTL support).
- **Role-based Access**: Custom dashboards for Authorities, Volunteers, and Citizens.
- **Resource Management**: Track and allocate assets, beds, and personnel.
- **Audit Logs**: Comprehensive tracking of system activities.

---

## 🚀 Frontend Setup (React + Vite)

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/George611/DMS.git
cd DMS
npm install
```

### 3. Running Locally
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🛠️ Backend Setup (Node.js + MySQL) - *In Progress*

### 1. Database Configuration
1. Install MySQL Server.
2. Create a database named `dms_db`.
3. Create the `users` table:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('authority', 'volunteer', 'citizen') DEFAULT 'citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Environment Variables
Create a `.env` file in the `server/` directory:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=dms_db
PORT=5000
```

### 3. Running the Server
```bash
cd server
npm install
node index.js
```

---

## 📂 Project Structure
- `src/components`: Reusable UI components.
- `src/context`: React Context providers (Auth, Theme, Language, Alert, Audit).
- `src/pages`: Page-level components (Public, Auth, Dashboard, etc.).
- `src/services`: API client and data services.
- `src/utils`: Mock data and helper functions.
- `server/`: Node.js Express backend (API).

---

## 🤝 Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License
© 2025 Disaster Management System