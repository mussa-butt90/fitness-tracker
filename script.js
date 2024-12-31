// DOM Elements
const goalForm = document.getElementById('goal-form');
const goalList = document.getElementById('goal-list');
const activityForm = document.getElementById('activity-form');
const activityList = document.getElementById('activity-list');
const dietForm = document.getElementById('diet-form');
const dietList = document.getElementById('diet-list');

// LocalStorage
let goals = JSON.parse(localStorage.getItem('goals')) || [];
let activities = JSON.parse(localStorage.getItem('activities')) || [];
let meals = JSON.parse(localStorage.getItem('meals')) || [];

// Event Listeners
goalForm.addEventListener('submit', addGoal);
activityForm.addEventListener('submit', addActivity);
dietForm.addEventListener('submit', addMeal);

// Add Goal
function addGoal(e) {
    e.preventDefault();
    const goalInput = document.getElementById('goal').value;
    const targetInput = document.getElementById('target').value;

    if (goalInput && targetInput) {
        const goal = {
            goal: goalInput,
            target: targetInput,
        };

        goals.push(goal);
        localStorage.setItem('goals', JSON.stringify(goals));
        displayGoals();
        goalForm.reset();
    } else {
        alert('Please fill out both fields.');
    }
}

// Display Goals
function displayGoals() {
    goalList.innerHTML = '';
    goals.forEach((goal, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${goal.goal} - ${goal.target} <button class="remove-btn" onclick="removeGoal(${index})">Remove</button>`;
        goalList.appendChild(listItem);
    });
}

// Remove Goal
function removeGoal(index) {
    goals.splice(index, 1);
    localStorage.setItem('goals', JSON.stringify(goals));
    displayGoals();
}

// Add Activity
function addActivity(e) {
    e.preventDefault();
    const activityInput = document.getElementById('activity').value;
    const durationInput = document.getElementById('duration').value;
    const dateInput = document.getElementById('activity-date').value;

    if (activityInput && durationInput && dateInput) {
        const activity = {
            activity: activityInput,
            duration: durationInput,
            date: dateInput
        };

        activities.push(activity);
        localStorage.setItem('activities', JSON.stringify(activities));
        displayActivities();
        updateCharts();
        activityForm.reset();
    } else {
        alert('Please fill out all fields.');
    }
}

// Display Activities
function displayActivities() {
    activityList.innerHTML = '';
    activities.forEach((activity, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${activity.activity} - ${activity.duration} min on ${activity.date} <button class="remove-btn" onclick="removeActivity(${index})">Remove</button>`;
        activityList.appendChild(listItem);
    });
}

// Remove Activity
function removeActivity(index) {
    activities.splice(index, 1);
    localStorage.setItem('activities', JSON.stringify(activities));
    displayActivities();
    updateCharts();
}

// Add Meal
function addMeal(e) {
    e.preventDefault();
    const mealInput = document.getElementById('meal').value;
    const caloriesInput = document.getElementById('calories').value;
    const dateInput = document.getElementById('meal-date').value;

    if (mealInput && caloriesInput && dateInput) {
        const meal = {
            meal: mealInput,
            calories: caloriesInput,
            date: dateInput
        };

        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
        displayMeals();
        updateCharts();
        dietForm.reset();
    } else {
        alert('Please fill out all fields.');
    }
}

