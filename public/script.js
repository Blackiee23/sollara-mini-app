// Core state for mining (using SOLL and LARA)
let state = {
  miningActive: false,
  startTime: 0,
  soll: 0,
  lara: 1000,
  remainingTime: 10
};

const claimButton = document.getElementById('claim-button');
const sollBalanceEl = document.getElementById('soll-balance');
const laraBalanceEl = document.getElementById('lara-balance');
const miningProgressEl = document.getElementById('mining-progress');
const miningTimerEl = document.getElementById('mining-timer');

// Update mining progress and timer
function updateMining() {
  if (state.miningActive) {
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    state.remainingTime = Math.max(10 - elapsed, 0);
    miningTimerEl.textContent = formatTime(state.remainingTime);
    // Simulate accumulation (for demo purposes)
    miningProgressEl.textContent = (state.soll + (elapsed * 0.0001)).toFixed(4);
    
    if (state.remainingTime <= 0) {
      claimButton.disabled = false;
      state.miningActive = false;
    }
  }
}

function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

// Claim button event (simulate claiming SOLL rewards)
claimButton.addEventListener('click', function() {
  state.soll += 0.00319 * 10; // example reward calculation
  sollBalanceEl.textContent = state.soll.toFixed(4);
  claimButton.disabled = true;
  // Restart mining process
  state.miningActive = true;
  state.startTime = Date.now();
  state.remainingTime = 10;
  saveState();
});

// Start mining update loop after DOM loads
document.addEventListener('DOMContentLoaded', function() {
  loadState();
  setInterval(() => {
    if (state.miningActive) {
      updateMining();
      saveState();
    }
  }, 1000);
});

// Navigation functions
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
    page.style.display = 'none';
  });
  document.getElementById('moreDropdown').classList.remove('active');
  const targetPage = document.getElementById(pageId);
  if(targetPage) {
    targetPage.classList.add('active');
    targetPage.style.display = 'block';
  }
  updateNavActive(pageId);
}

function updateNavActive(pageId) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === pageId) {
      item.classList.add('active');
    }
  });
}

function goBack() {
  // Simple back function to return to the mining dashboard
  navigateTo('mining-page');
}

function toggleMoreDropdown() {
  const dropdown = document.getElementById('moreDropdown');
  dropdown.classList.toggle('active');
}

// Save and load state to/from localStorage
function saveState() {
  localStorage.setItem('miningState', JSON.stringify({
    miningActive: state.miningActive,
    startTime: state.startTime,
    soll: state.soll,
    lara: state.lara,
    remainingTime: state.remainingTime
  }));
}

function loadState() {
  const saved = localStorage.getItem('miningState');
  if (saved) {
    const loadedState = JSON.parse(saved);
    state = { ...state, ...loadedState };
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    state.remainingTime = Math.max(10 - elapsed, 0);
    if(state.remainingTime > 0) {
      state.miningActive = true;
      claimButton.disabled = true;
    } else {
      state.miningActive = false;
      claimButton.disabled = false;
    }
    sollBalanceEl.textContent = state.soll.toFixed(4);
    laraBalanceEl.textContent = state.lara.toFixed(2);
    miningTimerEl.textContent = formatTime(state.remainingTime);
  }
}
