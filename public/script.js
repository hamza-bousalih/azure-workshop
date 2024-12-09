document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const taskFilter = document.getElementById('task-filter');
    const clearCompletedButton = document.getElementById('clear-completed');

    // Load tasks from localStorage
    loadTasks();

    // Add task event listener
    addTaskButton.addEventListener('click', addTask);
    
    // Add task on Enter key
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Filter tasks
    taskFilter.addEventListener('change', filterTasks);

    // Clear completed tasks
    clearCompletedButton.addEventListener('click', clearCompletedTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Task cannot be empty');
            return;
        }

        // Create task item
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.dataset.status = 'active';

        // Create checkbox
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.classList.add('task-checkbox');
        taskCheckbox.addEventListener('change', function() {
            toggleTaskStatus(taskItem, this);
        });

        // Create task text
        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = taskText;

        // Create delete button with X icon
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-times"></i>';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', function() {
            removeTask(taskItem);
        });

        // Assemble task item
        taskItem.appendChild(taskCheckbox);
        taskItem.appendChild(taskTextSpan);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        // Save tasks to localStorage
        saveTasks();

        // Clear input
        taskInput.value = '';
    }

    function toggleTaskStatus(taskItem, checkbox) {
        if (checkbox.checked) {
            taskItem.classList.add('completed');
            taskItem.dataset.status = 'completed';
        } else {
            taskItem.classList.remove('completed');
            taskItem.dataset.status = 'active';
        }
        saveTasks();
    }

    function removeTask(taskItem) {
        taskList.removeChild(taskItem);
        saveTasks();
    }

    function saveTasks() {
        const tasks = Array.from(taskList.children).map(taskItem => ({
            text: taskItem.querySelector('span').textContent,
            status: taskItem.dataset.status
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        savedTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.dataset.status = task.status;

            const taskCheckbox = document.createElement('input');
            taskCheckbox.type = 'checkbox';
            taskCheckbox.classList.add('task-checkbox');
            taskCheckbox.checked = task.status === 'completed';
            taskCheckbox.addEventListener('change', function() {
                toggleTaskStatus(taskItem, this);
            });

            const taskTextSpan = document.createElement('span');
            taskTextSpan.textContent = task.text;

            if (task.status === 'completed') {
                taskItem.classList.add('completed');
            }

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-times"></i>';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', function() {
                removeTask(taskItem);
            });

            taskItem.appendChild(taskCheckbox);
            taskItem.appendChild(taskTextSpan);
            taskItem.appendChild(deleteButton);
            taskList.appendChild(taskItem);
        });
    }

    function filterTasks() {
        const filter = taskFilter.value;
        const tasks = taskList.children;

        for (let task of tasks) {
            switch (filter) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'active':
                    task.style.display = task.dataset.status === 'active' ? 'flex' : 'none';
                    break;
                case 'completed':
                    task.style.display = task.dataset.status === 'completed' ? 'flex' : 'none';
                    break;
            }
        }
    }

    function clearCompletedTasks() {
        const completedTasks = Array.from(taskList.children)
            .filter(task => task.dataset.status === 'completed');
        
        completedTasks.forEach(task => taskList.removeChild(task));
        saveTasks();
    }
});