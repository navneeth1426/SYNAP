// --- NAVIGATION LOGIC ---

// Function to handle showing the correct page
function navigateTo(targetPageId) {
    // Get all elements that are considered "pages"
    const pages = document.querySelectorAll('.app-page');
    
    // 1. Hide all pages
    pages.forEach(page => {
        page.classList.add('hidden');
    });

    // 2. Show the target page
    const targetPage = document.getElementById(targetPageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
}

// Function to attach click handlers to all navigation buttons
function setupNavigation() {
    // Select all buttons that have a 'data-target' attribute (main buttons and back buttons)
    const navButtons = document.querySelectorAll('[data-target]');
    
    navButtons.forEach(button => {
        // Prevent setting up navigation on disabled buttons
        if (!button.disabled) {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                if (targetId) {
                    navigateTo(targetId);
                }
            });
        }
    });

    // Ensure we start on the main dashboard
    navigateTo('main-dashboard'); 
}

// --- TASK LIST LOGIC (The Navigator) ---

const taskInput = document.getElementById('task-input');
const dateTimeInput = document.getElementById('date-time-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

function getTasks() {
    const storedTasks = localStorage.getItem('synapTasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}

function saveTasks(tasks) {
    localStorage.setItem('synapTasks', JSON.stringify(tasks));
}

function renderTasks() {
    const tasks = getTasks();
    taskList.innerHTML = ''; 

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'task-item';

        const date = new Date(task.timestamp);
        const formattedDate = date.toLocaleString();

        listItem.innerHTML = `
            <span class="task-description">${task.text}</span>
            <span class="task-date">${formattedDate}</span>
            <button class="delete-btn" data-index="${index}">Done / Delete</button>
        `;

        taskList.appendChild(listItem);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteTask);
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    const taskTime = dateTimeInput.value;

    if (taskText === "") {
        alert("Please enter a plan or event description.");
        return;
    }

    const tasks = getTasks();
    const newTask = {
        text: taskText,
        timestamp: taskTime ? new Date(taskTime).toISOString() : new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks(tasks);

    taskInput.value = '';
    dateTimeInput.value = '';
    renderTasks();
}

function deleteTask(event) {
    const indexToDelete = event.target.getAttribute('data-index');
    let tasks = getTasks();
    tasks.splice(indexToDelete, 1);
    saveTasks(tasks);
    renderTasks();
}

// --- INITIALIZATION ---

// 1. Set up navigation AND load tasks when the page content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    renderTasks();

    // 2. Attach task event listeners
    if (addTaskBtn) addTaskBtn.addEventListener('click', addTask);
    if (taskInput) taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
});