// Display Meals
function displayMeals() {
    dietList.innerHTML = '';
    meals.forEach((meal, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${meal.meal} - ${meal.calories} kcal on ${meal.date} <button class="remove-btn" onclick="removeMeal(${index})">Remove</button>`;
        dietList.appendChild(listItem);
    });
}

// Remove Meal
function removeMeal(index) {
    meals.splice(index, 1);
    localStorage.setItem('meals', JSON.stringify(meals));
    displayMeals();
    updateCharts();
}

// Initial Display
displayGoals();
displayActivities();
displayMeals();

// Chart.js Setup
const weeklyActivityCtx = document.getElementById('weekly-activity-chart').getContext('2d');
const monthlyActivityCtx = document.getElementById('monthly-activity-chart').getContext('2d');
const dailyWorkoutCtx = document.getElementById('daily-workout-chart').getContext('2d');
const dietPlanCtx = document.getElementById('diet-plan-chart').getContext('2d');

// Chart Initialization (with empty data)
const weeklyActivityChart = new Chart(weeklyActivityCtx, {
    type: 'line',
    data: {
        labels: [],  // Will be populated dynamically
        datasets: [{
            label: 'Weekly Activity Duration (min)',
            data: [],
            borderColor: '#2a3663',
            backgroundColor: 'rgba(42, 54, 99, 0.2)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const monthlyActivityChart = new Chart(monthlyActivityCtx, {
    type: 'bar',
    data: {
        labels: [],  // Will be populated dynamically
        datasets: [{
            label: 'Monthly Activity Duration (min)',
            data: [],
            backgroundColor: '#b59f78',
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const dailyWorkoutChart = new Chart(dailyWorkoutCtx, {
    type: 'doughnut',
    data: {
        labels: ['Running', 'Cycling', 'Strength Training', 'Yoga'],
        datasets: [{
            label: 'Daily Workout Type',
            data: [],
            backgroundColor: ['#2a3663', '#b59f78', '#d8dbbd', '#faf6e3'],
        }]
    },
    options: {
        responsive: true,
    }
});

const dietPlanChart = new Chart(dietPlanCtx, {
    type: 'pie',
    data: {
        labels: ['Breakfast', 'Lunch', 'Dinner'],
        datasets: [{
            label: 'Diet Plan',
            data: [],
            backgroundColor: ['#2a3663', '#b59f78', '#d8dbbd'],
        }]
    },
    options: {
        responsive: true,
    }
});

// Function to update charts dynamically based on entered data
function updateCharts() {
    // Weekly activity data
    const weeklyData = activities.reduce((acc, activity) => {
        const day = new Date(activity.date).toLocaleDateString('en-US', { weekday: 'short' });
        if (!acc[day]) acc[day] = 0;
        acc[day] += parseInt(activity.duration);
        return acc;
    }, {});

    weeklyActivityChart.data.labels = Object.keys(weeklyData);
    weeklyActivityChart.data.datasets[0].data = Object.values(weeklyData);
    weeklyActivityChart.update();

    // Monthly activity data
    const monthlyData = activities.reduce((acc, activity) => {
        const month = new Date(activity.date).toLocaleString('default', { month: 'short' });
        if (!acc[month]) acc[month] = 0;
        acc[month] += parseInt(activity.duration);
        return acc;
    }, {});

    monthlyActivityChart.data.labels = Object.keys(monthlyData);
    monthlyActivityChart.data.datasets[0].data = Object.values(monthlyData);
    monthlyActivityChart.update();

    // Daily workout data (based on types of activity)
    const dailyWorkoutData = activities.reduce((acc, activity) => {
        if (!acc[activity.activity]) acc[activity.activity] = 0;
        acc[activity.activity] += parseInt(activity.duration);
        return acc;
    }, {});

    dailyWorkoutChart.data.labels = Object.keys(dailyWorkoutData);
    dailyWorkoutChart.data.datasets[0].data = Object.values(dailyWorkoutData);
    dailyWorkoutChart.update();

    // Diet plan data (based on meals)
    const dietData = meals.reduce((acc, meal) => {
        const mealType = meal.meal.toLowerCase();
        if (!acc[mealType]) acc[mealType] = 0;
        acc[mealType] += parseInt(meal.calories);
        return acc;
    }, {});

    dietPlanChart.data.labels = Object.keys(dietData);
    dietPlanChart.data.datasets[0].data = Object.values(dietData);
    dietPlanChart.update();
}
