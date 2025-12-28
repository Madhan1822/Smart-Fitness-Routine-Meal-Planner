# 🚀 Quick Start Guide - Smart Fitness Backend

## Prerequisites Checklist
- ✅ Node.js v16+ installed
- ✅ MySQL v8.0+ installed and running
- ✅ npm or yarn installed

## Step-by-Step Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages:
- express
- mysql2
- typescript
- jsonwebtoken
- bcrypt
- cors
- dotenv
- express-validator

### 3. Configure Environment
Create a `.env` file in the backend directory with these settings:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fitness_app

JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:4200
```

**Important:** Replace `your_mysql_password` with your actual MySQL password!

### 4. Setup Database
```bash
npm run db:setup
```

This command will:
- Connect to MySQL
- Create the `fitness_app` database (if it doesn't exist)
- Create the `Users` table
- Create the `WorkoutMealPlans` table

Expected output:
```
🔧 Setting up database...
✅ MySQL Connected Successfully
✅ Database tables initialized successfully!
✅ Database setup completed successfully!
```

### 5. Start Development Server
```bash
npm run dev
```

Expected output:
```
============================================================
🚀 Smart Fitness API Server Started Successfully!
============================================================
📍 Server running on: http://localhost:5000
🌍 Environment: development
📊 Database: fitness_app

📚 API Endpoints:
   - Health Check: http://localhost:5000/api/health
   - Users: http://localhost:5000/api/users
   - Plans: http://localhost:5000/api/plans
   - Meals: http://localhost:5000/api/meals
   - Progress: http://localhost:5000/api/progress
============================================================
```

### 6. Test the API
Open your browser or use curl:

```bash
# Health check
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Smart Fitness API is running",
  "timestamp": "2025-12-28T01:00:00.000Z"
}
```

## Quick Test - Create Your First User

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "age": 25,
    "gender": "male",
    "height": 175,
    "weight": 70,
    "goal": "weight_loss"
  }'
```

You should receive a response with:
- User details
- JWT token (save this for authenticated requests!)

## Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:** 
- Ensure MySQL is running
- Check your DB credentials in `.env`
- Verify the database user has proper permissions

```bash
# Test MySQL connection
mysql -u root -p
```

### Issue: "Port 5000 already in use"
**Solution:** 
- Change the PORT in `.env` to another port (e.g., 5001)
- Or kill the process using port 5000

### Issue: "Module not found"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Read the API Documentation:** `README.md`
2. **View API Examples:** `API_EXAMPLES.md`
3. **Test all endpoints** using Postman or curl
4. **Integrate with frontend** at `http://localhost:4200`

## Available Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Setup/reset database
npm run db:setup
```

## Project Structure Overview

```
backend/
├── src/
│   ├── config/              # Configuration
│   ├── controllers/         # Request handlers
│   ├── database/            # DB connection
│   ├── middleware/          # Auth, validation, errors
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── types/               # TypeScript types
│   ├── app.ts               # Express setup
│   └── server.ts            # Entry point
├── .env                     # Environment variables
├── package.json
└── tsconfig.json
```

## Testing Workflow

1. **Create a user** → Get JWT token
2. **Generate plans** → Use the token
3. **Complete exercises** → Track progress
4. **Consume meals** → Track nutrition
5. **View progress** → See statistics

## Support

If you encounter any issues:
1. Check the console logs
2. Verify database connection
3. Ensure all environment variables are set
4. Review the API documentation

---

**Ready to build amazing fitness applications!** 💪

Last Updated: December 28, 2025
