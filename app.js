const defaultTasks = [
  { id: 1, title: 'Затвердити дизайн партнерського порталу', project: 'Партнерський портал', priority: 'high', due: 'Сьогодні', done: false },
  { id: 2, title: 'Підготувати план запуску Q4', project: 'Go-to-market', priority: 'high', due: '19 вер', done: false },
  { id: 3, title: 'Оновити базу знань для sales-команди', project: 'Операції', priority: 'medium', due: '22 вер', done: false },
  { id: 4, title: 'Провести ретроспективу спринту', project: 'Product', priority: 'low', due: '23 вер', done: true },
  { id: 5, title: 'Перевірити аналітику активації', project: 'Product', priority: 'medium', due: '26 вер', done: false }
];

let tasks = JSON.parse(localStorage.getItem('scorpia-tasks') || 'null') || defaultTasks;
const taskTemplate = document.querySelector('#taskTemplate');
const labels = { high: 'Високий', medium: 'Середній', low: 'Низький' };

function saveTasks() { localStorage.setItem('scorpia-tasks', JSON.stringify(tasks)); }
function renderTasks() {
  const targets = [document.querySelector('#priorityTasks'), document.querySelector('#allTasks')];
  const ordered = [...tasks].sort((a, b) => Number(a.done) - Number(b.done));
  targets.forEach((target, targetIndex) => {
    target.replaceChildren();
    (targetIndex ? ordered : ordered.slice(0, 4)).forEach(task => {
      const item = taskTemplate.content.cloneNode(true);
      const row = item.querySelector('.task-row');
      row.dataset.id = task.id;
      row.classList.toggle('done', task.done);
      row.querySelector('.task-main strong').textContent = task.title;
      row.querySelector('.task-main small').textContent = task.project;
      const priority = row.querySelector('.priority');
      priority.textContent = labels[task.priority]; priority.classList.add(task.priority);
      row.querySelector('.due').textContent = task.due;
      row.querySelector('.task-check').addEventListener('click', () => toggleTask(task.id));
      row.querySelector('.delete-task').addEventListener('click', () => deleteTask(task.id));
      target.append(item);
    });
  });
  const complete = tasks.filter(t => t.done).length;
  const percent = tasks.length ? Math.round(complete / tasks.length * 100) : 0;
  document.querySelector('#taskCount').textContent = tasks.filter(t => !t.done).length;
  document.querySelector('#weekProgress').textContent = `${complete} / ${tasks.length}`;
  document.querySelector('#weekLabel').textContent = `${percent}% виконано`;
  document.querySelector('#weekBar').style.width = `${percent}%`;
  renderGantt();
}
function toggleTask(id) { tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t); saveTasks(); renderTasks(); }
function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); saveTasks(); renderTasks(); }
function renderGantt() {
  const timeline = document.querySelector('#ganttRows'); timeline.replaceChildren();
  tasks.slice(0, 4).forEach((task, index) => {
    const row = document.createElement('div'); row.className = 'gantt-row';
    const start = 4 + index * 12, width = 38 + (index % 3) * 9;
    row.innerHTML = `<span>${task.title}</span><div class="timeline"><i class="bar ${index === 1 ? 'purple' : index === 2 ? 'orange' : ''}" style="left:${start}%;width:${width}%">${task.done ? 'Завершено' : task.due}</i></div>`;
    timeline.append(row);
  });
}

