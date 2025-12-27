# API Request & Response Examples

## Complete User Journey Example

### Step 1: Create a User (Register)

**Request:**
```http
POST /api/users
Content-Type: application/json

{
  "name": "Sarah Johnson",
  "age": 28,
  "gender": "female",
  "height": 165,
  "weight": 68,
  "goal": "weight_loss"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Sarah Johnson",
      "age": 28,
      "gender": "female",
      "height": 165,
      "weight": 68,
      "goal": "weight_loss",
      "role": "USER",
      "created_at": "2025-12-28T01:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAzNzIxNjAwLCJleHAiOjE3MDQzMjY0MDB9.abc123xyz"
  }
}
```

---

### Step 2: Generate Weekly Plans

**Request:**
```http
POST /api/plans/generate
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "userId": 1
}
```

**Response (201 Created):**
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
        },
        {
          "name": "Light Lunch",
          "type": "lunch",
          "calories": 400,
          "protein": 25,
          "carbs": 45,
          "fats": 10,
          "items": ["Grilled Chicken", "Brown Rice", "Steamed Vegetables", "Salad"],
          "consumed": false
        },
        {
          "name": "Healthy Snack",
          "type": "snack",
          "calories": 150,
          "protein": 8,
          "carbs": 20,
          "fats": 5,
          "items": ["Greek Yogurt", "Berries", "Handful of Nuts"],
          "consumed": false
        },
        {
          "name": "Light Dinner",
          "type": "dinner",
          "calories": 350,
          "protein": 30,
          "carbs": 30,
          "fats": 12,
          "items": ["Grilled Fish", "Quinoa", "Roasted Vegetables", "Lemon Water"],
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
    },
    {
      "id": 2,
      "user_id": 1,
      "day": "Tuesday",
      "exercises": [
        {
          "name": "HIIT Training",
          "duration": 25,
          "caloriesBurned": 350,
          "completed": false
        },
        {
          "name": "Burpees",
          "sets": 3,
          "reps": 15,
          "caloriesBurned": 100,
          "completed": false
        }
      ],
      "meals": [...],
      "completed_status": {...}
    }
    // ... 5 more days
  ],
  "count": 7
}
```

---

### Step 3: Complete an Exercise

**Request:**
```http
PUT /api/plans/1/complete-exercise
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "exerciseName": "Running"
}
```

**Response (200 OK):**
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
      },
      {
        "name": "Jump Rope",
        "duration": 15,
        "caloriesBurned": 150,
        "completed": false
      }
    ],
    "meals": [...],
    "completed_status": {
      "exercises": {
        "Running": true,
        "Jump Rope": false
      },
      "meals": {...}
    }
  }
}
```

---

### Step 4: Consume a Meal

**Request:**
```http
PUT /api/meals/1/consume
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "mealType": "breakfast"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Meal marked as consumed",
  "data": {
    "id": 1,
    "user_id": 1,
    "day": "Monday",
    "exercises": [...],
    "meals": [
      {
        "name": "Healthy Breakfast",
        "type": "breakfast",
        "calories": 300,
        "protein": 15,
        "carbs": 40,
        "fats": 8,
        "items": ["Oatmeal", "Banana", "Almonds", "Green Tea"],
        "consumed": true
      },
      {
        "name": "Light Lunch",
        "type": "lunch",
        "calories": 400,
        "protein": 25,
        "carbs": 45,
        "fats": 10,
        "items": ["Grilled Chicken", "Brown Rice", "Steamed Vegetables", "Salad"],
        "consumed": false
      }
    ],
    "completed_status": {
      "exercises": {...},
      "meals": {
        "breakfast": true,
        "lunch": false,
        "snack": false,
        "dinner": false
      }
    }
  }
}
```

---

### Step 5: Adjust Meal Calories

**Request:**
```http
PUT /api/meals/1/adjust
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "mealType": "lunch",
  "adjustedCalories": 450
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Meal adjusted successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "day": "Monday",
    "exercises": [...],
    "meals": [
      {
        "name": "Light Lunch",
        "type": "lunch",
        "calories": 450,
        "protein": 28,
        "carbs": 51,
        "fats": 11,
        "items": ["Grilled Chicken", "Brown Rice", "Steamed Vegetables", "Salad"],
        "consumed": false
      }
    ]
  }
}
```

---

### Step 6: Get Progress Summary

**Request:**
```http
GET /api/progress/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "totalWorkoutsCompleted": 5,
    "totalWorkouts": 14,
    "caloriesConsumed": 3600,
    "caloriesTarget": 8400,
    "weeklyWorkoutCompletion": 36,
    "weeklyMealCompletion": 43,
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
      },
      {
        "day": "Wednesday",
        "workoutsCompleted": 2,
        "totalWorkouts": 2,
        "caloriesConsumed": 1200,
        "caloriesTarget": 1200
      },
      {
        "day": "Thursday",
        "workoutsCompleted": 0,
        "totalWorkouts": 2,
        "caloriesConsumed": 400,
        "caloriesTarget": 1200
      },
      {
        "day": "Friday",
        "workoutsCompleted": 0,
        "totalWorkouts": 2,
        "caloriesConsumed": 0,
        "caloriesTarget": 1200
      },
      {
        "day": "Saturday",
        "workoutsCompleted": 0,
        "totalWorkouts": 1,
        "caloriesConsumed": 0,
        "caloriesTarget": 1200
      },
      {
        "day": "Sunday",
        "workoutsCompleted": 0,
        "totalWorkouts": 2,
        "caloriesConsumed": 0,
        "caloriesTarget": 1200
      }
    ]
  }
}
```

