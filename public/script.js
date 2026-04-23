// DOM Elements
const apiList = document.getElementById('apiList');
const totalApisEl = document.getElementById('totalApis');
const totalCallsEl = document.getElementById('totalCalls');
const addApiBtn = document.getElementById('addApiBtn');
const resetAllBtn = document.getElementById('resetAllBtn');
const addModal = document.getElementById('addModal');
const closeModal = document.querySelector('.close-modal');
const cancelAdd = document.getElementById('cancelAdd');
const saveApi = document.getElementById('saveApi');
const newApiPath = document.getElementById('newApiPath');

let apis = [];

// API Functions
async function fetchApis() {
    try {
        const response = await fetch('/management/apis');
        apis = await response.json();
        renderApis();
        updateStats();
    } catch (error) {
        console.error('Failed to fetch APIs:', error);
    }
}

function renderApis() {
    apiList.innerHTML = apis.map(api => `
        <div class="api-card" data-id="${api.id}">
            <div class="api-card-header">
                <div class="api-path-container">
                    <div class="api-path" title="${api.path}">${api.path}</div>
                    <button class="copy-btn" onclick="copyFullUrl('${api.path}')" title="Copy Full URL">
                        <i data-lucide="copy"></i>
                    </button>
                </div>
                <div class="api-actions">
                    <div class="action-icon reset" onclick="resetCount('${api.id}')" title="Reset Count">
                        <i data-lucide="rotate-ccw"></i>
                    </div>
                    <div class="action-icon delete" onclick="deleteApi('${api.id}')" title="Delete API">
                        <i data-lucide="trash-2"></i>
                    </div>
                </div>
            </div>
            <div class="api-card-body">
                <span class="api-call-count">${api.count}</span>
                <span class="api-call-label">calls</span>
            </div>
            <div class="api-card-footer">
                <span>Created: ${new Date(api.createdAt).toLocaleDateString()}</span>
                <span>ID: ${api.id.slice(-4)}</span>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function updateStats() {
    totalApisEl.textContent = apis.length;
    const totalCalls = apis.reduce((sum, api) => sum + api.count, 0);
    totalCallsEl.textContent = totalCalls;
}

async function addNewApi() {
    const path = newApiPath.value.trim();
    if (!path) return;

    try {
        const response = await fetch('/management/apis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path })
        });

        if (response.ok) {
            newApiPath.value = '';
            closeAddModal();
            fetchApis();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to add API');
        }
    } catch (error) {
        console.error('Error adding API:', error);
    }
}

async function deleteApi(id) {
    try {
        await fetch(`/management/apis/${id}`, { method: 'DELETE' });
        fetchApis();
    } catch (error) {
        console.error('Error deleting API:', error);
    }
}

async function resetCount(id) {
    try {
        await fetch(`/management/apis/${id}/reset`, { method: 'POST' });
        fetchApis();
    } catch (error) {
        console.error('Error resetting count:', error);
    }
}

async function resetAll() {
    if (!confirm('Are you sure you want to reset all counts to zero?')) return;

    try {
        await fetch('/management/apis/reset-all', { method: 'POST' });
        fetchApis();
    } catch (error) {
        console.error('Error resetting all:', error);
    }
}

function copyFullUrl(path) {
    const fullUrl = window.location.origin + path;
    navigator.clipboard.writeText(fullUrl).then(() => {
        // Optional: Change icon temporarily to checkmark
        const btn = event.currentTarget;
        const icon = btn.querySelector('i');
        const originalIcon = icon.getAttribute('data-lucide');
        
        icon.setAttribute('data-lucide', 'check');
        lucide.createIcons();
        
        setTimeout(() => {
            icon.setAttribute('data-lucide', originalIcon);
            lucide.createIcons();
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Modal Toggle
function openAddModal() {
    addModal.classList.add('active');
    newApiPath.focus();
}

function closeAddModal() {
    addModal.classList.remove('active');
}

// Event Listeners
addApiBtn.addEventListener('click', openAddModal);
closeModal.addEventListener('click', closeAddModal);
cancelAdd.addEventListener('click', closeAddModal);
saveApi.addEventListener('click', addNewApi);
resetAllBtn.addEventListener('click', resetAll);

window.addEventListener('click', (e) => {
    if (e.target === addModal) closeAddModal();
});

newApiPath.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addNewApi();
});

// Initialization
fetchApis();

// Periodic update (Polling)
setInterval(fetchApis, 2000);
