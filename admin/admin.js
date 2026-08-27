const authKey = 'portfolioAdminAuthenticated';
const projectsKey = 'portfolioProjects';
const profileKey = 'portfolioProfile';
const messagesKey = 'portfolioMessages';
const defaultProjectCount = 4;
const defaultProfile = {
  name: 'BOREY MOEUN', role: 'IT Student & Future Web Programmer', status: 'Available for Learning & Opportunities',
  heroDescription: "I'm a passionate IT student who enjoys building modern websites, learning new technologies, solving problems, and turning ideas into real digital experiences.",
  image: '/img/1.png', aboutText: "I'm a first-year student at Passerelles Numériques Cambodia, studying Web Programming as part of Generation 2027. I'm interested in technology and software development, and I'm currently learning both frontend and backend development. I care about creating digital products that are useful and user-friendly, and I'm continuously working on improving my technical and communication skills.",
  statement: '"I believe that technology is not only about writing code. It is about solving problems, helping people, and creating meaningful digital experiences."',
  skillsText: 'frontend | HTML5 | Intermediate | 75\nfrontend | CSS3 | Intermediate | 70\nfrontend | JavaScript | Learning | 50\nbackend | Node.js | Beginner | 30\nbackend | Python | Learning | 45\ndatabase | MySQL | Learning | 40\ntools | Git | Intermediate | 60\ntools | GitHub | Intermediate | 60',
  technologyText: '🟧 | HTML5 | Semantic structure for accessible, SEO-friendly pages.\n🟦 | CSS3 | Layouts, animations, and responsive styling.\n🟨 | JavaScript | Interactivity, DOM logic, and dynamic behavior.\n⚛️ | React | Building reusable, component-based interfaces.\n🟩 | Node.js | Server-side JavaScript for backend logic.\n🐍 | Python | Scripting, logic practice, and backend basics.',
  education: 'Passerelles Numériques Cambodia', major: 'Web Programming', generation: '2027', location: 'Cambodia', goal: 'Become a Professional Developer',
  email: 'boreymoeun9999@gmail.com', phone: '+855 878 792 47', contactLocation: 'Phnom Penh, Cambodia', cvUrl: '',
  github: '', linkedin: '', facebook: '', telegram: ''
};

const profileForm = document.getElementById('profileForm');
if (profileForm) {
  const profile = {...defaultProfile, ...JSON.parse(localStorage.getItem(profileKey) || '{}')};
  Object.entries(profile).forEach(([name, value]) => {
    const field = profileForm.elements[name];
    if (field) field.value = value;
  });
}

function updateProjectCount() {
  const count = defaultProjectCount + JSON.parse(localStorage.getItem(projectsKey) || '[]').length;
  const countElement = document.getElementById('publishedProjectCount');
  if (countElement) countElement.textContent = String(count).padStart(2, '0');
}

function getMessages() {
  return JSON.parse(localStorage.getItem(messagesKey) || '[]');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
}

function formatMessageDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'});
}

function updateMessages() {
  const messages = getMessages();
  const unreadCount = messages.filter(message => !message.read).length;
  const countElement = document.getElementById('unreadMessageCount');
  const sidebarCountElement = document.getElementById('sidebarMessageCount');
  const summaryElement = document.getElementById('messageSummary');
  const listElement = document.getElementById('messageList');
  if (countElement) countElement.textContent = String(unreadCount).padStart(2, '0');
  if (sidebarCountElement) sidebarCountElement.textContent = unreadCount;
  if (summaryElement) summaryElement.textContent = messages.length ? `${messages.length} total | ${unreadCount} unread` : 'No messages';
  if (!listElement) return;
  if (!messages.length) {
    listElement.innerHTML = '<p class="empty-state">Messages from the contact form will appear here.</p>';
    return;
  }
  listElement.innerHTML = messages.map(message => `
    <article class="message-item${message.read ? '' : ' unread'}">
      <div class="message-item-head"><div><strong>${escapeHtml(message.subject)}</strong><span>${escapeHtml(message.name)} · <a href="mailto:${escapeHtml(message.email)}">${escapeHtml(message.email)}</a></span></div><time>${formatMessageDate(message.createdAt)}</time></div>
      <p>${escapeHtml(message.message)}</p>
      <div class="message-actions"><button type="button" class="btn btn-outline btn-sm" data-message-action="toggle" data-message-id="${message.id}">${message.read ? 'Mark unread' : 'Mark read'}</button><button type="button" class="btn btn-danger btn-sm" data-message-action="delete" data-message-id="${message.id}">Delete</button></div>
    </article>`).join('');
}

