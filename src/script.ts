import type { Ad, User } from './types';

// Translation Data
const translations: Record<string, Record<string, string>> = {
    az: {
        nav_home: "Ana Səhifə",
        nav_parts: "Ehtiyat Hissələri",
        nav_shops: "Mağazalar",
        nav_about: "Haqqımızda",
        auth_login: "Daxil ol",
        auth_register: "Hesab yarat",
        hero_title: "Doğru hissəni, <span>Tapın!</span>",
        hero_subtitle: "Minlərlə ehtiyat hissəsi arasında sizə lazım olanı saniyələr içində kəşf edin.",
        search_placeholder: "Hissə adı və ya kod...",
        make_all: "Marka (Hamısı)",
        model_placeholder: "Model (Məs: F30)",
        price_placeholder: "Maks. Qiymət",
        search_btn: "AXTAR",
        latest_ads: "Son Elanlar",
        see_all: "Hamısına bax",
        logout: "Çıxış",
        cat_parts: "Hissələr",
        cat_shops: "Mağazalar",
        cat_tech: "Texnika",
        cat_tires: "Təkərlər",
        cat_oils: "Yağlar",
        cat_acc: "Aksesuar",
        post_ad: "Elan yerləşdir",
        ad_loc_today: "Bakı, bugün"
    },
    en: {
        nav_home: "Home",
        nav_parts: "Spare Parts",
        nav_shops: "Shops",
        nav_about: "About Us",
        auth_login: "Login",
        auth_register: "Register",
        hero_title: "Find the <span>Right Part!</span>",
        hero_subtitle: "Discover what you need among thousands of spare parts in seconds.",
        search_placeholder: "Part name or code...",
        make_all: "Make (All)",
        model_placeholder: "Model (e.g. F30)",
        price_placeholder: "Max Price",
        search_btn: "SEARCH",
        latest_ads: "Latest Ads",
        see_all: "See all",
        logout: "Logout",
        cat_parts: "Parts",
        cat_shops: "Shops",
        cat_tech: "Tech",
        cat_tires: "Tires",
        cat_oils: "Oils",
        cat_acc: "Accessories",
        post_ad: "Post Ad",
        ad_loc_today: "Baku, today"
    },
    ru: {
        nav_home: "Главная",
        nav_parts: "Запчасти",
        nav_shops: "Магазины",
        nav_about: "О нас",
        auth_login: "Войти",
        auth_register: "Регистрация",
        hero_title: "Найдите <span>нужную деталь!</span>",
        hero_subtitle: "Найдите то, что вам нужно, среди тысяч запчастей за считанные секунды.",
        search_placeholder: "Название или код...",
        make_all: "Марка (Все)",
        model_placeholder: "Модель (напр. F30)",
        price_placeholder: "Макс. цена",
        search_btn: "ПОИСК",
        latest_ads: "Последние объявления",
        see_all: "Посмотреть все",
        logout: "Выход",
        cat_parts: "Запчасти",
        cat_shops: "Магазины",
        cat_tech: "Техника",
        cat_tires: "Шины",
        cat_oils: "Масла",
        cat_acc: "Аксессуары",
        post_ad: "Подать объявление",
        ad_loc_today: "Баку, сегодня"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initial values
    let currentLang = localStorage.getItem('language') || 'az';

    /**
     * 1. Header & Auth Logic
     */
    const syncHeader = (): void => {
        const authContainer = document.getElementById('header-auth');
        if (!authContainer) return;

        try {
            const userJson = localStorage.getItem('currentUser');
            const user: User | null = userJson ? JSON.parse(userJson) : null;

            if (user && user.name) {
                const logoutText = translations[currentLang]?.logout || "Çıxış";
                authContainer.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span style="font-weight: 800; color: var(--text-main); font-size: 0.9rem;">${user.name}</span>
                        <button id="logout-btn" style="background: var(--bg-soft); border: none; padding: 0.6rem 1.2rem; border-radius: var(--radius-full); font-weight: 700; cursor: pointer; color: var(--text-main);">${logoutText}</button>
                    </div>
                `;
                const logoutBtn = document.getElementById('logout-btn');
                logoutBtn?.addEventListener('click', () => {
                    localStorage.removeItem('currentUser');
                    location.reload();
                });
            }
        } catch (e) {
            console.error("Header sync error:", e);
        }
    };

    /**
     * 2. Render Ads
     */
    const renderAds = (filter: { q?: string; make?: string; model?: string; price?: string | number } | null = null): void => {
        const container = document.getElementById('ads-container');
        if (!container) return;

        let ads: Ad[] = [];
        try {
            const stored = localStorage.getItem('ads');
            ads = stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Ads loading error:", e);
            ads = [];
        }

        if (!ads || ads.length === 0) {
            ads = [
                { id: 1, title: 'BMW E60 Mühərrik Yastığı (OEM)', price: 150, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=500&auto=format&fit=crop', status: 'active', make: 'BMW', model: 'E60', category: 'parts' },
                { id: 2, title: 'Mercedes W211 Ön Bufer (Meyle)', price: 350, image: 'https://images.unsplash.com/photo-1600320254378-01e4a2dc98cc?w=500&auto=format&fit=crop', status: 'active', make: 'Mercedes', model: 'W211', category: 'parts' },
                { id: 3, title: 'Audi A6 Faralar (LED Matrix)', price: 4200, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&auto=format&fit=crop', status: 'active', make: 'Audi', model: 'A6', category: 'parts' },
                { id: 4, title: 'Toyota Prado Su Pompası', price: 185, image: 'https://images.unsplash.com/photo-1511407397940-d57f68e81203?w=500&auto=format&fit=crop', status: 'active', make: 'Toyota', model: 'Prado', category: 'parts' }
            ];
            localStorage.setItem('ads', JSON.stringify(ads));
        }

        let list = ads.filter(a => a.status === 'active');

        if (filter) {
            const { q, make, model, price } = filter;
            if (q) list = list.filter(a => a.title.toLowerCase().includes(q.toLowerCase()));
            if (make) list = list.filter(a => a.make && a.make.toLowerCase() === make.toLowerCase());
            if (model) list = list.filter(a => a.model && a.model.toLowerCase().includes(model.toLowerCase()));
            if (price) list = list.filter(a => Number(a.price) <= Number(price));
        }

        container.innerHTML = '';

        if (list.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted); font-weight: 600;">Heç bir elan tapılmadı.</p>';
            return;
        }

        [...list].reverse().forEach(ad => {
            const locText = translations[currentLang]?.ad_loc_today || "Bakı, bugün";
            const card = `
                <article class="product-card">
                    <div class="product-img-wrapper">
                        <img src="${ad.image || 'https://placehold.co/400x300?text=Şəkil+Yoxdur'}" alt="${ad.title}" class="product-img" onerror="this.src='https://placehold.co/400x300?text=Şəkil+Yoxdur'">
                    </div>
                    <div>
                        <div class="product-price">${ad.price} ₼</div>
                        <h3 class="product-name">${ad.title}</h3>
                        <div class="product-footer">
                            <span class="loc"><i class="fa-solid fa-location-dot"></i> ${locText}</span>
                            <button class="btn-call-circle"><i class="fa-solid fa-phone"></i></button>
                        </div>
                    </div>
                </article>
            `;
            container.insertAdjacentHTML('beforeend', card);
        });
    };

    /**
     * 3. Dark Mode Logic
     */
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const icon = darkModeToggle?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    darkModeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const enabled = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');

        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            if (enabled) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    });

    /**
     * Search Condition Toggle
     */
    const condBtns = document.querySelectorAll('.cond-btn');
    condBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            condBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    /**
     * 4. Language Switcher Logic
     */
    const langSwitcher = document.getElementById('lang-switcher');
    const langDropdown = document.getElementById('lang-dropdown');
    const currentLangText = document.getElementById('current-lang');

    const updateLanguage = (lang: string) => {
        const validLang = translations[lang] ? lang : 'az';
        currentLang = validLang;
        localStorage.setItem('language', validLang);
        if (currentLangText) currentLangText.textContent = validLang.toUpperCase();

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key && translations[validLang] && translations[validLang][key]) {
                el.innerHTML = translations[validLang][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key && translations[validLang] && translations[validLang][key]) {
                (el as HTMLInputElement).placeholder = translations[validLang][key];
            }
        });

        langDropdown?.classList.remove('active');
        renderAds();
        syncHeader();
    };

    langSwitcher?.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown?.classList.toggle('active');
    });

    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang) updateLanguage(lang);
        });
    });

    document.addEventListener('click', () => {
        langDropdown?.classList.remove('active');
    });

    /**
     * 5. Mobile Menu Logic
     */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    const toggleSidebar = () => {
        mobileSidebar?.classList.toggle('active');
        sidebarOverlay?.classList.toggle('active');
        document.body.style.overflow = mobileSidebar?.classList.contains('active') ? 'hidden' : '';
    };

    [mobileMenuBtn, sidebarClose, sidebarOverlay].forEach(el => {
        el?.addEventListener('click', toggleSidebar);
    });

    /**
     * 6. Search Logic
     */
    const searchBtn = document.getElementById('search-btn') as HTMLButtonElement | null;
    const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
    const filterMake = document.getElementById('filter-make') as HTMLSelectElement | null;
    const filterModel = document.getElementById('filter-model') as HTMLInputElement | null;
    const filterPrice = document.getElementById('filter-price') as HTMLInputElement | null;

    const handleSearch = () => {
        const filter = {
            q: searchInput?.value.trim() || '',
            make: filterMake?.value.trim() || '',
            model: filterModel?.value.trim() || '',
            price: filterPrice?.value.trim() || ''
        };

        renderAds(filter);

        const resultsHeader = document.querySelector('.section-header');
        if (resultsHeader) {
            resultsHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    [searchInput, filterModel, filterPrice].forEach(input => {
        input?.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') handleSearch();
        });
    });

    // Initialize Page
    updateLanguage(currentLang);
});
