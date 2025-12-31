export const generateWorkoutPlan = (goal: string) => {
    const plans: any = {
        'weight loss': {
            exercises: [
                { name: '🏃 Cardio Blast', duration: '30 mins', completed: false, description: 'High-intensity running or brisk walking.' },
                { name: '🔥 Burpees', sets: '3 x 15 reps', completed: false, description: 'Full body fat burning movement.' },
                { name: '🪑 Squat Jumps', sets: '3 x 20 reps', completed: false, description: 'Explosive power for calorie burn.' },
                { name: '🧘 Mountain Climbers', duration: '3 x 60s', completed: false, description: 'Core and endurance focused.' },
                { name: '💨 High Knees', duration: '4 x 45s', completed: false, description: 'Steady state cardio finisher.' }
            ]
        },
        'muscle gain': {
            exercises: [
                { name: '🏋️ Barbell Squats', sets: '4 x 8 reps', completed: false, description: 'Primary leg builder, focus on form.' },
                { name: '💪 Bench Press', sets: '4 x 10 reps', completed: false, description: 'Chest and tricep growth.' },
                { name: '🛶 Seated Rows', sets: '3 x 12 reps', completed: false, description: 'Back thickness and posture.' },
                { name: '🔨 Bicep Curls', sets: '3 x 15 reps', completed: false, description: 'Isolation for arm definition.' },
                { name: '⚡ Shoulder Press', sets: '3 x 10 reps', completed: false, description: 'Building broad shoulders.' }
            ]
        },
        'maintenance': {
            exercises: [
                { name: '🚶 Steady Walk', duration: '45 mins', completed: false, description: 'Low intensity steady state cardio.' },
                { name: '🤸 Dynamic Stretching', duration: '15 mins', completed: false, description: 'Flexibility and joint health.' },
                { name: '🧱 Plank Hold', duration: '3 x 60s', completed: false, description: 'Core stability maintenance.' },
                { name: '🦵 Bodyweight Lunges', sets: '3 x 15 reps', completed: false, description: 'Functional lower body strength.' },
                { name: '🏊 Swimming / Cycling', duration: '30 mins', completed: false, description: 'Active recovery and heart health.' }
            ]
        }
    };
    return plans[goal] || plans['maintenance'];
};

export const generateMealPlan = (goal: string) => {
    const plans: any = {
        'weight loss': {
            meals: {
                breakfast: '🥣 Steel-cut oats with green apple slices',
                lunch: '🥗 Quinoa salad with baked lemon chicken',
                dinner: '🐟 Grilled tilapia with sauteed asparagus',
                snacks: '🥒 Cucumber with hummus or a handful of walnuts',
                totalCalories: 1800
            }
        },
        'muscle gain': {
            meals: {
                breakfast: '🍳 4 Egg omelette with spinach and cheddar toast',
                lunch: '🍱 Lean beef bowl with brown rice and broccoli',
                dinner: '🍗 Roasted turkey breast with mashed sweet potatoes',
                snacks: '🥤 Protein shake with peanut butter and banana',
                totalCalories: 3200
            }
        },
        'maintenance': {
            meals: {
                breakfast: '🥑 Avocado and poached eggs on sourdough',
                lunch: '🥪 Grilled chicken wrap with greek yogurt dressing',
                dinner: '🍝 Whole wheat pasta with pesto and grilled shrimp',
                snacks: '🍎 Apple with almond butter or mixed berries',
                totalCalories: 2400
            }
        }
    };
    return plans[goal] || plans['maintenance'];
};
