// LocalStorage-da məlumatları saxlayırıq
let ads = JSON.parse(localStorage.getItem('ads')) || [
    { id: 1, title: 'BMW E60 Mühərrik Yastığı', price: 150, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
    { id: 2, title: 'Mercedes W211 Ön Bufer', price: 350, image: 'https://images.unsplash.com/photo-1600320254378-01e4a2dc98cc?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' }
];

let users = JSON.parse(localStorage.getItem('users')) || [];

// Admin login məlumatları
let adminCreds = JSON.parse(localStorage.getItem('adminCreds')) || { user: 'admin', pass: 'toghruladmin123' };

document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const adminLayout = document.getElementById('admin-layout');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    // Modal elements
    const adModal = document.getElementById('ad-modal');
    const adForm = document.getElementById('ad-form');
    const addAdBtn = document.getElementById('add-ad-btn');
    const cancelModal = document.getElementById('cancel-modal');
    const modalTitle = document.getElementById('modal-title');

    // Admin Giriş Formu
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('admin-user').value;
            const pass = document.getElementById('admin-pass').value;

            if (user === adminCreds.user && pass === adminCreds.pass) {
                localStorage.setItem('isAdminLoggedIn', 'true');
                showAdminPanel();
            } else {
                alert('Yanlış admin adı və ya şifrə!');
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isAdminLoggedIn');
            window.location.href = '/';
        });
    }

    // Modal Control
    if (addAdBtn) {
        addAdBtn.addEventListener('click', () => {
            modalTitle.textContent = 'Yeni Elan';
            adForm.reset();
            document.getElementById('ad-id').value = '';
            adModal.style.display = 'flex';
        });
    }

    if (cancelModal) {
        cancelModal.addEventListener('click', () => {
            adModal.style.display = 'none';
        });
    }

    // Save Ad (Add or Edit)
    if (adForm) {
        adForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('ad-id').value;
            const title = document.getElementById('ad-title').value;
            const price = document.getElementById('ad-price').value;
            const image = document.getElementById('ad-image').value;
            const status = document.getElementById('ad-status').value;

            if (id) {
                // Edit existing
                const index = ads.findIndex(a => a.id == id);
                if (index !== -1) {
                    ads[index] = { ...ads[index], title, price, image, status };
                }
            } else {
                // Add new
                const newAd = {
                    id: Date.now(),
                    title,
                    price,
                    image,
                    status
                };
                ads.push(newAd);
            }

            saveToStorage();
            renderAds();
            updateStats();
            adModal.style.display = 'none';
        });
    }

    // Settings Submit
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newUser = document.getElementById('new-admin-user').value;
            const newPass = document.getElementById('new-admin-pass').value;

            adminCreds = { user: newUser, pass: newPass };
            localStorage.setItem('adminCreds', JSON.stringify(adminCreds));
            alert('Admin məlumatları yeniləndi!');
        });
    }

    // Əgər admin daxil olubsa
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        showAdminPanel();
    }

    function showAdminPanel() {
        if (loginSection) loginSection.style.display = 'none';
        if (adminLayout) adminLayout.style.display = 'flex';

        users = JSON.parse(localStorage.getItem('users')) || [];
        ads = JSON.parse(localStorage.getItem('ads')) || [];

        updateStats();
        renderAds();
        renderUsers();
    }

    // Naviqasiya
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const section = link.getAttribute('data-section');
            if (section) {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                const sections = ['dashboard', 'ads', 'users', 'categories', 'settings'];
                sections.forEach(s => {
                    const el = document.getElementById(`section-${s}`);
                    if (el) el.style.display = s === section ? 'block' : 'none';
                });

                const pageTitle = document.getElementById('page-title');
                if (pageTitle) {
                    pageTitle.textContent = section === 'dashboard' ? 'Dashboard' :
                        section === 'ads' ? 'Elanlar' :
                            section === 'users' ? 'İstifadəçilər' :
                                section === 'categories' ? 'Kateqoriyalar' : 'Ayarlar';
                }

                if (localStorage.getItem('isAdminLoggedIn') === 'true') {
                    users = JSON.parse(localStorage.getItem('users')) || [];
                    ads = JSON.parse(localStorage.getItem('ads')) || [];
                    renderAds();
                    renderUsers();
                    updateStats();
                }
            }
        });
    });

    function renderAds() {
        const tbody = document.getElementById('ads-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        ads.forEach(ad => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${ad.image}" class="ad-img-cell" alt=""></td>
                <td>${ad.title}</td>
                <td>${ad.price} ₼</td>
                <td><span class="status-badge ${ad.status === 'active' ? 'status-active' : 'status-pending'}">${ad.status === 'active' ? 'Aktiv' : 'Gözləyir'}</span></td>
                <td class="actions">
                    <button class="btn-action btn-edit" onclick="editAd(${ad.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-action btn-delete" onclick="deleteAd(${ad.id})"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderUsers() {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span id="pass-text-${user.id}" style="font-family: monospace; letter-spacing: 2px;">••••••••</span>
                        <button class="btn-action" onclick="togglePassDisplay(${user.id}, '${user.password}')" style="padding: 2px 8px; font-size: 12px;">
                            <i class="fa-solid fa-eye" id="pass-icon-${user.id}"></i>
                        </button>
                    </div>
                </td>
                <td class="actions">
                    <button class="btn-action btn-delete" onclick="deleteUser(${user.id})"><i class="fa-solid fa-user-slash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.togglePassDisplay = (id, actualPass) => {
        const span = document.getElementById(`pass-text-${id}`);
        const icon = document.getElementById(`pass-icon-${id}`);
        if (span.textContent === '••••••••') {
            span.textContent = actualPass;
            span.style.letterSpacing = 'normal';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            span.textContent = '••••••••';
            span.style.letterSpacing = '2px';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    };

    window.editAd = (id) => {
        const ad = ads.find(a => a.id == id);
        if (!ad) return;

        modalTitle.textContent = 'Elanı Redaktə Et';
        document.getElementById('ad-id').value = ad.id;
        document.getElementById('ad-title').value = ad.title;
        document.getElementById('ad-price').value = ad.price;
        document.getElementById('ad-image').value = ad.image;
        document.getElementById('ad-status').value = ad.status;

        adModal.style.display = 'flex';
    };

    function updateStats() {
        const totalAdsEl = document.getElementById('stat-total-ads');
        const totalUsersEl = document.getElementById('stat-total-users');
        if (!totalAdsEl) return;

        const totalAds = ads.length;
        const activeAds = ads.filter(a => a.status === 'active').length;
        const pendingAds = totalAds - activeAds;
        const totalUsers = users.length;

        totalAdsEl.textContent = totalAds;
        totalUsersEl.textContent = totalUsers;
        document.getElementById('stat-active-ads').textContent = activeAds;
        document.getElementById('stat-pending-ads').textContent = pendingAds;
    }

    window.deleteAd = (id) => {
        if (confirm('Bu elanı silmək istəyirsiniz?')) {
            ads = ads.filter(a => a.id !== id);
            saveToStorage();
            renderAds();
            updateStats();
        }
    };

    window.deleteUser = (id) => {
        if (confirm('Bu istifadəçini silmək istəyirsiniz?')) {
            users = users.filter(u => u.id !== id);
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers();
            updateStats();
        }
    };

    function saveToStorage() {
        localStorage.setItem('ads', JSON.stringify(ads));
    }
});
