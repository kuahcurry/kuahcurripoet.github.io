// Admin Authentication System for Poetry Website
// This file handles secure poem management - only the admin can add/edit/delete poems

class AdminAuth {
    constructor() {
        this.isAuthenticated = false;
        this.adminPassword = 'poet2025!'; // Change this to your desired password
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.checkAuthStatus();
    }

    // Check if admin is currently authenticated
    checkAuthStatus() {
        const authData = localStorage.getItem('poetAdmin');
        if (authData) {
            const { timestamp, authenticated } = JSON.parse(authData);
            const now = Date.now();
            
            // Check if session hasn't expired
            if (authenticated && (now - timestamp < this.sessionTimeout)) {
                this.isAuthenticated = true;
                this.showAdminControls();
                return true;
            } else {
                // Session expired
                this.logout();
            }
        }
        this.hideAdminControls();
        return false;
    }

    // Authenticate admin
    login(password) {
        if (password === this.adminPassword) {
            this.isAuthenticated = true;
            localStorage.setItem('poetAdmin', JSON.stringify({
                authenticated: true,
                timestamp: Date.now()
            }));
            this.showAdminControls();
            document.getElementById('admin-login').style.display = 'none';
            return true;
        }
        return false;
    }

    // Logout admin
    logout() {
        this.isAuthenticated = false;
        localStorage.removeItem('poetAdmin');
        this.hideAdminControls();
        document.getElementById('admin-login').style.display = 'none';
    }

    // Show admin controls
    showAdminControls() {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(element => {
            element.style.display = element.dataset.originalDisplay || 'block';
        });
        
        // Show admin indicator
        this.showAdminIndicator();
    }

    // Hide admin controls
    hideAdminControls() {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(element => {
            element.dataset.originalDisplay = element.style.display;
            element.style.display = 'none';
        });
        
        // Hide admin indicator
        this.hideAdminIndicator();
    }

    // Show admin indicator in header
    showAdminIndicator() {
        let indicator = document.getElementById('admin-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'admin-indicator';
            indicator.innerHTML = `
                <span class="admin-badge">Admin Mode</span>
                <button class="logout-btn" onclick="adminAuth.logout()">Logout</button>
            `;
            const nav = document.querySelector('.nav');
            if (nav) nav.appendChild(indicator);
        }
        indicator.style.display = 'flex';
    }

