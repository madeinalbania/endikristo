const loadingScreen = document.getElementById('loading-screen');
const authModal = document.getElementById('auth-modal');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const authClose = document.getElementById('auth-close');
const chatbotBtn = document.getElementById('chatbot-btn');
const chatbot = document.getElementById('chatbot');
const chatbotClose = document.getElementById('chatbot-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const themeToggle = document.getElementById('theme-toggle');
const notificationBtn = document.getElementById('notification-btn');
const notificationBadge = document.querySelector('#notification-btn .badge');
const weatherApiKey = '2019c014082d8c3d46a44a3e55519988';
const weatherBtn = document.getElementById('weather-btn');
const weatherCity = document.getElementById('weather-city');
const weatherGrid = document.getElementById('weather-grid');
const calcBudget = document.getElementById('calc-budget');
const budgetBreakdown = document.getElementById('budget-breakdown');
const totalBudget = document.getElementById('total-budget');
const destinationsGrid = document.getElementById('destinations-grid');
const generatePlanBtn = document.getElementById('generate-plan');
const planResults = document.getElementById('plan-results');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const authTabs = document.querySelectorAll('.auth-tabs .tab-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const userMenuWrapper = document.getElementById('user-wrapper');
const userGreeting = document.getElementById('user-greeting');
const greetingText = document.getElementById('greeting-text');
const userBtn = document.getElementById('user-btn');
const userNameNav = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
const dropdownName = document.getElementById('dropdown-name');
const dropdownEmail = document.getElementById('dropdown-email');
const dropdownAvatar = document.getElementById('dropdown-avatar');
const userDropdown = document.getElementById('user-dropdown');
const logoutBtn = document.getElementById('logout-btn');
const logoutBtnTop = document.getElementById('logout-btn-top');

// NEW BUTTON DOM ELEMENTS
const heroSearchBtn = document.getElementById('hero-search-btn');
const heroSearchInput = document.getElementById('hero-search');
const startPlanningBtn = document.getElementById('start-planning-btn');
const exploreNowBtn = document.getElementById('explore-now-btn');
const getStartedBtn = document.getElementById('get-started-btn');

const currentUserKey = 'voyagoCurrentUser';

const weatherSamples = {
  Paris: [{ day: 'Today', temp: 18, icon: '⛅', desc: 'Partly cloudy' }],
  London: [{ day: 'Today', temp: 15, icon: '🌧️', desc: 'Light rain' }],
  Tokyo: [{ day: 'Today', temp: 22, icon: '☀️', desc: 'Sunny' }],
  Dubai: [{ day: 'Today', temp: 32, icon: '☀️', desc: 'Hot and sunny' }],
  Bangkok: [{ day: 'Today', temp: 30, icon: '⛅', desc: 'Warm and humid' }],
};

function hideLoadingScreen() {
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
}

function toggleModal(modal, open) {
  if (!modal) return;
  modal.style.display = open ? 'flex' : 'none';
}

function getStoredUser() {
  return JSON.parse(localStorage.getItem(currentUserKey)) || null;
}

function setStoredUser(user) {
  localStorage.setItem(currentUserKey, JSON.stringify(user));
}

function clearStoredUser() {
  localStorage.removeItem(currentUserKey);
}

function buildAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff`;
}

function updateUserInterface() {
  const currentUser = getStoredUser();
  const loggedIn = !!currentUser;

  document.body.classList.toggle('user-logged-in', loggedIn);
  document.querySelectorAll('.guest-only').forEach(el => el.style.display = loggedIn ? 'none' : 'inline-block');

  if (userDropdown) userDropdown.style.display = 'none';

  if (currentUser) {
    if (greetingText) greetingText.textContent = `Hello, ${currentUser.name}`;
    if (userNameNav) userNameNav.textContent = currentUser.name;
    if (dropdownName) dropdownName.textContent = currentUser.name;
    if (dropdownEmail) dropdownEmail.textContent = currentUser.email;
    const avatarUrl = currentUser.avatar || buildAvatarUrl(currentUser.name);
    if (userAvatar) userAvatar.src = avatarUrl;
    if (dropdownAvatar) dropdownAvatar.src = avatarUrl;
  }
}

function appendChatMessage(sender, text) {
  if (!chatMessages) return;
  const message = document.createElement('div');
  message.className = `chat-message ${sender}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function switchAuthTab(tabName) {
  authTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  if (loginForm) loginForm.classList.toggle('active', tabName === 'login');
  if (registerForm) registerForm.classList.toggle('active', tabName === 'register');
}

function loginUser(data) {
  const email = data.email?.trim();
  const name = data.name || (email ? email.split('@')[0] : 'Traveler');
  setStoredUser({ name, email, avatar: data.avatar || '' });
  updateUserInterface();
  toggleModal(authModal, false);
}

function logoutUser() {
  clearStoredUser();
  updateUserInterface();
  if (userDropdown) userDropdown.style.display = 'none';
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('login-email')?.value.trim();
  if (!email) return;
  loginUser({ name: email.split('@')[0], email });
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const firstName = document.getElementById('reg-fname')?.value.trim();
  const lastName = document.getElementById('reg-lname')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim();
  if (!firstName || !lastName || !email) return;
  loginUser({ name: `${firstName} ${lastName}`, email });
}

function renderDestinations() {
  if (!destinationsGrid) return;
  destinationsGrid.innerHTML = ['Paris', 'Rome', 'London', 'Tokyo', 'Dubai', 'Bangkok', 'Barcelona'].map(city => `
    <div class="destination-card" onclick="handleDestinationClick('${city}')">
      <div class="destination-name">${city}</div>
      <div class="destination-meta">Top sights, local food & culture</div>
    </div>
  `).join('');
}

window.handleDestinationClick = function(city) {
  const plannerDest = document.getElementById('planner-dest');
  if (plannerDest) plannerDest.value = city;
  if (weatherCity) weatherCity.value = city;
  
  document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' });
  showWeather(city);
};

async function showWeather(city) {
  if (!weatherGrid) return;

  const encodedCity = encodeURIComponent(city || 'Paris');
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${weatherApiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather fetch failed');
    const result = await response.json();
    const icon = result.weather?.[0]?.icon || '01d';
    const description = result.weather?.[0]?.description || 'Clear skies';
    const temp = result.main?.temp ?? 24;
    const day = result.name || city;
    const weatherIcon = icon.startsWith('01') ? '☀️' : icon.startsWith('02') ? '⛅' : icon.startsWith('03') || icon.startsWith('04') ? '☁️' : icon.startsWith('09') || icon.startsWith('10') ? '🌧️' : icon.startsWith('11') ? '⛈️' : icon.startsWith('13') ? '❄️' : '🌤️';

    weatherGrid.innerHTML = `
      <div class="weather-card">
        <div class="weather-day">${day}</div>
        <div class="weather-temp">${weatherIcon} ${Math.round(temp)}°C</div>
        <div class="weather-desc">${description}</div>
      </div>
    `;
  } catch (error) {
    const data = weatherSamples[city] || [{ day: 'Today', temp: 24, icon: '⛅', desc: 'Clear skies' }];
    weatherGrid.innerHTML = data.map(item => `
      <div class="weather-card">
        <div class="weather-day">${item.day}</div>
        <div class="weather-temp">${item.icon} ${item.temp}°C</div>
        <div class="weather-desc">${item.desc}</div>
      </div>
    `).join('');
  }
}

function calculateBudget() {
  if (!calcBudget || !budgetBreakdown || !totalBudget) return;
  const inputs = ['budget-flights', 'budget-hotels', 'budget-food', 'budget-activities', 'budget-transport', 'budget-misc'];
  let total = 0;
  const lines = inputs.map(id => {
    const input = document.getElementById(id);
    const value = parseFloat(input?.value || '0') || 0;
    total += value;
    const label = input?.previousElementSibling?.textContent || id.replace('budget-', '');
    return `<div class="summary-item"><span>${label}</span><span>$${value.toFixed(2)}</span></div>`;
  });
  budgetBreakdown.innerHTML = lines.join('');
  totalBudget.textContent = `Total: $${total.toFixed(2)}`;
}

function generatePlan() {
  if (!planResults) return;
  const destination = document.getElementById('planner-dest')?.value || 'your destination';
  const start = document.getElementById('planner-start')?.value || 'start date';
  const end = document.getElementById('planner-end')?.value || 'end date';
  const budget = document.getElementById('planner-budget')?.value || 'your budget';
  planResults.innerHTML = `
    <div class="plan-card">
      <h3>Trip plan for ${destination}</h3>
      <p><strong>Dates:</strong> ${start} to ${end}</p>
      <p><strong>Budget:</strong> $${budget}</p>
      <ul>
        <li>Day 1: Explore the city center and top landmarks</li>
        <li>Day 2: Local food tour and cultural experience</li>
        <li>Day 3: Outdoor activity and relaxation</li>
      </ul>
    </div>
  `;
}

function executeHeroSearch() {
  const query = heroSearchInput?.value.trim();
  if (!query) return;

  const plannerDest = document.getElementById('planner-dest');
  if (plannerDest) plannerDest.value = query;

  if (weatherCity) weatherCity.value = query;

  showWeather(query);

  document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' });
}

function init() {
  hideLoadingScreen();
  renderDestinations();

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  if (loginBtn) loginBtn.addEventListener('click', () => toggleModal(authModal, true));
  if (registerBtn) registerBtn.addEventListener('click', () => { toggleModal(authModal, true); switchAuthTab('register'); });
  if (authClose) authClose.addEventListener('click', () => toggleModal(authModal, false));

  authTabs.forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
  });

  if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
  if (registerForm) registerForm.addEventListener('submit', handleRegisterSubmit);

  if (userBtn) {
    userBtn.addEventListener('click', () => {
      if (!userDropdown) return;
      userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
    });
  }

  if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
  if (logoutBtnTop) logoutBtnTop.addEventListener('click', logoutUser);

  if (chatbotBtn) chatbotBtn.addEventListener('click', () => toggleModal(chatbot, true));
  if (chatbotClose) chatbotClose.addEventListener('click', () => toggleModal(chatbot, false));

  if (chatForm) {
    chatForm.addEventListener('submit', event => {
      event.preventDefault();
      const text = chatInput?.value.trim();
      if (!text) return;
      appendChatMessage('user', text);
      if (chatInput) chatInput.value = '';
      setTimeout(() => appendChatMessage('bot', 'I can help with travel tips, weather, and budget planning!'), 600);
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => document.body.classList.toggle('light'));
  }

  updateUserInterface();

  if (weatherBtn) {
    weatherBtn.addEventListener('click', () => {
      const query = weatherCity?.value.trim() || 'Paris';
      showWeather(query);
    });
  }

  if (calcBudget) calcBudget.addEventListener('click', calculateBudget);
  if (generatePlanBtn) generatePlanBtn.addEventListener('click', generatePlan);

  if (notificationBtn && notificationBadge) {
    notificationBtn.addEventListener('click', () => {
      const count = parseInt(notificationBadge.textContent || '0', 10) + 1;
      notificationBadge.textContent = count;
    });
  }

  // --- CTA ACTION BUTTON LOGIC ---
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', executeHeroSearch);
  }
  if (heroSearchInput) {
    heroSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') executeHeroSearch();
    });
  }
  if (startPlanningBtn) {
    startPlanningBtn.addEventListener('click', () => {
      document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (exploreNowBtn) {
    exploreNowBtn.addEventListener('click', () => {
      document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('error', hideLoadingScreen);
window.addEventListener('unhandledrejection', hideLoadingScreen);