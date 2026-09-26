const STORAGE_KEY = 'todo-list-app-items';
const THEME_KEY = 'todo-list-app-theme';

const $ = (selector) => document.querySelector(selector);
const todoForm = $('#todo-form');
const todoInput = $('#todo-input');
const priorityInput = $('#priority-input');
const dueDateInput = $('#due-date-input');
const todoList = $('#todo-list');
const todoCount = $('#todo-count');
const completionSummary = $('#completion-summary');
const clearCompletedBtn = $('#clear-completed');
const themeToggle = $('#theme-toggle');
const filterButtons = [...document.querySelectorAll('.filter-btn')];

let tasks = loadTasks();
let activeFilter = 'all';
let editingId = null;

function loadTasks() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter((task) => task && task.id && typeof task.text === 'string') : [];
  } catch (error) {
    console.warn('Saved tasks could not be loaded.', error);
    return [];
  }
}

function saveTasks() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (error) { console.warn('Tasks could not be saved.', error); }
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function getFilteredTasks() {
  if (activeFilter === 'active') return tasks.filter((task) => !task.completed);
  if (activeFilter === 'completed') return tasks.filter((task) => task.completed);
  return tasks;
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`));
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();
  const completed = tasks.filter((task) => task.completed).length;
  const remaining = tasks.length - completed;
  const percentage = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  todoCount.textContent = `${remaining} ${remaining === 1 ? 'task' : 'tasks'} left`;
  completionSummary.textContent = `${percentage}% complete`;

  if (!filteredTasks.length) {
    todoList.innerHTML = '<li class="empty-state">No tasks here. Add one to get started.</li>';
    return;
  }

  todoList.innerHTML = filteredTasks.map((task) => {
    const due = task.dueDate ? `<span class="${!task.completed && task.dueDate < new Date().toISOString().slice(0, 10) ? 'overdue' : ''}">📅 ${formatDate(task.dueDate)}</span>` : '';
    if (editingId === task.id) {
      return `<li class="todo-item" data-id="${task.id}"><div class="todo-main"><input class="todo-checkbox" type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task complete"><div class="todo-content"><input class="edit-input" value="${escapeHtml(task.text)}" maxlength="120" aria-label="Edit task"></div></div><div class="item-actions"><button class="edit-btn save-edit" type="button">Save</button><button class="delete-btn cancel-edit" type="button">Cancel</button></div></li>`;
    }
    return `<li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}"><div class="todo-main"><input class="todo-checkbox" type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task complete"><div class="todo-content"><span class="todo-text">${escapeHtml(task.text)}</span><div class="task-meta"><span class="priority priority-${task.priority || 'medium'}">${(task.priority || 'medium').toUpperCase()}</span>${due}</div></div></div><div class="item-actions"><button class="edit-btn edit-task" type="button">Edit</button><button class="delete-btn delete-task" type="button">Delete</button></div></li>`;
  }).join('');

  if (editingId) { const input = todoList.querySelector('.edit-input'); input?.focus(); input?.select(); }
}

function addTask(event) {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  tasks.unshift({ id: createId(), text, completed: false, priority: priorityInput.value, dueDate: dueDateInput.value || '' });
  saveTasks();
  todoForm.reset();
  priorityInput.value = 'medium';
  renderTasks();
  todoInput.focus();
}

function toggleTask(id) { tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task); saveTasks(); renderTasks(); }
function deleteTask(id) { tasks = tasks.filter((task) => task.id !== id); saveTasks(); renderTasks(); }
function saveEdit(id) { const input = todoList.querySelector(`[data-id="${id}"] .edit-input`); const text = input?.value.trim(); if (!text) return; tasks = tasks.map((task) => task.id === id ? { ...task, text } : task); editingId = null; saveTasks(); renderTasks(); }
function clearCompleted() { tasks = tasks.filter((task) => !task.completed); saveTasks(); renderTasks(); }

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  localStorage.setItem(THEME_KEY, theme);
}

todoForm.addEventListener('submit', addTask);
todoList.addEventListener('click', (event) => {
  const item = event.target.closest('.todo-item');
  if (!item) return;
  const id = item.dataset.id;
  if (event.target.closest('.delete-task')) deleteTask(id);
  else if (event.target.closest('.edit-task')) { editingId = id; renderTasks(); }
  else if (event.target.closest('.save-edit')) saveEdit(id);
  else if (event.target.closest('.cancel-edit')) { editingId = null; renderTasks(); }
  else if (event.target.closest('.todo-checkbox')) toggleTask(id);
});
todoList.addEventListener('keydown', (event) => { if (event.key === 'Enter' && event.target.matches('.edit-input')) saveEdit(event.target.closest('.todo-item').dataset.id); if (event.key === 'Escape') { editingId = null; renderTasks(); } });
filterButtons.forEach((button) => button.addEventListener('click', () => { activeFilter = button.dataset.filter; filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button)); renderTasks(); }));
clearCompletedBtn.addEventListener('click', clearCompleted);
themeToggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

const savedTheme = localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);
renderTasks();
