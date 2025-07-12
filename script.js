// Application state
let currentUser = null;
let items = [];
let swaps = [];
let nextItemId = 1;

// Initialize with sample data
function initializeSampleData() {
    items = [
        {
            id: 1,
            title: "Vintage Denim Jacket",
            description: "Classic blue denim jacket in excellent condition",
            category: "outerwear",
            size: "m",
            condition: "excellent",
            tags: ["vintage", "denim", "casual"],
            owner: "demo@example.com",
            status: "approved",
            points: 25,
            available: true
        },
        {
            id: 2,
            title: "Floral Summer Dress",
            description: "Light and airy summer dress with floral pattern",
            category: "dresses",
            size: "s",
            condition: "good",
            tags: ["summer", "floral", "casual"],
            owner: "demo@example.com",
            status: "approved",
            points: 20,
            available: true
        },
        {
            id: 3,
            title: "Wool Sweater",
            description: "Cozy wool sweater perfect for winter",
            category: "tops",
            size: "l",
            condition: "excellent",
            tags: ["wool", "winter", "warm"],
            owner: "demo@example.com",
            status: "approved",
            points: 30,
            available: true
        }
    ];
    nextItemId = 4;
}



// Page navigation
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Load page-specific content
    if (pageId === 'browse') {
        loadBrowseItems();
    } else if (pageId === 'landing') {
        loadFeaturedItems();
    } else if (pageId === 'dashboard' && currentUser) {
        loadUserItems();
    }
}

// User authentication
function handleLogin(email, password) {
    // Simple demo authentication
    if (email === 'admin@rewear.com') {
        currentUser = { email, name: 'Admin User', points: 100, isAdmin: true };
        document.getElementById('adminLink').style.display = 'inline';
    } else {
        currentUser = { email, name: email.split('@')[0], points: 50, isAdmin: false };
    }
    
    updateUIForLoggedInUser();
    showPage('dashboard');
}

function updateUIForLoggedInUser() {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    document.getElementById('dashboardLink').style.display = 'inline';
    
    if (currentUser.isAdmin) {
        document.getElementById('adminLink').style.display = 'inline';
    }
    
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userPoints').textContent = currentUser.points;
    document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
    
    loadUserItems();
}

function logout() {
    currentUser = null;
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('dashboardLink').style.display = 'none';
    document.getElementById('adminLink').style.display = 'none';
    showPage('landing');
}

// Item management
function createItemCard(item) {
    return `
        <div class="item-card" onclick="showItemDetails(${item.id})">
            <div class="item-image">📷 Image placeholder</div>
            <div class="item-info">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <p><strong>Size:</strong> ${item.size.toUpperCase()} | <strong>Condition:</strong> ${item.condition}</p>
                <span class="points-badge">${item.points} points</span>
            </div>
        </div>
    `;
}

function loadFeaturedItems() {
    const featuredGrid = document.getElementById('featuredGrid');
    if (!featuredGrid) return;
    
    const approvedItems = items.filter(item => item.status === 'approved' && item.available);
    const featured = approvedItems.slice(0, 3);
    
    featuredGrid.innerHTML = featured.map(createItemCard).join('');
}

function loadBrowseItems() {
    const browseGrid = document.getElementById('browseGrid');
    if (!browseGrid) return;
    
    const approvedItems = items.filter(item => item.status === 'approved' && item.available);
    browseGrid.innerHTML = approvedItems.map(createItemCard).join('');
}

function loadUserItems() {
    if (!currentUser) return;
    
    const myItems = document.getElementById('myItems');
    if (!myItems) return;
    
    const userItems = items.filter(item => item.owner === currentUser.email);
    
    if (userItems.length === 0) {
        myItems.innerHTML = '<p>No items listed yet</p>';
    } else {
        myItems.innerHTML = userItems.map(item => `
            <div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h4>${item.title}</h4>
                <p class="status-${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</p>
            </div>
        `).join('');
    }
}

