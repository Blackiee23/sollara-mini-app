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
        
        // Update progress circle
        const progress = (10 - state.remainingTime) * 10;
        document.querySelector('.progress-circle').style.strokeDasharray = 
            `${progress} ${100 - progress}`;

        // Update countdown
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
    saveState();
});

document.getElementById('claim-button').addEventListener('click', function() {
    state.soll += 0.00319 * 10;
    document.getElementById('soll-balance').textContent = state.soll.toFixed(4);
    this.disabled = true;
    state.remainingTime = 10;
    state.miningActive = true;
    state.startTime = Date.now();
    saveState();
});

// ==== MORE DROPDOWN ====
function toggleDropdown() {
    const dropdown = document.getElementById('moreDropdown');
    dropdown.classList.toggle('active');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item:last-child')) {
        document.getElementById('moreDropdown').classList.remove('active');
    }
});

// ==== PERSISTENT STORAGE ====
function saveState() {
    localStorage.setItem('miningState', JSON.stringify({
        ...state,
        startTime: Date.now() - (10 - state.remainingTime) * 1000
    }));
}

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
