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

    // Əgər admin daxil olubsa
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        showAdminPanel();
    }

    function showAdminPanel() {
        if (loginSection) loginSection.style.display = 'none';
        if (adminLayout) adminLayout.style.display = 'flex';
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
                const pageSubtitle = document.getElementById('page-subtitle');
                if (pageTitle) {
                    pageTitle.textContent = section === 'dashboard' ? 'Dashboard' :
                        section === 'ads' ? 'Elanlar' :
                            section === 'users' ? 'İstifadəçilər' :
                                section === 'categories' ? 'Kateqoriyalar' : 'Ayarlar';
                }
                if (pageSubtitle) {
                    pageSubtitle.textContent = section === 'dashboard' ? 'Sistemin ümumi vəziyyəti' :
                        section === 'ads' ? 'Elanların idarə edilməsi' :
                            section === 'users' ? 'İstifadəçi bazası' :
                                section === 'categories' ? 'Kateqoriya tənzimləmələri' : 'Təhlükəsizlik';
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
                <td class="actions">
                    <button class="btn-action btn-delete" onclick="deleteUser(${user.id})"><i class="fa-solid fa-user-slash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

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

    // CRUD Funksiyaları
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

    window.editAd = (id) => {
        // Redaktə məntiqi modal vasitəsilə...
        alert('Redaktə funksiyası tezliklə aktiv olacaq.');
    };

    function saveToStorage() {
        localStorage.setItem('ads', JSON.stringify(ads));
    }
});
