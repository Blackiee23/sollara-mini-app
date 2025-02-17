// Core state for mining and wallet connection
let state = {
  miningActive: false,
  startTime: 0,
  soll: 0,
  lara: 1000,
  remainingTime: 10,
  walletConnected: false
};

const claimButton = document.getElementById('claim-button');
const startMiningButton = document.getElementById('start-mining');
const sollBalanceEl = document.getElementById('soll-balance');
const laraBalanceEl = document.getElementById('lara-balance');
const miningProgressEl = document.getElementById('mining-progress');
const miningTimerEl = document.getElementById('mining-timer');
const walletButton = document.getElementById('wallet-button');
const walletStatus = document.getElementById('wallet-status');

// Update mining progress and timer
function updateMining() {
  if (state.miningActive) {
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    state.remainingTime = Math.max(10 - elapsed, 0);
    if (miningTimerEl) {
      miningTimerEl.textContent = formatTime(state.remainingTime);
    }
    // Simulate accumulation (for demo purposes)
    miningProgressEl.textContent = (state.soll + (elapsed * 0.0001)).toFixed(4);
    
    if (state.remainingTime <= 0) {
      claimButton.disabled = false;
      state.miningActive = false;
      startMiningButton.textContent = "Start Mining";
    }
  }
}

function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

// Start/Stop Mining Button Event
startMiningButton.addEventListener('click', function() {
  if (!state.miningActive) {
    // Start mining
    state.miningActive = true;
    state.startTime = Date.now();
    state.remainingTime = 10;
    startMiningButton.textContent = "Stop Mining";
    claimButton.disabled = true;
  } else {
    // Stop mining manually
    state.miningActive = false;
    startMiningButton.textContent = "Start Mining";
    claimButton.disabled = true;
  }
  saveState();
});

// Claim Button Event (simulate claiming SOLL rewards)
claimButton.addEventListener('click', function() {
  state.soll += 0.00319 * 10; // example reward calculation
  sollBalanceEl.textContent = state.soll.toFixed(4);
  claimButton.disabled = true;
  // Restart mining process after claiming
  state.miningActive = true;
  state.startTime = Date.now();
  state.remainingTime = 10;
  startMiningButton.textContent = "Stop Mining";
  saveState();
});

// Wallet Connection Toggle
function toggleWallet() {
  state.walletConnected = !state.walletConnected;
  updateWalletUI();
  saveState();
}

function updateWalletUI() {
  if (state.walletConnected) {
    walletButton.textContent = "Disconnect Wallet";
    walletStatus.textContent = "Connected: TON_XXXXXX";
  } else {
    walletButton.textContent = "Connect Wallet";
    walletStatus.textContent = "Not Connected";
  }
}

// Coming Soon modal function with feature name parameter
function comingSoon(feature) {
  const modal = document.getElementById('comingSoonModal');
  const comingSoonText = document.getElementById('comingSoonText');
  comingSoonText.textContent = feature + " is part of our Season 2 release and will be available soon. Stay tuned!";
  modal.style.display = "block";
  document.getElementById('moreDropdown').classList.remove('active');
}

function closeModal() {
  const modal = document.getElementById('comingSoonModal');
  modal.style.display = "none";
}

// Help Modal Functions
function showHelp() {
  const helpModal = document.getElementById('helpModal');
  helpModal.style.display = "block";
  document.getElementById('moreDropdown').classList.remove('active');
}

function closeHelpModal() {
  const helpModal = document.getElementById('helpModal');
  helpModal.style.display = "none";
}

// Navigation Functions
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
    page.style.display = 'none';
  });
  document.getElementById('moreDropdown').classList.remove('active');
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
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
  navigateTo('mining-page');
}

function toggleMoreDropdown() {
  const dropdown = document.getElementById('moreDropdown');
  dropdown.classList.toggle('active');
}

// Save and Load State to/from localStorage
function saveState() {
  localStorage.setItem('miningState', JSON.stringify({
    miningActive: state.miningActive,
    startTime: state.startTime,
    soll: state.soll,
    lara: state.lara,
    remainingTime: state.remainingTime,
    walletConnected: state.walletConnected
  }));
}

function loadState() {
  const saved = localStorage.getItem('miningState');
  if (saved) {
    const loadedState = JSON.parse(saved);
    state = { ...state, ...loadedState };
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    state.remainingTime = Math.max(10 - elapsed, 0);
    if (state.remainingTime > 0) {
      state.miningActive = true;
      claimButton.disabled = true;
      startMiningButton.textContent = "Stop Mining";
    } else {
      state.miningActive = false;
      claimButton.disabled = false;
      startMiningButton.textContent = "Start Mining";
    }
    sollBalanceEl.textContent = state.soll.toFixed(4);
    laraBalanceEl.textContent = state.lara.toFixed(2);
    if (miningTimerEl) miningTimerEl.textContent = formatTime(state.remainingTime);
    updateWalletUI();
  }
}

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

// Copy Referral Code Function (for Account page)
function copyReferral() {
  const referralCode = document.getElementById('referral-code').textContent;
  navigator.clipboard.writeText(referralCode).then(() => {
    alert("Referral code copied: " + referralCode);
  });
}
