# Smart Fitness Routine & Meal Planner - Backend API

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fitness_app
JWT_SECRET=your-secret-key
```

4. **Setup database**
```bash
npm run db:setup
```

5. **Start development server**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 User Management

### 1. Create User (Register)
**POST** `/api/users`

**Request Body:**
```json
{
  "name": "John Doe",
  "age": 25,
  "gender": "male",
  "height": 175,
  "weight": 70,
  "goal": "weight_loss",
  "role": "USER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "age": 25,
      "gender": "male",
      "height": 175,
      "weight": 70,
      "goal": "weight_loss",
      "role": "USER",
      "created_at": "2025-12-28T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- `name`: Required, 2-255 characters
- `age`: Required, 1-120
- `gender`: Required, "male" or "female"
- `height`: Required, 50-300 cm
- `weight`: Required, 20-500 kg
- `goal`: Required, "weight_loss", "muscle_gain", or "maintenance"
- `role`: Optional, defaults to "USER"

---

### 2. Get User by ID
**GET** `/api/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "age": 25,
    "gender": "male",
    "height": 175,
    "weight": 70,
    "goal": "weight_loss",
    "role": "USER",
    "created_at": "2025-12-28T00:00:00.000Z"
  }
}
```

**Access Control:**
- Users can only access their own data
- Admins can access any user's data

---

### 3. Update User Profile
**PUT** `/api/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "weight": 68,
  "goal": "maintenance"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "age": 25,
    "gender": "male",
    "height": 175,
    "weight": 68,
    "goal": "maintenance",
    "role": "USER",
    "created_at": "2025-12-28T00:00:00.000Z"
  }
}
```

---

### 4. Get All Users (Admin Only)
**GET** `/api/users`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

---

### 5. Delete User (Admin Only)
**DELETE** `/api/users/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 🏋️ Workout & Meal Plans

### 1. Generate Weekly Plans
**POST** `/api/plans/generate`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Weekly plans generated successfully",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "day": "Monday",
      "exercises": [
        {
          "name": "Running",
          "duration": 30,
          "caloriesBurned": 300,
          "completed": false
        },
        {
          "name": "Jump Rope",
          "duration": 15,
          "caloriesBurned": 150,
          "completed": false
        }
      ],
      "meals": [
        {
          "name": "Healthy Breakfast",
          "type": "breakfast",
          "calories": 300,
          "protein": 15,
          "carbs": 40,
          "fats": 8,
          "items": ["Oatmeal", "Banana", "Almonds", "Green Tea"],
          "consumed": false
        }
      ],
      "completed_status": {
        "exercises": {
          "Running": false,
          "Jump Rope": false
        },
        "meals": {
          "breakfast": false,
          "lunch": false,
          "snack": false,
          "dinner": false
        }
      }
    }
  ],
  "count": 7
}
```

**Plan Generation Logic:**
- **Weight Loss**: Cardio-focused workouts + calorie deficit meals (~1200 cal/day)
- **Muscle Gain**: Strength training + calorie surplus meals (~2250 cal/day)
- **Maintenance**: Balanced workouts + maintenance calories (~1700 cal/day)

---

### 2. Get User's Plans
**GET** `/api/plans/:userId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 7
}
```

---

### 3. Get Plan by ID
**GET** `/api/plans/detail/:planId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "day": "Monday",
    "exercises": [...],
    "meals": [...]
  }
}
```

---

### 4. Complete Exercise
**PUT** `/api/plans/:planId/complete-exercise`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "exerciseName": "Running"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Exercise marked as completed",
  "data": {
    "id": 1,
    "user_id": 1,
    "day": "Monday",
    "exercises": [
      {
        "name": "Running",
        "duration": 30,
        "caloriesBurned": 300,
        "completed": true
      }
    ],
    "completed_status": {
      "exercises": {
        "Running": true
      }
    }
  }
}
```

---

## 🍽️ Meal Tracking

### 1. Consume Meal
**PUT** `/api/meals/:planId/consume`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "mealType": "breakfast"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meal marked as consumed",
  "data": {
    "id": 1,
    "meals": [
      {
        "name": "Healthy Breakfast",
        "type": "breakfast",
        "calories": 300,
        "consumed": true
      }
    ]
  }
}
```

