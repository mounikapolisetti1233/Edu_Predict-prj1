# EduPredict – AI-Powered Student Performance Prediction System

## Project Structure

```
React Project/
├── backend/                    # Node.js + Express + MongoDB
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js   ✅ Updated (USER_NOT_FOUND code)
│   │   ├── adminController.js
│   │   ├── studentController.js
│   │   └── predictionController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   └── Prediction.js
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/                   # React.js
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/api.js           ← Axios client with JWT interceptor
    │   ├── components/
    │   │   ├── DashboardLayout.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   ├── AuthContext.js   ← JWT + localStorage session
    │   │   └── ToastContext.js  ← Toast notifications
    │   ├── pages/
    │   │   ├── LoginPage.js     ✅ Updated (blank fields, no admin card)
    │   │   ├── RegisterPage.js  ✅ New (redirects to dashboard)
    │   │   ├── DashboardPage.js ✅ New (charts, stats)
    │   │   ├── StudentsPage.js  ✅ New (CRUD)
    │   │   ├── PredictionsPage.js ✅ New
    │   │   └── AdminPage.js     ✅ New
    │   ├── App.js               ✅ Updated routing
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## What Was Changed

### Backend (`authController.js`)
- Login now returns **`code: "USER_NOT_FOUND"`** with message `"Please register first"` when an email is not registered
- Wrong password still returns `"Invalid email or password"`

### Frontend (`LoginPage.js`) — ALL 3 Requirements
1. ✅ **Empty Input Fields**: Email and password start blank, no pre-filled values
2. ✅ **"Default Admin Account" card REMOVED** entirely  
3. ✅ **Auth Flow**: When unregistered email used → toast says "Please register first"
4. ✅ **"Register here" link** navigates to `/register`
5. ✅ **Successful login** redirects to `/dashboard`

## Running the Project

### 1. Start Backend
```bash
cd backend
npm install
npm start        # runs on port 5000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm start        # runs on port 3000
```

### 3. Environment
Backend `.env` already configured with:
- MongoDB Atlas URI
- JWT Secret
- Admin credentials (for seeding only)

To seed admin:
```bash
cd backend
node seedAdmin.js
```

## Authentication Flow

| Scenario | Response |
|---|---|
| Email not registered | Toast: "Please register first" + field error |
| Wrong password | Toast: "Invalid email or password" |
| Successful login | Redirect to `/dashboard` |
| Successful register | Auto-login + redirect to `/dashboard` |
| Expired token | Auto-redirect to `/login` |
