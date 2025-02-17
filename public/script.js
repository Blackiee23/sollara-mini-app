// ==== CORE STATE ====
let state = {
    miningActive: false,
    startTime: 0,
    soll: 0,
    lara: 1000,
    remainingTime: 10
};

// ==== MINING SYSTEM ====
function updateMining() {
    if(state.miningActive) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        state.remainingTime = Math.max(10 - elapsed, 0);
        
        // Update progress circle
        const progress = (10 - state.remainingTime) * 31.4; // 31.4 = 2πr (r=45)
        document.querySelector('.progress-bar').style.strokeDasharray = `${progress} 282.6`;

        document.getElementById('countdown').textContent = `${state.remainingTime}s`;
        
        if(state.remainingTime <= 0) {
            document.getElementById('claim-button').disabled = false;
            state.miningActive = false;
        }
    }
}

// ==== CLAIM FUNCTION ====
document.getElementById('claim-button').addEventListener('click', function() {
    state.soll += 0.00319 * 10;
    state.remainingTime = 10;
    this.disabled = true;
    state.miningActive = true;
    state.startTime = Date.now();
    updateDisplay();
    saveState();
});

// ==== MINING TOGGLE ====
document.getElementById('start-mining').addEventListener('click', function() {
    state.miningActive = !state.miningActive;
    if(state.miningActive) {
        state.startTime = Date.now();
        this.textContent = 'Stop Mining';
    } else {
        this.textContent = 'Start Mining';
    }
    saveState();
});

// ==== DROPDOWN ====
function toggleDropdown() {
    document.getElementById('moreDropdown').classList.toggle('active');
}

function showComingSoon() {
    document.getElementById('comingSoonModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('comingSoonModal').style.display = 'none';
}

// ==== PERSISTENT STORAGE ====
function saveState() {
    localStorage.setItem('miningState', JSON.stringify(state));
}

function updateDisplay() {
    document.getElementById('soll-balance').textContent = state.soll.toFixed(4) + ' SOLL';
    document.getElementById('lara-balance').textContent = state.lara.toFixed(2) + ' LARA';
}

// ==== INITIALIZATION ====
window.addEventListener('load', () => {
    const saved = localStorage.getItem('miningState');
    if(saved) {
        state = JSON.parse(saved);
        if(state.miningActive) {
            const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
            state.remainingTime = Math.max(10 - elapsed, 0);
            if(state.remainingTime > 0) {
                document.getElementById('start-mining').textContent = 'Stop Mining';
            }
        }
        updateDisplay();
        updateMining();
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if(!e.target.closest('.btn-icon') && !e.target.closest('.more-dropdown')) {
        document.getElementById('moreDropdown').classList.remove('active');
    }
});

// Update every second
setInterval(() => {
    if(state.miningActive) {
        updateMining();
        saveState();
    }
}, 1000);
