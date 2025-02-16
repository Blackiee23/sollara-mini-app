// ==== CORE STATE ====
let state = {
    miningActive: false,
    startTime: 0,
    soll: 0,
    lara: 1000,
    remainingTime: 10,
    walletConnected: false
};

// ==== MINING SYSTEM ====
function updateMining() {
    if(state.miningActive) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        state.remainingTime = Math.max(10 - elapsed, 0);
        
        document.getElementById('countdown').textContent = `${state.remainingTime}s`;
        
        if(state.remainingTime <= 0) {
            document.getElementById('claim-button').disabled = false;
            state.miningActive = false;
        }
    }
}

// ==== PERSISTENT STORAGE ====
function saveState() {
    localStorage.setItem('miningState', JSON.stringify({
        ...state,
        startTime: Date.now() - (10 - state.remainingTime) * 1000
    }));
}

// ==== PAGE NAVIGATION ====
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById(`${pageId}-page`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// ==== WALLET INTEGRATION ====
document.getElementById('connect-wallet').addEventListener('click', () => {
    state.walletConnected = true;
    document.getElementById('wallet-status').textContent = "Connected: TON_XXXXXX";
    localStorage.setItem('walletState', 'connected');
});

// ==== EVENT LISTENERS ====
document.getElementById('start-mining').addEventListener('click', function() {
    state.miningActive = !state.miningActive;
    state.startTime = Date.now();
    this.textContent = state.miningActive ? 'Stop Mining' : 'Start Mining';
    saveState();
});

document.getElementById('claim-button').addEventListener('click', function() {
    state.soll += 0.00319 * 10;
    document.getElementById('soll-balance').textContent = state.soll.toFixed(4);
    this.disabled = true;
    state.remainingTime = 10;
    saveState();
});

// ==== INITIALIZATION ====
window.addEventListener('load', () => {
    const saved = localStorage.getItem('miningState');
    if(saved) {
        state = JSON.parse(saved);
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        state.remainingTime = Math.max(10 - elapsed, 0);
        
        if(state.remainingTime > 0) {
            document.getElementById('start-mining').textContent = 'Stop Mining';
            state.miningActive = true;
        }
        
        updateMining();
    }
    
    if(localStorage.getItem('walletState')) {
        document.getElementById('wallet-status').textContent = "Connected: TON_XXXXXX";
    }
});

// Update every second
setInterval(() => {
    if(state.miningActive) {
        updateMining();
        saveState();
    }
}, 1000);
