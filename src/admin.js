// LocalStorage-da məlumatları saxlayırıq (Real bazamız olmadığı üçün)
let ads = JSON.parse(localStorage.getItem('ads')) || [
    { id: 1, title: 'BMW E60 Mühərrik Yastığı', price: 150, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
    { id: 2, title: 'Mercedes W211 Ön Bufer', price: 350, image: 'https://images.unsplash.com/photo-1600320254378-01e4a2dc98cc?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
    { id: 3, title: 'Hyundai Accent Arxa Stop', price: 80, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=400&h=300&auto=format&fit=crop', status: 'pending' }
];

// Admin login məlumatları
let adminCreds = JSON.parse(localStorage.getItem('adminCreds')) || { user: 'admin', pass: 'toghruladmin123' };

document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const adminLayout = document.getElementById('admin-layout');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const adPostTitle = document.querySelector('.auth-card h2');
    const adPostSubtitle = document.querySelector('.auth-card p');
    const loginSubmitBtn = document.querySelector('#login-form button');

    // 1. "Elan Ver" rejimini yoxlayırıq
    // Əgər istifadəçi birbaşa elan vermək üçün gəlibsə, login panelini "Elan Yerləşdir" rejiminə salırıq
    const isPostAdMode = true; // Hər kəs elan paylaşa bilsin deyə login ekranını sadələşdiririk

    if (isPostAdMode) {
        adPostTitle.textContent = "Elan Yerləşdir 👋";
        adPostSubtitle.textContent = "Məlumatları daxil edin və elanınız paylaşılsın";

        // Formu elan formuna çeviririk
        loginForm.innerHTML = `
            <div class="form-group">
                <label>Elanın başlığı</label>
                <input type="text" id="user-ad-title" class="form-input" placeholder="Məs: BMW F30 Fara" required>
            </div>
            <div class="form-group">
                <label>Qiymət (₼)</label>
                <input type="number" id="user-ad-price" class="form-input" placeholder="Məs: 150" required>
            </div>
            <div class="form-group">
                <label>Şəkil URL</label>
                <input type="url" id="user-ad-image" class="form-input" placeholder="https://..." required>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button type="submit" class="btn-primary" style="flex: 1;">Paylaş</button>
                <button type="button" id="go-to-admin" class="btn-action" style="background: #f1f5f9; width: auto; padding: 0 1rem;" title="Admin Girişi"><i class="fa-solid fa-lock"></i></button>
            </div>
        `;

        // Admin girişi düyməsi
        document.getElementById('go-to-admin').addEventListener('click', () => {
            location.reload(); // Sadəcə səhifəni yeniləyirik ki default login gəlsin (və ya aşağıdakı kimi dəyişə bilərik)
            localStorage.setItem('adminMode', 'true');
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newAd = {
                id: Date.now(),
                title: document.getElementById('user-ad-title').value,
                price: document.getElementById('user-ad-price').value,
                image: document.getElementById('user-ad-image').value,
                status: 'active' // İstifadəçi birbaşa paylaşır
            };
            ads.push(newAd);
            saveToStorage();
            alert('Elanınız uğurla yerləşdirildi!');
            window.location.href = '/';
        });
    }

    // Əgər admin login mode aktivdirsə
    if (localStorage.getItem('adminMode') === 'true') {
        localStorage.removeItem('adminMode');
        restoreAdminLoginForm();
    }

    function restoreAdminLoginForm() {
        adPostTitle.textContent = "Admin Girişi 🔐";
        adPostSubtitle.textContent = "İdarəetmə paneli üçün daxil olun";
        loginForm.innerHTML = `
            <div class="form-group">
                <label>İstifadəçi adı</label>
                <input type="text" id="admin-user" class="form-input" placeholder="admin" required>
            </div>
            <div class="form-group">
                <label>Şifrə</label>
                <input type="password" id="admin-pass" class="form-input" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn-primary" style="width: 100%;">Daxil ol</button>
        `;

        loginForm.removeEventListener('submit', null); // Köhnə event-i təmizlə
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('admin-user').value;
            const pass = document.getElementById('admin-pass').value;

            if (user === adminCreds.user && pass === adminCreds.pass) {
                localStorage.setItem('isAdminLoggedIn', 'true');
                showAdminPanel();
            } else {
                alert('Yanlış istifadəçi adı və ya şifrə!');
            }
        });
    }

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isAdminLoggedIn');
        location.reload();
    });

    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        showAdminPanel();
    }

    function showAdminPanel() {
        loginSection.style.display = 'none';
        adminLayout.style.display = 'flex';
        updateStats();
        renderAds();
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
                document.getElementById('section-dashboard').style.display = section === 'dashboard' ? 'block' : 'none';
                document.getElementById('section-ads').style.display = section === 'ads' ? 'block' : 'none';
                document.getElementById('section-settings').style.display = section === 'settings' ? 'block' : 'none';
                document.getElementById('page-title').textContent = section === 'dashboard' ? 'Dashboard' :
                    section === 'ads' ? 'Elanlar' : 'Ayarlar';
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

    function updateStats() {
        if (!document.getElementById('stat-total-ads')) return;
        const total = ads.length;
        const active = ads.filter(a => a.status === 'active').length;
        const pending = total - active;
        document.getElementById('stat-total-ads').textContent = total;
        document.getElementById('stat-active-ads').textContent = active;
        document.getElementById('stat-pending-ads').textContent = pending;
    }

    window.deleteAd = (id) => {
        if (confirm('Silmək istəyirsiniz?')) {
            ads = ads.filter(a => a.id !== id);
            saveToStorage();
            renderAds();
            updateStats();
        }
    };

    function saveToStorage() {
        localStorage.setItem('ads', JSON.stringify(ads));
    }
});
