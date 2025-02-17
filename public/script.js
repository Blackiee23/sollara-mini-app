// ==== CORE STATE ====
let state = {
    miningActive: false,
    startTime: 0,
    soll: 0,
    lara: 1000,
    remainingTime: 10,
    walletConnected: false
};

// ==== PAGE NAVIGATION ====
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        // Show corresponding page
        const pageId = item.dataset.page;
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(`${pageId}-page`).classList.add('active');
    });
});

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

// ==== EVENT LISTENERS ====
document.getElementById('start-mining').addEventListener('click', function() {
    state.miningActive = !state.miningActive;
    state.startTime = Date.now();
    this.textContent = state.miningActive ? 'Stop Mining' : 'Start Mining';
    localStorage.setItem('miningState', JSON.stringify(state));
});

document.getElementById('claim-button').addEventListener('click', function() {
    state.soll += 0.00319 * 10;
    document.getElementById('soll-balance').textContent = state.soll.toFixed(4);
    this.disabled = true;
    state.remainingTime = 10;
    localStorage.setItem('miningState', JSON.stringify(state));
});

// ==== WALLET INTEGRATION ====
document.getElementById('connect-wallet').addEventListener('click', () => {
    state.walletConnected = true;
    document.getElementById('wallet-status').textContent = "Connected: TON_XXXXXX";
    localStorage.setItem('walletState', 'connected');
});

// ==== TASK SYSTEM ====
document.querySelector('.task-claim').addEventListener('click', function() {
    if(!this.disabled) {
        state.lara += 2;
        document.getElementById('lara-balance').textContent = state.lara.toFixed(2);
        this.disabled = true;
        localStorage.setItem('miningState', JSON.stringify(state));
    }
});

// ==== INITIALIZATION ====
window.addEventListener('load', () => {
    // Load mining state
    const savedState = localStorage.getItem('miningState');
    if(savedState) {
        state = JSON.parse(savedState);
        document.getElementById('soll-balance').textContent = state.soll.toFixed(4);
        document.getElementById('lara-balance').textContent = state.lara.toFixed(2);
        
        if(state.miningActive) {
            const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
            state.remainingTime = Math.max(10 - elapsed, 0);
            document.getElementById('start-mining').textContent = 'Stop Mining';
            updateMining();
        }
    }

    // Load wallet state
    if(localStorage.getItem('walletState')) {
        document.getElementById('wallet-status').textContent = "Connected: TON_XXXXXX";
    }
});

// Update every second
setInterval(() => {
    if(state.miningActive) {
        updateMining();
    }
}, 1000);