    // Hide admin indicator
    hideAdminIndicator() {
        const indicator = document.getElementById('admin-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    // Check if current user is admin
    isAdmin() {
        return this.checkAuthStatus();
    }
}

// Enhanced Poem Manager with Admin Protection
class SecurePoemManager extends PoemManager {
    // Override methods to require admin authentication
    
    addPoem(poemData) {
        if (!adminAuth.isAdmin()) {
            alert('Admin access required to add poems.');
            return null;
        }
        return super.addPoem(poemData);
    }

    deletePoem(id) {
        if (!adminAuth.isAdmin()) {
            alert('Admin access required to delete poems.');
            return false;
        }
        if (confirm('Are you sure you want to delete this poem? This action cannot be undone.')) {
            return super.deletePoem(id);
        }
        return false;
    }

    updatePoem(id, updatedData) {
        if (!adminAuth.isAdmin()) {
            alert('Admin access required to edit poems.');
            return null;
        }
        return super.updatePoem(id, updatedData);
    }
}

// Global instances
const adminAuth = new AdminAuth();
const securePoemManager = new SecurePoemManager();

// Admin login functions
function showAdminLogin() {
    const loginModal = document.getElementById('admin-login');
    if (loginModal) {
        loginModal.style.display = 'flex';
        document.getElementById('admin-password').focus();
    }
}

function hideAdminLogin() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-password').value = '';
}

function attemptAdminLogin() {
    const password = document.getElementById('admin-password').value;
    if (adminAuth.login(password)) {
        hideAdminLogin();
        loadPoemsToPage();
        alert('Welcome back! You are now in admin mode.');
    } else {
        document.getElementById('login-error').style.display = 'block';
        document.getElementById('admin-password').value = '';
        setTimeout(() => {
            document.getElementById('login-error').style.display = 'none';
        }, 3000);
    }
}

// Override the original functions to use secure manager
function addNewPoem() {
    if (!adminAuth.isAdmin()) {
        showAdminLogin();
        return;
    }
    
    document.getElementById('add-poem-form').style.display = 'block';
    document.getElementById('form-title').textContent = 'Add New Poem';
    document.getElementById('submit-btn').textContent = 'Add Poem';
    document.getElementById('editing-poem-id').value = '';
    document.getElementById('poem-form').reset();
    document.getElementById('add-poem-form').scrollIntoView({ behavior: 'smooth' });
}

function editPoem(poemId) {
    if (!adminAuth.isAdmin()) {
        showAdminLogin();
        return;
    }
    
    const poem = securePoemManager.getPoemById(poemId);
    if (poem) {
        document.getElementById('poem-title').value = poem.title;
        document.getElementById('poem-subtitle').value = poem.subtitle;
        document.getElementById('poem-content').value = poem.content;
        document.getElementById('poem-tags').value = poem.tags.join(', ');
        document.getElementById('editing-poem-id').value = poemId;
        
        document.getElementById('add-poem-form').style.display = 'block';
        document.getElementById('form-title').textContent = 'Edit Poem';
        document.getElementById('submit-btn').textContent = 'Update Poem';
        
        document.getElementById('add-poem-form').scrollIntoView({ behavior: 'smooth' });
    }
}

function deletePoem(poemId) {
    if (!adminAuth.isAdmin()) {
        showAdminLogin();
        return;
    }
    
    if (securePoemManager.deletePoem(poemId)) {
        loadPoemsToPage();
    }
}

function submitPoem(event) {
    event.preventDefault();
    
    if (!adminAuth.isAdmin()) {
        showAdminLogin();
        return;
    }
    
    const title = document.getElementById('poem-title').value.trim();
    const subtitle = document.getElementById('poem-subtitle').value.trim();
    const content = document.getElementById('poem-content').value.trim();
    const tags = document.getElementById('poem-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const editingId = document.getElementById('editing-poem-id').value;
    
    if (!title || !content) {
        alert('Please fill in at least the title and content fields.');
        return;
    }
    
    if (editingId) {
        securePoemManager.updatePoem(editingId, { title, subtitle, content, tags });
    } else {
        securePoemManager.addPoem({ title, subtitle, content, tags });
    }
    
    loadPoemsToPage();
    cancelForm();
    alert(editingId ? 'Poem updated successfully!' : 'Poem added successfully!');
}

function loadPoemsToPage() {
    const poemsGrid = document.querySelector('.poems-grid');
    if (poemsGrid) {
        const poems = securePoemManager.getAllPoems();
        poemsGrid.innerHTML = poems.map(poem => generateSecurePoemCard(poem)).join('');
        
        // Reapply fade-in animations
        const poemCards = document.querySelectorAll('.poem-card');
        poemCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }, index * 100);
        });
    }
}

function generateSecurePoemCard(poem) {
    const isAdmin = adminAuth.isAdmin();
    return `
        <article class="poem-card" data-poem-id="${poem.id}">
            <h3 class="poem-title">${poem.title}</h3>
            <div class="poem-excerpt">
                <p><em>${poem.excerpt.replace(/\n/g, '<br>')}</em></p>
            </div>
            <div class="poem-actions">
                <a href="#" class="read-more" onclick="viewPoem('${poem.id}')">Read Full Poem</a>
                <div class="poem-management admin-only" style="display: ${isAdmin ? 'flex' : 'none'};">
                    <button class="edit-btn" onclick="editPoem('${poem.id}')">Edit</button>
                    <button class="delete-btn" onclick="deletePoem('${poem.id}')">Delete</button>
                </div>
            </div>
        </article>
    `;
}

// Handle Enter key in password field
function handleLoginKeyPress(event) {
    if (event.key === 'Enter') {
        attemptAdminLogin();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check admin status and load poems
    adminAuth.checkAuthStatus();
    loadPoemsToPage();
    
    // Auto-logout after session timeout
    setInterval(() => {
        adminAuth.checkAuthStatus();
    }, 60000); // Check every minute
});
