// Advanced Authentication and User Management System
class AuthenticationSystem {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.sessionTimer = null;
        this.permissions = new Map();
        this.auditLog = [];
        this.loginAttempts = new Map();
        this.maxLoginAttempts = 5;
        this.lockoutDuration = 15 * 60 * 1000; // 15 minutes

        this.initAuthSystem();
    }

    initAuthSystem() {
        this.createLoginModal();
        this.setupSessionManagement();
        this.checkExistingSession();
        this.setupPermissionSystem();
    }

    createLoginModal() {
        const modalHTML = `
            <div class="auth-modal" id="auth-modal" style="display: none;">
                <div class="auth-container">
                    <div class="auth-header">
                        <h2>Enterprise Maps Login</h2>
                        <span class="close-auth" id="close-auth">&times;</span>
                    </div>
                    
                    <div class="auth-tabs">
                        <button class="tab-btn active" data-tab="login">Login</button>
                        <button class="tab-btn" data-tab="register">Register</button>
                        <button class="tab-btn" data-tab="forgot">Forgot Password</button>
                    </div>
                    
                    <!-- Login Form -->
                    <div class="auth-form" id="login-form">
                        <div class="form-group">
                            <input type="email" id="login-email" placeholder="Email Address" required>
                            <i class="material-icons">email</i>
                        </div>
                        <div class="form-group">
                            <input type="password" id="login-password" placeholder="Password" required>
                            <i class="material-icons">lock</i>
                            <button type="button" class="toggle-password" id="toggle-login-password">
                                <i class="material-icons">visibility</i>
                            </button>
                        </div>
                        <div class="form-options">
                            <label class="checkbox-container">
                                <input type="checkbox" id="remember-me">
                                <span class="checkmark"></span>
                                Remember me
                            </label>
                            <a href="#" class="forgot-link">Forgot password?</a>
                        </div>
                        <button class="auth-btn login-btn" id="login-btn">Login</button>
                        <div class="social-login">
                            <button class="social-btn google-btn">
                                <i class="fab fa-google"></i> Login with Google
                            </button>
                            <button class="social-btn microsoft-btn">
                                <i class="fab fa-microsoft"></i> Login with Microsoft
                            </button>
                        </div>
                    </div>
                    
                    <!-- Registration Form -->
                    <div class="auth-form" id="register-form" style="display: none;">
                        <div class="form-group">
                            <input type="text" id="register-name" placeholder="Full Name" required>
                            <i class="material-icons">person</i>
                        </div>
                        <div class="form-group">
                            <input type="email" id="register-email" placeholder="Email Address" required>
                            <i class="material-icons">email</i>
                        </div>
                        <div class="form-group">
                            <input type="text" id="register-company" placeholder="Company/Organization">
                            <i class="material-icons">business</i>
                        </div>
                        <div class="form-group">
                            <select id="register-role" required>
                                <option value="">Select Role</option>
                                <option value="admin">Administrator</option>
                                <option value="manager">Manager</option>
                                <option value="analyst">Analyst</option>
                                <option value="viewer">Viewer</option>
                            </select>
                            <i class="material-icons">work</i>
                        </div>
                        <div class="form-group">
                            <input type="password" id="register-password" placeholder="Password" required>
                            <i class="material-icons">lock</i>
                            <div class="password-strength" id="password-strength"></div>
                        </div>
                        <div class="form-group">
                            <input type="password" id="register-confirm-password" placeholder="Confirm Password" required>
                            <i class="material-icons">lock</i>
                        </div>
                        <div class="form-options">
                            <label class="checkbox-container">
                                <input type="checkbox" id="agree-terms" required>
                                <span class="checkmark"></span>
                                I agree to the <a href="#" target="_blank">Terms of Service</a>
                            </label>
                        </div>
                        <button class="auth-btn register-btn" id="register-btn">Create Account</button>
                    </div>
                    
                    <!-- Forgot Password Form -->
                    <div class="auth-form" id="forgot-form" style="display: none;">
                        <div class="form-group">
                            <input type="email" id="forgot-email" placeholder="Email Address" required>
                            <i class="material-icons">email</i>
                        </div>
                        <button class="auth-btn forgot-btn" id="forgot-btn">Reset Password</button>
                        <p class="form-note">We'll send you a link to reset your password.</p>
                    </div>
                    
                    <div class="auth-footer">
                        <p>Need help? <a href="#" class="support-link">Contact Support</a></p>
                    </div>
                </div>
            </div>
            
            <!-- User Profile Dropdown -->
            <div class="user-profile-menu" id="user-profile-menu" style="display: none;">
                <div class="profile-header">
                    <div class="profile-avatar" id="profile-avatar">
                        <i class="material-icons">account_circle</i>
                    </div>
                    <div class="profile-info">
                        <div class="profile-name" id="profile-name">User Name</div>
                        <div class="profile-email" id="profile-email">user@example.com</div>
                    </div>
                </div>
                <div class="profile-menu-items">
                    <a href="#" class="menu-item" id="my-account">
                        <i class="material-icons">settings</i>
                        My Account
                    </a>
                    <a href="#" class="menu-item" id="user-preferences">
                        <i class="material-icons">tune</i>
                        Preferences
                    </a>
                    <a href="#" class="menu-item" id="billing-info">
                        <i class="material-icons">payment</i>
                        Billing
                    </a>
                    <a href="#" class="menu-item" id="api-keys">
                        <i class="material-icons">vpn_key</i>
                        API Keys
                    </a>
                    <div class="menu-divider"></div>
                    <a href="#" class="menu-item" id="help-support">
                        <i class="material-icons">help</i>
                        Help & Support
                    </a>
                    <a href="#" class="menu-item logout-item" id="logout-btn">
                        <i class="material-icons">logout</i>
                        Logout
                    </a>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupAuthEventListeners();
    }

    setupAuthEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchAuthTab(tab);
            });
        });

        // Form submissions
        document.getElementById('login-btn').addEventListener('click', () => this.handleLogin());
        document.getElementById('register-btn').addEventListener('click', () => this.handleRegistration());
        document.getElementById('forgot-btn').addEventListener('click', () => this.handleForgotPassword());

        // Password visibility toggle
        document.getElementById('toggle-login-password').addEventListener('click', () => {
            this.togglePasswordVisibility('login-password', 'toggle-login-password');
        });

        // Password strength checker
        document.getElementById('register-password').addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Close modal
        document.getElementById('close-auth').addEventListener('click', () => {
            this.hideAuthModal();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.style.display = 'none');

        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}-form`).style.display = 'block';
    }

    showAuthModal() {
        document.getElementById('auth-modal').style.display = 'flex';
    }

    hideAuthModal() {
        document.getElementById('auth-modal').style.display = 'none';
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Check for login attempts lockout
        if (this.isAccountLocked(email)) {
            this.showNotification('Account temporarily locked due to multiple failed attempts', 'error');
            return;
        }

        try {
            const loginResult = await this.authenticateUser(email, password);

            if (loginResult.success) {
                this.currentUser = loginResult.user;
                this.setUserSession(loginResult.user, rememberMe);
                this.setupPermissions(loginResult.user.role);
                this.logAuditEvent('login', 'User logged in successfully');
                this.hideAuthModal();
                this.updateUIForLoggedInUser();
                this.showNotification('Login successful!', 'success');
                this.resetLoginAttempts(email);
            } else {
                this.recordFailedLogin(email);
                this.showNotification(loginResult.message || 'Invalid credentials', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Login failed. Please try again.', 'error');
        }
    }

    async authenticateUser(email, password) {
        // In a real implementation, this would call your authentication API
        // For demo purposes, we'll simulate authentication

        const mockUsers = [
            {
                id: 1,
                email: 'admin@company.com',
                password: 'admin123', // In real app, this would be hashed
                name: 'John Administrator',
                role: 'admin',
                company: 'Acme Corp',
                permissions: ['all']
            },
            {
                id: 2,
                email: 'manager@company.com',
                password: 'manager123',
                name: 'Jane Manager',
                role: 'manager',
                company: 'Acme Corp',
                permissions: ['read', 'write', 'analytics']
            },
            {
                id: 3,
                email: 'analyst@company.com',
                password: 'analyst123',
                name: 'Bob Analyst',
                role: 'analyst',
                company: 'Acme Corp',
                permissions: ['read', 'analytics']
            }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = mockUsers.find(u => u.email === email && u.password === password);

        if (user) {
            return {
                success: true,
                user: {
                    ...user,
                    lastLogin: new Date().toISOString(),
                    sessionId: this.generateSessionId()
                }
            };
        } else {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
    }

    async handleRegistration() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const company = document.getElementById('register-company').value;
        const role = document.getElementById('register-role').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const agreeTerms = document.getElementById('agree-terms').checked;

        if (!name || !email || !role || !password || !confirmPassword) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (!agreeTerms) {
            this.showNotification('Please agree to the Terms of Service', 'error');
            return;
        }

        if (!this.isPasswordStrong(password)) {
            this.showNotification('Password does not meet security requirements', 'error');
            return;
        }

        try {
            const registrationResult = await this.registerUser({
                name, email, company, role, password
            });

            if (registrationResult.success) {
                this.showNotification('Registration successful! Please check your email for verification.', 'success');
                this.switchAuthTab('login');
            } else {
                this.showNotification(registrationResult.message || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification('Registration failed. Please try again.', 'error');
        }
    }

    async registerUser(userData) {
        // Simulate registration API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real implementation, this would validate and create the user
        return {
            success: true,
            message: 'User registered successfully'
        };
    }

    checkPasswordStrength(password) {
        const strengthElement = document.getElementById('password-strength');
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const score = Object.values(requirements).filter(Boolean).length;
        const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
        const colors = ['#ff4444', '#ff8800', '#ffaa00', '#88cc00', '#00cc44'];

        strengthElement.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill" style="width: ${score * 20}%; background-color: ${colors[score - 1] || '#ccc'}"></div>
            </div>
            <div class="strength-text">${strength}</div>
        `;
    }

    isPasswordStrong(password) {
        return password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /\d/.test(password) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(password);
    }

    setupPermissions(role) {
        const rolePermissions = {
            admin: ['all'],
            manager: ['read', 'write', 'analytics', 'fleet', 'reports'],
            analyst: ['read', 'analytics', 'reports'],
            viewer: ['read']
        };

        this.permissions.set(this.currentUser.id, rolePermissions[role] || ['read']);
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        const userPermissions = this.permissions.get(this.currentUser.id) || [];
        return userPermissions.includes('all') || userPermissions.includes(permission);
    }

    setUserSession(user, remember) {
        const sessionData = {
            user: user,
            timestamp: Date.now(),
            remember: remember
        };

        if (remember) {
            localStorage.setItem('enterpriseMapsSession', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('enterpriseMapsSession', JSON.stringify(sessionData));
        }

        this.startSessionTimer();
    }

    checkExistingSession() {
        const sessionData = JSON.parse(
            localStorage.getItem('enterpriseMapsSession') ||
            sessionStorage.getItem('enterpriseMapsSession') ||
            'null'
        );

        if (sessionData && sessionData.user) {
            // Check if session is still valid
            const timeDiff = Date.now() - sessionData.timestamp;
            if (timeDiff < this.sessionTimeout || sessionData.remember) {
                this.currentUser = sessionData.user;
                this.setupPermissions(sessionData.user.role);
                this.updateUIForLoggedInUser();
                this.startSessionTimer();
                return true;
            } else {
                this.clearSession();
            }
        }
        return false;
    }

    startSessionTimer() {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }

        this.sessionTimer = setTimeout(() => {
            this.showSessionExpiredDialog();
        }, this.sessionTimeout);
    }

    showSessionExpiredDialog() {
        if (confirm('Your session has expired. Would you like to continue working?')) {
            this.extendSession();
        } else {
            this.logout();
        }
    }

    extendSession() {
        if (this.currentUser) {
            this.setUserSession(this.currentUser, false);
        }
    }

    updateUIForLoggedInUser() {
        // Update header to show user info
        const headerRight = document.querySelector('.header-right');
        if (headerRight && this.currentUser) {
            const userButton = `
                <button class="user-profile-btn" id="user-profile-btn" title="${this.currentUser.name}">
                    <div class="user-avatar">
                        ${this.currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span class="user-name">${this.currentUser.name}</span>
                    <i class="material-icons">arrow_drop_down</i>
                </button>
            `;

            headerRight.insertAdjacentHTML('beforeend', userButton);

            document.getElementById('user-profile-btn').addEventListener('click', () => {
                this.toggleProfileMenu();
            });

            // Update profile menu info
            document.getElementById('profile-name').textContent = this.currentUser.name;
            document.getElementById('profile-email').textContent = this.currentUser.email;
        }

        // Show/hide features based on permissions
        this.updateUIPermissions();
    }

    updateUIPermissions() {
        // Hide/show enterprise features based on user permissions
        const enterpriseElements = document.querySelectorAll('[data-permission]');
        enterpriseElements.forEach(element => {
            const requiredPermission = element.dataset.permission;
            if (this.hasPermission(requiredPermission)) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
    }

    toggleProfileMenu() {
        const menu = document.getElementById('user-profile-menu');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }

    logout() {
        this.logAuditEvent('logout', 'User logged out');
        this.clearSession();
        this.currentUser = null;
        this.permissions.clear();

        // Reload page to reset UI
        window.location.reload();
    }

    clearSession() {
        localStorage.removeItem('enterpriseMapsSession');
        sessionStorage.removeItem('enterpriseMapsSession');
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
    }

    recordFailedLogin(email) {
        const attempts = this.loginAttempts.get(email) || { count: 0, timestamp: Date.now() };
        attempts.count++;
        attempts.lastAttempt = Date.now();
        this.loginAttempts.set(email, attempts);
    }

    resetLoginAttempts(email) {
        this.loginAttempts.delete(email);
    }

    isAccountLocked(email) {
        const attempts = this.loginAttempts.get(email);
        if (!attempts) return false;

        const timeDiff = Date.now() - attempts.lastAttempt;
        if (timeDiff > this.lockoutDuration) {
            this.resetLoginAttempts(email);
            return false;
        }

        return attempts.count >= this.maxLoginAttempts;
    }

    logAuditEvent(action, description) {
        const auditEntry = {
            timestamp: new Date().toISOString(),
            userId: this.currentUser?.id,
            userEmail: this.currentUser?.email,
            action: action,
            description: description,
            ipAddress: 'xxx.xxx.xxx.xxx', // In real app, get actual IP
            userAgent: navigator.userAgent
        };

        this.auditLog.push(auditEntry);

        // In real app, send to audit service
        console.log('Audit Log:', auditEntry);
    }

    generateSessionId() {
        return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    togglePasswordVisibility(passwordId, toggleId) {
        const passwordInput = document.getElementById(passwordId);
        const toggleIcon = document.querySelector(`#${toggleId} .material-icons`);

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.textContent = 'visibility_off';
        } else {
            passwordInput.type = 'password';
            toggleIcon.textContent = 'visibility';
        }
    }

    showNotification(message, type = 'info') {
        // Reuse existing notification system
        if (window.enterpriseMaps && window.enterpriseMaps.showNotification) {
            window.enterpriseMaps.showNotification(message, type);
        } else {
            alert(message); // Fallback
        }
    }
}

// Initialize authentication system
window.authSystem = new AuthenticationSystem();
