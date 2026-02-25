// LocalStorage-da məlumatları saxlayırıq (Real bazamız olmadığı üçün)
let ads = JSON.parse(localStorage.getItem('ads')) || [
    { id: 1, title: 'BMW E60 Mühərrik Yastığı', price: 150, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
    { id: 2, title: 'Mercedes W211 Ön Bufer', price: 350, image: 'https://images.unsplash.com/photo-1600320254378-01e4a2dc98cc?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
    { id: 2, title: 'Mercedes W211 Ön Bufer', price: 350, image: 'https://images.unsplash.com/photo-1600320254378-01e4a2dc98cc?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
    { id: 3, title: 'Hyundai Accent Arxa Stop', price: 80, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=400&h=300&auto=format&fit=crop', status: 'pending' }
];

// Admin login məlumatlarını yadda saxlayırıq
let adminCreds = JSON.parse(localStorage.getItem('adminCreds')) || { user: 'admin', pass: '1234' };

document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const adminLayout = document.getElementById('admin-layout');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    // 1. Login Sistemi (Dinamik yoxlama)
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

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isAdminLoggedIn');
        location.reload();
    });

    // Giriş edilibsə birbaşa paneli göstər
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        showAdminPanel();
    }

    function showAdminPanel() {
        loginSection.style.display = 'none';
        adminLayout.style.display = 'flex';
        updateStats();
        renderAds();
    }

    // 2. Naviqasiya
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const section = link.getAttribute('data-section');
            if (section) {
                e.preventDefault();
                // Linkləri aktivləşdir
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Bölmələri göstər/gizlə
                document.getElementById('section-dashboard').style.display = section === 'dashboard' ? 'block' : 'none';
                document.getElementById('section-ads').style.display = section === 'ads' ? 'block' : 'none';
                document.getElementById('section-settings').style.display = section === 'settings' ? 'block' : 'none';

                // Başlıqları yenilə
                document.getElementById('page-title').textContent = section === 'dashboard' ? 'Dashboard' :
                    section === 'ads' ? 'Elanlar' : 'Ayarlar';
                document.getElementById('page-subtitle').textContent = section === 'dashboard' ? 'Sistemin ümumi vəziyyəti' :
                    section === 'ads' ? 'Elanların idarə edilməsi' : 'Təhlükəsizlik tənzimləmələri';
            }
        });
    });

    // 2.1 Ayarlar Formu
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        // Mövcud məlumatları doldur
        document.getElementById('new-admin-user').value = adminCreds.user;
        document.getElementById('new-admin-pass').value = adminCreds.pass;

        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newUser = document.getElementById('new-admin-user').value;
            const newPass = document.getElementById('new-admin-pass').value;

            if (newUser && newPass) {
                adminCreds = { user: newUser, pass: newPass };
                localStorage.setItem('adminCreds', JSON.stringify(adminCreds));
                alert('Giriş məlumatları uğurla yeniləndi!');
            }
        });
    }

    // 3. Reklamların Siyahısı (CRUD)
    function renderAds() {
        const tbody = document.getElementById('ads-table-body');
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
        const total = ads.length;
        const active = ads.filter(a => a.status === 'active').length;
        const pending = total - active;

        document.getElementById('stat-total-ads').textContent = total;
        document.getElementById('stat-active-ads').textContent = active;
        document.getElementById('stat-pending-ads').textContent = pending;
    }

    // 4. Modal Funksiyaları
    const modal = document.getElementById('ad-modal');
    const adForm = document.getElementById('ad-form');

    document.getElementById('add-ad-btn').addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Yeni Elan';
        adForm.reset();
        document.getElementById('ad-id').value = '';
        modal.style.display = 'flex';
    });

    document.getElementById('cancel-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    adForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('ad-id').value;
        const newAd = {
            id: id ? parseInt(id) : Date.now(),
            title: document.getElementById('ad-title').value,
            price: document.getElementById('ad-price').value,
            image: document.getElementById('ad-image').value,
            status: document.getElementById('ad-status').value
        };

        if (id) {
            ads = ads.map(a => a.id === parseInt(id) ? newAd : a);
        } else {
            ads.push(newAd);
        }

        saveToStorage();
        modal.style.display = 'none';
        renderAds();
        updateStats();
    });

    // Global funksiyalar (Window obyektinə qoşuruq ki, HTML-dən çağıra bilək)
    window.deleteAd = (id) => {
        if (confirm('Bu elanı silmək istədiyinizdən əminsiniz?')) {
            ads = ads.filter(a => a.id !== id);
            saveToStorage();
            renderAds();
            updateStats();
        }
    };

    window.editAd = (id) => {
        const ad = ads.find(a => a.id === id);
        if (ad) {
            document.getElementById('modal-title').textContent = 'Elanı Redaktə Et';
            document.getElementById('ad-id').value = ad.id;
            document.getElementById('ad-title').value = ad.title;
            document.getElementById('ad-price').value = ad.price;
            document.getElementById('ad-image').value = ad.image;
            document.getElementById('ad-status').value = ad.status;
            modal.style.display = 'flex';
        }
    };

    function saveToStorage() {
        localStorage.setItem('ads', JSON.stringify(ads));
    }
});