updateProjectCount();
updateMessages();

const adminThemeToggle = document.getElementById('adminThemeToggle');
const savedAdminTheme = localStorage.getItem('portfolioAdminTheme') || 'dark';
document.documentElement.setAttribute('data-theme', savedAdminTheme);
adminThemeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('portfolioAdminTheme', nextTheme);
});

const adminNavLinks = [...document.querySelectorAll('.admin-nav a[data-admin-view]')];
const adminViewPanels = [...document.querySelectorAll('[data-admin-view-panel]')];
function showAdminView(view) {
  const selectedView = adminNavLinks.some(link => link.dataset.adminView === view) ? view : 'overview';
  adminViewPanels.forEach(panel => panel.classList.toggle('is-current', panel.dataset.adminViewPanel === selectedView));
  adminNavLinks.forEach(link => link.classList.toggle('active', link.dataset.adminView === selectedView));
  if (selectedView === 'overview') window.scrollTo({top: 0, behavior: 'smooth'});
}
function updateAdminView() {
  const view = new URLSearchParams(window.location.hash.replace('#', '?')).get('view') || window.location.hash.slice(1);
  const viewMap = {profile: 'profile', projectEditor: 'projects', projectForm: 'projects', activityPanel: 'activity', contentOverview: 'content', messageList: 'messages', overview: 'overview'};
  showAdminView(viewMap[view] || 'overview');
}
adminNavLinks.concat([...document.querySelectorAll('.admin-add-button[data-admin-view]')]).forEach(link => link.addEventListener('click', () => {
  history.replaceState(null, '', `#view=${link.dataset.adminView}`);
  showAdminView(link.dataset.adminView);
}));
window.addEventListener('hashchange', updateAdminView);
updateAdminView();

const isDashboard = document.body.classList.contains('admin-page') && Boolean(document.getElementById('adminLogoutBtn'));

if (isDashboard && sessionStorage.getItem(authKey) !== 'true') {
  window.location.replace('./');
}

const loginForm = document.getElementById('adminLoginForm');
if (loginForm) {
  const message = document.getElementById('adminLoginMessage');
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;

    if (username === 'admin' && password === 'admin123') {
      sessionStorage.setItem(authKey, 'true');
      window.location.href = 'dashboard.html';
      return;
    }

    message.textContent = 'Incorrect username or password.';
  });
}

document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
  sessionStorage.removeItem(authKey);
  window.location.replace('./');
});

document.getElementById('adminSidebarLogoutBtn')?.addEventListener('click', () => {
  sessionStorage.removeItem(authKey);
  window.location.replace('./');
});

profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const profile = Object.fromEntries(new FormData(profileForm).entries());
  localStorage.setItem(profileKey, JSON.stringify(profile));
  document.getElementById('profileFormMessage').textContent = 'Site information saved.';
});

const projectForm = document.getElementById('projectForm');
projectForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(projectForm);
  const splitValues = (name) => formData.get(name).split(',').map(value => value.trim()).filter(Boolean);
  const savedProjects = JSON.parse(localStorage.getItem(projectsKey) || '[]');
  savedProjects.push({
    id: `project-${Date.now()}`,
    title: formData.get('title').trim(),
    category: formData.get('category'),
    img: formData.get('img').trim(),
    desc: formData.get('desc').trim(),
    tech: splitValues('tech'),
    overview: formData.get('overview').trim(),
    problem: formData.get('problem').trim(),
    solution: formData.get('solution').trim(),
    features: splitValues('features'),
    challenges: formData.get('challenges').trim(),
    learned: formData.get('learned').trim()
  });
  localStorage.setItem(projectsKey, JSON.stringify(savedProjects));
  updateProjectCount();
  projectForm.reset();
  document.getElementById('projectFormMessage').textContent = 'Project added to your portfolio.';
});

document.getElementById('messageList')?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-message-action]');
  if (!button) return;
  const messageId = button.dataset.messageId;
  const messages = getMessages();
  if (button.dataset.messageAction === 'delete') {
    localStorage.setItem(messagesKey, JSON.stringify(messages.filter(message => message.id !== messageId)));
  } else {
    localStorage.setItem(messagesKey, JSON.stringify(messages.map(message => message.id === messageId ? {...message, read: !message.read} : message)));
  }
  updateMessages();
});