function showItemDetails(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const itemDetails = document.getElementById('itemDetails');
    if (!itemDetails) return;
    
    itemDetails.innerHTML = `
        <h2>${item.title}</h2>
        <div class="item-image" style="height: 250px; margin: 1rem 0;">📷 Image placeholder</div>
        <p><strong>Description:</strong> ${item.description}</p>
        <p><strong>Category:</strong> ${item.category}</p>
        <p><strong>Size:</strong> ${item.size.toUpperCase()}</p>
        <p><strong>Condition:</strong> ${item.condition}</p>
        <p><strong>Tags:</strong> ${item.tags.join(', ')}</p>
        <p><strong>Owner:</strong> ${item.owner}</p>
        <span class="points-badge">${item.points} points</span>
        <div style="margin-top: 2rem;">
            <button class="btn" onclick="requestSwap(${item.id})">Request Swap</button>
            <button class="btn btn-secondary" onclick="redeemWithPoints(${item.id})">Redeem (${item.points} points)</button>
            <button class="btn btn-secondary" onclick="closeModal()" style="margin-left: 1rem;">Close</button>
        </div>
    `;
    
    const modal = document.getElementById('itemModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('itemModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function requestSwap(itemId) {
    alert('Swap request sent! The item owner will be notified.');
    closeModal();
}

function redeemWithPoints(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!currentUser) {
        alert('Please login to redeem items');
        return;
    }
    
    if (currentUser.points >= item.points) {
        currentUser.points -= item.points;
        item.available = false;
        document.getElementById('userPoints').textContent = currentUser.points;
        alert('Item redeemed successfully!');
        closeModal();
        loadBrowseItems();
    } else {
        alert('Not enough points!');
    }
}

// Admin functions
function loadPendingItems() {
    const adminItems = document.getElementById('adminItems');
    if (!adminItems) return;
    
    const pendingItems = items.filter(item => item.status === 'pending');
    
    if (pendingItems.length === 0) {
        adminItems.innerHTML = '<p>No pending items</p>';
    } else {
        adminItems.innerHTML = pendingItems.map(item => `
            <div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <p><strong>Owner:</strong> ${item.owner}</p>
                <div style="margin-top: 1rem;">
                    <button class="btn" onclick="approveItem(${item.id})">Approve</button>
                    <button class="btn btn-secondary" onclick="rejectItem(${item.id})">Reject</button>
                </div>
            </div>
        `).join('');
    }
}

function loadAllItems() {
    const adminItems = document.getElementById('adminItems');
    if (!adminItems) return;
    
    adminItems.innerHTML = items.map(item => `
        <div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <p><strong>Owner:</strong> ${item.owner}</p>
            <p class="status-${item.status}"><strong>Status:</strong> ${item.status}</p>
            <div style="margin-top: 1rem;">
                <button class="btn btn-secondary" onclick="removeItem(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

function approveItem(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item) {
        item.status = 'approved';
        loadPendingItems();
        loadBrowseItems();
        loadFeaturedItems();
    }
}

function rejectItem(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item) {
        item.status = 'rejected';
        loadPendingItems();
    }
}

function removeItem(itemId) {
    const index = items.findIndex(i => i.id === itemId);
    if (index !== -1) {
        items.splice(index, 1);
        loadAllItems();
        loadBrowseItems();
        loadFeaturedItems();
    }
}

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sample data
    initializeSampleData();
    
    // Load initial content
    loadFeaturedItems();
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            handleLogin(email, password);
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const name = document.getElementById('signupName').value;
            handleLogin(email, password); // In real app, this would create account first
        });
    }
    
    // Add item form
    const addItemForm = document.getElementById('addItemForm');
    if (addItemForm) {
        addItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!currentUser) {
                alert('Please login to add items');
                return;
            }
            
            const newItem = {
                id: nextItemId++,
                title: document.getElementById('itemTitle').value,
                description: document.getElementById('itemDescription').value,
                category: document.getElementById('itemCategory').value,
                size: document.getElementById('itemSize').value,
                condition: document.getElementById('itemCondition').value,
                tags: document.getElementById('itemTags').value.split(',').map(tag => tag.trim()),
                owner: currentUser.email,
                status: 'pending',
                points: Math.floor(Math.random() * 20) + 15,
                available: true
            };
            
            items.push(newItem);
            document.getElementById('addItemForm').reset();
            alert('Item submitted for review!');
            loadUserItems();
            showPage('dashboard');
        });
    }
    
    // Close modal when clicking outside
    const itemModal = document.getElementById('itemModal');
    if (itemModal) {
        itemModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
});

 const pointToRupeeRate = 2; // 1 point = ₹2
  window.addEventListener('DOMContentLoaded', () => {
    const pointsSpan = document.getElementById('userPoints');
    if (pointsSpan) {
      const points = parseInt(pointsSpan.textContent);
      const rupees = points * pointToRupeeRate;
      pointsSpan.innerHTML = `${points} (₹${rupees})`;
    }
  });
  
// Make functions globally available
window.showPage = showPage;
window.handleLogin = handleLogin;
window.logout = logout;
window.showItemDetails = showItemDetails;
window.closeModal = closeModal;
window.requestSwap = requestSwap;
window.redeemWithPoints = redeemWithPoints;
window.loadPendingItems = loadPendingItems;
window.loadAllItems = loadAllItems;
window.approveItem = approveItem;
window.rejectItem = rejectItem;
window.removeItem = removeItem;