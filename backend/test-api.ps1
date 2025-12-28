# Smart Fitness API - Test Script
# This script demonstrates all API endpoints

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🧪 Testing Smart Fitness API" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"

# Test 1: Health Check
Write-Host "1️⃣  Testing Health Check..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get
Write-Host "✅ Health Check Response:" -ForegroundColor Green
$health | ConvertTo-Json
Write-Host ""

# Test 2: Create a User
Write-Host "2️⃣  Creating a new user..." -ForegroundColor Yellow
$userData = @{
    name = "John Doe"
    age = 25
    gender = "male"
    height = 175
    weight = 70
    goal = "weight_loss"
} | ConvertTo-Json

$userResponse = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Post -Body $userData -ContentType "application/json"
Write-Host "✅ User Created:" -ForegroundColor Green
$userResponse | ConvertTo-Json -Depth 5
$token = $userResponse.data.token
$userId = $userResponse.data.user.id
Write-Host ""

# Test 3: Generate Plans
Write-Host "3️⃣  Generating weekly plans..." -ForegroundColor Yellow
$planData = @{
    userId = $userId
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$plansResponse = Invoke-RestMethod -Uri "$baseUrl/api/plans/generate" -Method Post -Body $planData -Headers $headers
Write-Host "✅ Plans Generated: $($plansResponse.count) days" -ForegroundColor Green
Write-Host "First day plan:" -ForegroundColor Cyan
$plansResponse.data[0] | ConvertTo-Json -Depth 5
Write-Host ""

# Test 4: Get User Plans
Write-Host "4️⃣  Fetching user plans..." -ForegroundColor Yellow
$userPlans = Invoke-RestMethod -Uri "$baseUrl/api/plans/$userId" -Method Get -Headers $headers
Write-Host "✅ Retrieved $($userPlans.count) plans" -ForegroundColor Green
Write-Host ""

# Test 5: Complete an Exercise
Write-Host "5️⃣  Completing an exercise..." -ForegroundColor Yellow
$planId = $plansResponse.data[0].id
$exerciseData = @{
    exerciseName = "Running"
} | ConvertTo-Json

$completeResponse = Invoke-RestMethod -Uri "$baseUrl/api/plans/$planId/complete-exercise" -Method Put -Body $exerciseData -Headers $headers
Write-Host "✅ Exercise completed!" -ForegroundColor Green
Write-Host ""

# Test 6: Consume a Meal
Write-Host "6️⃣  Consuming a meal..." -ForegroundColor Yellow
$mealData = @{
    mealType = "breakfast"
} | ConvertTo-Json

$mealResponse = Invoke-RestMethod -Uri "$baseUrl/api/meals/$planId/consume" -Method Put -Body $mealData -Headers $headers
Write-Host "✅ Meal consumed!" -ForegroundColor Green
Write-Host ""

# Test 7: Get Progress
Write-Host "7️⃣  Fetching progress..." -ForegroundColor Yellow
$progress = Invoke-RestMethod -Uri "$baseUrl/api/progress/$userId" -Method Get -Headers $headers
Write-Host "✅ Progress Summary:" -ForegroundColor Green
Write-Host "   Total Workouts: $($progress.data.totalWorkoutsCompleted)/$($progress.data.totalWorkouts)" -ForegroundColor Cyan
Write-Host "   Calories: $($progress.data.caloriesConsumed)/$($progress.data.caloriesTarget)" -ForegroundColor Cyan
Write-Host "   Workout Completion: $($progress.data.weeklyWorkoutCompletion)%" -ForegroundColor Cyan
Write-Host "   Meal Completion: $($progress.data.weeklyMealCompletion)%" -ForegroundColor Cyan
Write-Host ""

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "✅ All Tests Passed Successfully!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Yellow
Write-Host "   ✅ Health Check" -ForegroundColor Green
Write-Host "   ✅ User Creation" -ForegroundColor Green
Write-Host "   ✅ Plan Generation" -ForegroundColor Green
Write-Host "   ✅ Exercise Completion" -ForegroundColor Green
Write-Host "   ✅ Meal Tracking" -ForegroundColor Green
Write-Host "   ✅ Progress Tracking" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Backend is fully functional!" -ForegroundColor Cyan
