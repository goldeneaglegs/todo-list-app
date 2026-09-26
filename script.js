const STORAGE_KEY = 'todo-list-app-items';
const FILTERS = ['all', 'active', 'completed'];

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterButtons = [...document.querySelectorAll('.filter-btn')];

let tasks = loadTasks();
let activeFilter = 'all';

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Unable to read saved tasks:', error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateTodoCount() {
  const remaining = tasks.filter((task) => !task.completed).length;
  const label = remaining === 1 ? 'task left' : 'tasks left';
  todoCount.textContent = `${remaining} ${label}`;
}

function getFilteredTasks() {
  if (activeFilter === 'active') {
    return tasks.filter((task) => !task.completed);
  }

  if (activeFilter === 'completed') {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    todoList.innerHTML = '<li class="empty-state">No tasks here. Add one to get started.</li>';
    updateTodoCount();
    return;
  }

  todoList.innerHTML = filteredTasks
    .map(
      (task) => `
        <li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
          <div class="todo-main">
            <input
              class="todo-checkbox"
              type="checkbox"
              aria-label="Mark task as complete"
              ${task.completed ? 'checked' : ''}
            />
            <span class="todo-text">${escapeHtml(task.text)}</span>
          </div>
          <button class="delete-btn" type="button" aria-label="Delete task">Delete</button>
        </li>
      `
    )
    .join('');

  updateTodoCount();
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function addTask(text) {
  const trimmed = text.trim();

  if (!trimmed) {
    return;
  }

  tasks = [
    {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
    },
    ...tasks,
  ];

  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(todoInput.value);
  todoInput.value = '';
  todoInput.focus();
});

todoList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.delete-btn');
  const item = event.target.closest('.todo-item');

  if (deleteButton && item) {
    deleteTask(item.dataset.id);
    return;
  }

  const checkbox = event.target.closest('.todo-checkbox');
  if (checkbox && item) {
    toggleTask(item.dataset.id);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((btn) =>
      btn.classList.toggle('active', btn === button)
    );

    renderTasks();
  });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

renderTasks();