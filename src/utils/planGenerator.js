export const generateWorkoutPlan = (goal) => {
    const plans = {
        'weight loss': {
            exercises: [
                { name: 'Running', duration: '30 mins', completed: false },
                { name: 'Jump Rope', duration: '15 mins', completed: false },
                { name: 'Push-ups', sets: '3 x 15', completed: false },
                { name: 'Squats', sets: '3 x 20', completed: false }
            ]
        },
        'muscle gain': {
            exercises: [
                { name: 'Bench Press', sets: '4 x 10', completed: false },
                { name: 'Deadlift', sets: '3 x 8', completed: false },
                { name: 'Pull-ups', sets: '3 x 12', completed: false },
                { name: 'Bicep Curls', sets: '3 x 15', completed: false }
            ]
        },
        'maintenance': {
            exercises: [
                { name: 'Brisk Walk', duration: '45 mins', completed: false },
                { name: 'Yoga', duration: '30 mins', completed: false },
                { name: 'Plank', duration: '2 x 60s', completed: false },
                { name: 'Lunges', sets: '2 x 15', completed: false }
            ]
        }
    };
    return plans[goal] || plans['maintenance'];
};
export const generateMealPlan = (goal) => {
    const plans = {
        'weight loss': {
            meals: {
                breakfast: 'Oatmeal with berries',
                lunch: 'Grilled chicken salad',
                dinner: 'Steamed fish with broccoli',
                snacks: 'Greek yogurt or Apple',
                totalCalories: 1500
            }
        },
        'muscle gain': {
            meals: {
                breakfast: 'Omelet with 4 eggs and avocado',
                lunch: 'Beef steak with sweet potato',
                dinner: 'Salmon with quinoa',
                snacks: 'Protein shake and almonds',
                totalCalories: 3000
            }
        },
        'maintenance': {
            meals: {
                breakfast: 'Scrambled eggs on toast',
                lunch: 'Turkey and cheese sandwich',
                dinner: 'Pasta with chicken and veggies',
                snacks: 'Hummus with carrots',
                totalCalories: 2200
            }
        }
    };
    return plans[goal] || plans['maintenance'];
};
//# sourceMappingURL=planGenerator.js.map