---

### 2. Adjust Meal Calories
**PUT** `/api/meals/:planId/adjust`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "mealType": "breakfast",
  "adjustedCalories": 350
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meal adjusted successfully",
  "data": {
    "id": 1,
    "meals": [
      {
        "name": "Healthy Breakfast",
        "type": "breakfast",
        "calories": 350,
        "protein": 17,
        "carbs": 47,
        "fats": 9,
        "consumed": false
      }
    ]
  }
}
```

**Note:** Macros are adjusted proportionally to maintain nutritional balance.

---

## 📊 Progress Tracking

### 1. Get Progress Summary
**GET** `/api/progress/:userId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "totalWorkoutsCompleted": 8,
    "totalWorkouts": 14,
    "caloriesConsumed": 5600,
    "caloriesTarget": 8400,
    "weeklyWorkoutCompletion": 57,
    "weeklyMealCompletion": 67,
    "weeklySummary": [
      {
        "day": "Monday",
        "workoutsCompleted": 2,
        "totalWorkouts": 2,
        "caloriesConsumed": 1200,
        "caloriesTarget": 1200
      },
      {
        "day": "Tuesday",
        "workoutsCompleted": 1,
        "totalWorkouts": 2,
        "caloriesConsumed": 800,
        "caloriesTarget": 1200
      }
    ]
  }
}
```

---

### 2. Get Daily Summary
**GET** `/api/progress/:userId/day/:day`

**Headers:**
```
Authorization: Bearer <token>
```

**Example:** `/api/progress/1/day/Monday`

**Response:**
```json
{
  "success": true,
  "data": {
    "day": "Monday",
    "workoutsCompleted": 2,
    "totalWorkouts": 2,
    "caloriesConsumed": 1200,
    "caloriesTarget": 1200
  }
}
```

---

### 3. Get Total Calories Burned
**GET** `/api/progress/:userId/calories-burned`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "totalCaloriesBurned": 2400
  }
}
```

---

## 🔒 Authentication & Authorization

### Role-Based Access Control

**USER Role:**
- Can create and update their own profile
- Can generate and view their own plans
- Can track their own workouts and meals
- Can view their own progress

**ADMIN Role:**
- All USER permissions
- Can view all users
- Can delete users
- Can access any user's data

### JWT Token Structure
```json
{
  "userId": 1,
  "role": "USER",
  "iat": 1703721600,
  "exp": 1704326400
}
```

---

## ❌ Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "age",
      "message": "Age must be a positive number between 1 and 120"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "No token provided. Authorization header required."
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied. You can only access your own data."
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "User not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  gender ENUM('male', 'female') NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  goal ENUM('weight_loss', 'muscle_gain', 'maintenance') NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### WorkoutMealPlans Table
```sql
CREATE TABLE WorkoutMealPlans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  day VARCHAR(20) NOT NULL,
  exercises JSON NOT NULL,
  meals JSON NOT NULL,
  completed_status JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
```

---

## 📝 Development Scripts

```bash
# Install dependencies
npm install

# Run development server with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Setup database tables
npm run db:setup
```

---

## 🧪 Testing the API

### Using cURL

**Create a user:**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": 25,
    "gender": "male",
    "height": 175,
    "weight": 70,
    "goal": "weight_loss"
  }'
```

**Generate plans:**
```bash
curl -X POST http://localhost:5000/api/plans/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userId": 1}'
```

### Using Postman

1. Import the API endpoints
2. Set Authorization header with Bearer token
3. Test each endpoint with sample data

---

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── database/         # Database connection & setup
│   ├── middleware/       # Auth, validation, error handling
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── types/            # TypeScript interfaces
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── .env.example          # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
JWT_SECRET=your-very-secure-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build and Run
```bash
npm run build
npm start
```

---

## 📞 Support

For issues or questions, please contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** December 28, 2025