const documents = [
  ['▱', 'Стратегія продукту Q4', 'Product · Оновлено сьогодні'],
  ['◫', 'Процес запуску кампаній', 'Marketing · Оновлено вчора'],
  ['◈', 'Гайд для партнерів', 'Sales · Оновлено 12 вересня'],
  ['⊞', 'Правила безпеки даних', 'Operations · Оновлено 10 вересня'],
  ['✦', 'AI-плейбук команди', 'Product · Оновлено 8 вересня'],
  ['◌', 'Дослідження клієнтів', 'Research · Оновлено 5 вересня']
];
function renderDocuments() { document.querySelector('#documentGrid').innerHTML = documents.map(d => `<article class="document-card"><span class="doc-icon">${d[0]}</span><h2>${d[1]}</h2><p>${d[2]}</p><small>Відкрити документ →</small></article>`).join(''); }
const goals = [
  ['Скоротити час запуску партнерів', 'Зменшити середній час онбордингу з 14 до 7 днів.', 72],
  ['Підвищити якість активації клієнтів', 'Досягти 85% завершених onboarding-воронок.', 61],
  ['Єдиний контекст для команди', 'Перенести ключові SOP та рішення до Scorpia.', 84]
];
function renderGoals() { document.querySelector('#goalsList').innerHTML = goals.map(g => `<article class="goal"><div class="goal-top"><div><p class="eyebrow">КОМАНДНА ЦІЛЬ</p><h2>${g[0]}</h2><p>${g[1]}</p></div><strong>${g[2]}%</strong></div><div class="progress"><i style="width:${g[2]}%"></i></div></article>`).join(''); }

function openView(view) { document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === view)); document.querySelectorAll('.nav-item[data-view]').forEach(n => n.classList.toggle('active', n.dataset.view === view)); window.scrollTo({ top: 0, behavior: 'smooth' }); }
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => openView(button.dataset.view)));
document.querySelectorAll('[data-view-link]').forEach(button => button.addEventListener('click', () => openView(button.dataset.viewLink)));
document.querySelectorAll('[data-open-task]').forEach(button => button.addEventListener('click', () => document.querySelector('#taskDialog').showModal()));
document.querySelector('#saveTask').addEventListener('click', event => { const title = document.querySelector('#newTaskTitle'); if (!title.value.trim()) { event.preventDefault(); title.focus(); return; } tasks.unshift({ id: Date.now(), title: title.value.trim(), project: 'Особистий план', priority: document.querySelector('#newTaskPriority').value, due: 'Без дедлайну', done: false }); saveTasks(); renderTasks(); title.value = ''; });
document.querySelector('#addDocument').addEventListener('click', () => { const name = prompt('Назва нового документа'); if (name?.trim()) { documents.unshift(['▱', name.trim(), 'Чернетка · щойно створено']); renderDocuments(); } });
document.querySelector('#themeButton').addEventListener('click', () => document.body.classList.toggle('light'));
document.querySelector('.menu-button').addEventListener('click', () => alert('На компактному екрані навігація доступна через розділи у верхній частині сторінки.'));
const aiDialog = document.querySelector('#aiDialog'); document.querySelectorAll('[data-open-ai]').forEach(button => button.addEventListener('click', () => aiDialog.showModal())); document.querySelector('#closeAi').addEventListener('click', () => aiDialog.close());
document.querySelector('#aiForm').addEventListener('submit', event => { event.preventDefault(); const input = document.querySelector('#aiInput'), message = input.value.trim(); if (!message) return; const chat = document.querySelector('#chatMessages'); chat.insertAdjacentHTML('beforeend', `<p class="user-message">${message.replaceAll('<', '&lt;')}</p>`); const openTasks = tasks.filter(t => !t.done).length; const answer = /дедлайн|ризик/i.test(message) ? `Я бачу ${openTasks} активних задач. Найвищий ризик: «${tasks.find(t => t.priority === 'high' && !t.done)?.title || 'критичних задач немає'}». Раджу узгодити наступний крок сьогодні.` : /ціл|okr/i.test(message) ? 'Прогрес командних OKR становить 68%. Найкраще рухається ціль «Єдиний контекст для команди» — 84%.' : `У просторі зараз ${openTasks} активних задач. Я можу підсумувати статус, знайти ризики або допомогти спланувати наступний крок.`; setTimeout(() => { chat.insertAdjacentHTML('beforeend', `<p class="bot-message">${answer}</p>`); chat.scrollTop = chat.scrollHeight; }, 300); input.value = ''; });
document.querySelector('#globalSearch').addEventListener('input', event => { const term = event.target.value.toLowerCase(); document.querySelectorAll('.task-row').forEach(row => row.style.display = row.innerText.toLowerCase().includes(term) ? '' : 'none'); });
renderTasks(); renderDocuments(); renderGoals();