---

### Step 7: Update User Profile (Change Goal)

**Request:**
```http
PUT /api/users/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "weight": 65,
  "goal": "maintenance"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "Sarah Johnson",
    "age": 28,
    "gender": "female",
    "height": 165,
    "weight": 65,
    "goal": "maintenance",
    "role": "USER",
    "created_at": "2025-12-28T01:00:00.000Z"
  }
}
```

---

## Admin Examples

### Create Admin User

**Request:**
```http
POST /api/users
Content-Type: application/json

{
  "name": "Admin User",
  "age": 35,
  "gender": "male",
  "height": 180,
  "weight": 80,
  "goal": "maintenance",
  "role": "ADMIN"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 2,
      "name": "Admin User",
      "age": 35,
      "gender": "male",
      "height": 180,
      "weight": 80,
      "goal": "maintenance",
      "role": "ADMIN",
      "created_at": "2025-12-28T01:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcwMzcyMTYwMCwiZXhwIjoxNzA0MzI2NDAwfQ.xyz789abc"
  }
}
```

---

### Get All Users (Admin Only)

**Request:**
```http
GET /api/users
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sarah Johnson",
      "age": 28,
      "gender": "female",
      "height": 165,
      "weight": 65,
      "goal": "maintenance",
      "role": "USER",
      "created_at": "2025-12-28T01:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Admin User",
      "age": 35,
      "gender": "male",
      "height": 180,
      "weight": 80,
      "goal": "maintenance",
      "role": "ADMIN",
      "created_at": "2025-12-28T01:00:00.000Z"
    }
  ],
  "count": 2
}
```

---

## Error Examples

### Validation Error

**Request:**
```http
POST /api/users
Content-Type: application/json

{
  "name": "J",
  "age": 150,
  "gender": "other",
  "height": -10,
  "weight": 0,
  "goal": "invalid_goal"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name must be between 2 and 255 characters"
    },
    {
      "field": "age",
      "message": "Age must be a positive number between 1 and 120"
    },
    {
      "field": "gender",
      "message": "Gender must be either \"male\" or \"female\""
    },
    {
      "field": "height",
      "message": "Height must be a positive number between 50 and 300 cm"
    },
    {
      "field": "weight",
      "message": "Weight must be a positive number between 20 and 500 kg"
    },
    {
      "field": "goal",
      "message": "Goal must be one of: weight_loss, muscle_gain, maintenance"
    }
  ]
}
```

---

### Unauthorized Access

**Request:**
```http
GET /api/users/1
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "No token provided. Authorization header required."
}
```

---

### Forbidden Access

**Request:**
```http
GET /api/users/2
Authorization: Bearer <user_1_token>
```

**Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Access denied. You can only access your own data."
}
```

---

### Resource Not Found

**Request:**
```http
GET /api/users/999
Authorization: Bearer <token>
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Muscle Gain Plan Example

**Request:**
```http
POST /api/users
Content-Type: application/json

{
  "name": "Mike Strong",
  "age": 24,
  "gender": "male",
  "height": 178,
  "weight": 72,
  "goal": "muscle_gain"
}
```

Then generate plans:

**Response (Muscle Gain Plans):**
```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "user_id": 3,
      "day": "Monday",
      "exercises": [
        {
          "name": "Bench Press",
          "sets": 4,
          "reps": 10,
          "caloriesBurned": 150,
          "completed": false
        },
        {
          "name": "Tricep Dips",
          "sets": 3,
          "reps": 12,
          "caloriesBurned": 100,
          "completed": false
        },
        {
          "name": "Push-ups",
          "sets": 3,
          "reps": 15,
          "caloriesBurned": 80,
          "completed": false
        }
      ],
      "meals": [
        {
          "name": "High Protein Breakfast",
          "type": "breakfast",
          "calories": 550,
          "protein": 42,
          "carbs": 60,
          "fats": 18,
          "items": ["Eggs", "Whole Wheat Toast", "Avocado", "Protein Shake", "Oatmeal"],
          "consumed": false
        },
        {
          "name": "Power Lunch",
          "type": "lunch",
          "calories": 700,
          "protein": 54,
          "carbs": 75,
          "fats": 22,
          "items": ["Chicken Breast", "Sweet Potato", "Brown Rice", "Vegetables", "Olive Oil"],
          "consumed": false
        },
        {
          "name": "Pre-Workout Snack",
          "type": "snack",
          "calories": 350,
          "protein": 24,
          "carbs": 45,
          "fats": 10,
          "items": ["Banana", "Peanut Butter", "Protein Bar", "Milk"],
          "consumed": false
        },
        {
          "name": "High Calorie Dinner",
          "type": "dinner",
          "calories": 650,
          "protein": 48,
          "carbs": 70,
          "fats": 20,
          "items": ["Lean Beef", "Pasta", "Cheese", "Vegetables", "Nuts"],
          "consumed": false
        }
      ]
    }
  ]
}
```

**Total Daily Calories:** 2250 (calorie surplus for muscle gain)

---

**Document Version:** 1.0.0  
**Last Updated:** December 28, 2025
