import { API_URL } from './apiConfig';
import type { Ad, User, AdminUser } from './types';

// LocalStorage-da məlumatları saxlayırıq
let ads: Ad[] = JSON.parse(localStorage.getItem('ads') || '[]') || [
    { id: 1, title: 'BMW E60 Mühərrik Yastığı', price: 150, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
    { id: 2, title: 'Mercedes W211 Ön Bufer', price: 350, image: 'https://images.unsplash.com/photo-1600320254378-01e4a2dc98cc?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' }
];

let users: User[] = JSON.parse(localStorage.getItem('users') || '[]') || [];

// Admin siyahısını idarə edirik
let admins: AdminUser[] = JSON.parse(localStorage.getItem('allAdmins') || '[]') || [
    { user: 'admin', pass: 'toghruladmin123' }
];

document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const adminLayout = document.getElementById('admin-layout');
    const loginForm = document.getElementById('login-form') as HTMLFormElement | null;
    const logoutBtn = document.getElementById('logout-btn');

    // Modal elements
    const adModal = document.getElementById('ad-modal');
    const adForm = document.getElementById('ad-form') as HTMLFormElement | null;
    const addAdBtn = document.getElementById('add-ad-btn');
    const cancelModal = document.getElementById('cancel-modal');
    const modalTitle = document.getElementById('modal-title');

    // Admin Giriş Formu
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = (document.getElementById('admin-user') as HTMLInputElement).value;
            const pass = (document.getElementById('admin-pass') as HTMLInputElement).value;

            try {
                // Try API login first
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user, password: pass })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('isAdminLoggedIn', 'true');
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    showAdminPanel();
                    return;
                }
            } catch (err) {
                console.warn('API login failed, falling back to local check:', err);
            }

            // İstənilən admın ilə giriş yoxlanılır
            const foundAdmin = admins.find(a => a.user === user && a.pass === pass);

            if (foundAdmin) {
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
            if (modalTitle) modalTitle.textContent = 'Yeni Elan';
            adForm?.reset();
            (document.getElementById('ad-id') as HTMLInputElement).value = '';
            if (adModal) adModal.style.display = 'flex';
        });
    }

    if (cancelModal) {
        cancelModal.addEventListener('click', () => {
            if (adModal) adModal.style.display = 'none';
        });
    }

    // Save Ad (Add or Edit)
    if (adForm) {
        adForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = (document.getElementById('ad-id') as HTMLInputElement).value;
            const title = (document.getElementById('ad-title') as HTMLInputElement).value;
            const price = (document.getElementById('ad-price') as HTMLInputElement).value;
            const image = (document.getElementById('ad-image') as HTMLInputElement).value;
            const status = (document.getElementById('ad-status') as HTMLSelectElement).value as Ad['status'];

            if (id) {
                // Edit existing
                const index = ads.findIndex(a => a.id == Number(id));
                if (index !== -1) {
                    ads[index] = { ...ads[index], title, price, image, status };
                }
            } else {
                // Add new
                const newAd: Ad = {
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
            if (adModal) adModal.style.display = 'none';
        });
    }

    // Add Admin Button
    const addAdminBtn = document.getElementById('add-admin-btn');
    if (addAdminBtn) {
        addAdminBtn.addEventListener('click', () => {
            const newUser = prompt('Yeni adminin istifadəçi adı:');
            const newPass = prompt('Yeni adminin şifrəsi:');

            if (newUser && newPass) {
                admins.push({ user: newUser, pass: newPass });
                localStorage.setItem('allAdmins', JSON.stringify(admins));
                renderAdmins();
            }
        });
    }

    // Settings Submit
    const settingsForm = document.getElementById('settings-form') as HTMLFormElement | null;
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newUser = (document.getElementById('new-admin-user') as HTMLInputElement).value;
            const newPass = (document.getElementById('new-admin-pass') as HTMLInputElement).value;

            admins[0] = { user: newUser, pass: newPass };
            localStorage.setItem('allAdmins', JSON.stringify(admins));
            alert('Admin məlumatları yeniləndi!');
            renderAdmins();
        });
    }

    // Əgər admin daxil olubsa
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        showAdminPanel();
    }

    function showAdminPanel() {
        if (loginSection) loginSection.style.display = 'none';
        if (adminLayout) adminLayout.style.display = 'flex';

        users = JSON.parse(localStorage.getItem('users') || '[]') || [];
        ads = JSON.parse(localStorage.getItem('ads') || '[]') || [];
        admins = JSON.parse(localStorage.getItem('allAdmins') || '[]') || admins;

        updateStats();
        renderAds();
        renderUsers();
        renderAdmins();
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

                const sections = ['dashboard', 'ads', 'users', 'admins', 'categories', 'settings'];
                sections.forEach(s => {
                    const el = document.getElementById(`section-${s}`);
                    if (el) el.style.display = s === section ? 'block' : 'none';
                });

                const pageTitle = document.getElementById('page-title');
                if (pageTitle) {
                    pageTitle.textContent = section === 'dashboard' ? 'Dashboard' :
                        section === 'ads' ? 'Elanlar' :
                            section === 'users' ? 'İstifadəçilər' :
                                section === 'admins' ? 'Adminlər' :
                                    section === 'categories' ? 'Kateqoriyalar' : 'Ayarlar';
                }

                if (localStorage.getItem('isAdminLoggedIn') === 'true') {
                    users = JSON.parse(localStorage.getItem('users') || '[]') || [];
                    ads = JSON.parse(localStorage.getItem('ads') || '[]') || [];
                    renderAds();
                    renderUsers();
                    renderAdmins();
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
                    <button class="btn-action btn-edit" data-id="${ad.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-action btn-delete" data-id="${ad.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Add event listeners to buttons
        tbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (id) (window as any).editAd(Number(id));
            });
        });
        tbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (id) (window as any).deleteAd(Number(id));
            });
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
                        <button class="btn-action btn-toggle-pass" data-id="${user.id}" data-pass="${user.password}" style="padding: 2px 8px; font-size: 12px;">
                            <i class="fa-solid fa-eye" id="pass-icon-${user.id}"></i>
                        </button>
                    </div>
                </td>
                <td class="actions">
                    <button class="btn-action btn-delete-user" data-id="${user.id}"><i class="fa-solid fa-user-slash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-toggle-pass').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const pass = btn.getAttribute('data-pass');
                if (id && pass) (window as any).togglePassDisplay(Number(id), pass);
            });
        });
        tbody.querySelectorAll('.btn-delete-user').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (id) (window as any).deleteUser(Number(id));
            });
        });
    }

    function renderAdmins() {
        const tbody = document.getElementById('admins-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        admins.forEach((admin, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${admin.user}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span id="admin-pass-text-${index}" style="font-family: monospace; letter-spacing: 2px;">••••••••</span>
                        <button class="btn-action btn-toggle-admin-pass" data-index="${index}" data-pass="${admin.pass}" style="padding: 2px 8px; font-size: 12px;">
                            <i class="fa-solid fa-eye" id="admin-pass-icon-${index}"></i>
                        </button>
                    </div>
                </td>
                <td class="actions">
                    <button class="btn-action btn-delete-admin" data-index="${index}" ${index === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-toggle-admin-pass').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.getAttribute('data-index');
                const pass = btn.getAttribute('data-pass');
                if (idx !== null && pass) (window as any).toggleAdminPass(Number(idx), pass);
            });
        });
        tbody.querySelectorAll('.btn-delete-admin').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.getAttribute('data-index');
                if (idx !== null) (window as any).deleteAdmin(Number(idx));
            });
        });
    }

    (window as any).togglePassDisplay = (id: number, actualPass: string) => {
        const span = document.getElementById(`pass-text-${id}`);
        const icon = document.getElementById(`pass-icon-${id}`);
        if (span && icon) {
            if (span.textContent === '••••••••') {
                span.textContent = actualPass;
                span.style.letterSpacing = 'normal';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                span.textContent = '••••••••';
                span.style.letterSpacing = '2px';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        }
    };

    (window as any).toggleAdminPass = (index: number, actualPass: string) => {
        const span = document.getElementById(`admin-pass-text-${index}`);
        const icon = document.getElementById(`admin-pass-icon-${index}`);
        if (span && icon) {
            if (span.textContent === '••••••••') {
                span.textContent = actualPass;
                span.style.letterSpacing = 'normal';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                span.textContent = '••••••••';
                span.style.letterSpacing = '2px';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        }
    };

    (window as any).deleteAdmin = (index: number) => {
        if (index === 0) return; // Ana admin silinə bilməz
        if (confirm('Bu admini silmək istəyirsiniz?')) {
            admins.splice(index, 1);
            localStorage.setItem('allAdmins', JSON.stringify(admins));
            renderAdmins();
        }
    };

    (window as any).editAd = (id: number) => {
        const ad = ads.find(a => a.id == id);
        if (!ad) return;

        if (modalTitle) modalTitle.textContent = 'Elanı Redaktə Et';
        (document.getElementById('ad-id') as HTMLInputElement).value = String(ad.id);
        (document.getElementById('ad-title') as HTMLInputElement).value = ad.title;
        (document.getElementById('ad-price') as HTMLInputElement).value = String(ad.price);
        (document.getElementById('ad-image') as HTMLInputElement).value = ad.image;
        (document.getElementById('ad-status') as HTMLSelectElement).value = ad.status;

        if (adModal) adModal.style.display = 'flex';
    };

    function updateStats() {
        const totalAdsEl = document.getElementById('stat-total-ads');
        const totalUsersEl = document.getElementById('stat-total-users');
        if (!totalAdsEl) return;

        const totalAds = ads.length;
        const activeAds = ads.filter(a => a.status === 'active').length;
        const pendingAds = totalAds - activeAds;
        const totalUsers = users.length;

        totalAdsEl.textContent = String(totalAds);
        if (totalUsersEl) totalUsersEl.textContent = String(totalUsers);
        const activeEl = document.getElementById('stat-active-ads');
        const pendingEl = document.getElementById('stat-pending-ads');
        if (activeEl) activeEl.textContent = String(activeAds);
        if (pendingEl) pendingEl.textContent = String(pendingAds);
    }

    (window as any).deleteAd = (id: number) => {
        if (confirm('Bu elanı silmək istəyirsiniz?')) {
            ads = ads.filter(a => a.id !== id);
            saveToStorage();
            renderAds();
            updateStats();
        }
    };

    (window as any).deleteUser = (id: number) => {
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
