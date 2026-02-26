// Səhifə yükləndikdən sonra işləyəcək kodlar
document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. Header & Auth Logic
     */
    const syncHeader = () => {
        const authContainer = document.getElementById('header-auth');
        if (!authContainer) return;

        try {
            const userJson = localStorage.getItem('currentUser');
            const user = userJson ? JSON.parse(userJson) : null;

            if (user && user.name) {
                authContainer.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span style="font-weight: 800; color: var(--text-main); font-size: 0.9rem;">${user.name}</span>
                        <button id="logout-btn" style="background: #f1f5f9; border: none; padding: 0.6rem 1.2rem; border-radius: var(--radius-full); font-weight: 700; cursor: pointer;">Çıxış</button>
                    </div>
                `;
                document.getElementById('logout-btn').addEventListener('click', () => {
                    localStorage.removeItem('currentUser');
                    location.reload();
                });
            }
        } catch (e) {
            console.error("Header sync error:", e);
        }
    };

    /**
     * 2. Elanların Göstərilməsi (Render Ads)
     */
    const renderAds = (filter = null) => {
        const container = document.getElementById('ads-container');
        if (!container) return;

        // Elanları yükləyirik
        let ads = [];
        try {
            const stored = localStorage.getItem('ads');
            ads = stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Ads loading error:", e);
            ads = [];
        }

        // Əgər boşdursa default elanlar
        if (!ads || ads.length === 0) {
            ads = [
                { id: 1, title: 'BMW E60 Mühərrik Yastığı (OEM)', price: 150, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=500&auto=format&fit=crop', status: 'active', make: 'BMW', model: 'E60' },
                { id: 2, title: 'Mercedes W211 Ön Bufer (Meyle)', price: 350, image: 'https://images.unsplash.com/photo-1600320254378-01e4a2dc98cc?w=500&auto=format&fit=crop', status: 'active', make: 'Mercedes', model: 'W211' },
                { id: 3, title: 'Audi A6 Faralar (LED Matrix)', price: 4200, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&auto=format&fit=crop', status: 'active', make: 'Audi', model: 'A6' },
                { id: 4, title: 'Toyota Prado Su Pompası', price: 185, image: 'https://images.unsplash.com/photo-1511407397940-d57f68e81203?w=500&auto=format&fit=crop', status: 'active', make: 'Toyota', model: 'Prado' }
            ];
            localStorage.setItem('ads', JSON.stringify(ads));
        }

        // Filtrləmə
        let list = ads.filter(a => a.status === 'active');

        if (filter) {
            const { q, make, model, price } = filter;
            if (q) list = list.filter(a => a.title.toLowerCase().includes(q.toLowerCase()));
            if (make) list = list.filter(a => a.make && a.make.toLowerCase() === make.toLowerCase());
            if (model) list = list.filter(a => a.model && a.model.toLowerCase().includes(model.toLowerCase()));
            if (price) list = list.filter(a => Number(a.price) <= Number(price));
        }

        // Təmizləyirik və yazırıq
        container.innerHTML = '';

        if (list.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted); font-weight: 600;">Heç bir elan tapılmadı.</p>';
            return;
        }

        [...list].reverse().forEach(ad => {
            const card = `
                <article class="product-card">
                    <div class="product-img-wrapper">
                        <img src="${ad.image || 'https://placehold.co/400x300?text=Şəkil+Yoxdur'}" alt="${ad.title}" class="product-img" onerror="this.src='https://placehold.co/400x300?text=Şəkil+Yoxdur'">
                    </div>
                    <div>
                        <div class="product-price">${ad.price} ₼</div>
                        <h3 class="product-name">${ad.title}</h3>
                        <div class="product-footer">
                            <span class="loc"><i class="fa-solid fa-location-dot"></i> Bakı, bugün</span>
                            <button class="btn-call-circle"><i class="fa-solid fa-phone"></i></button>
                        </div>
                    </div>
                </article>
            `;
            container.insertAdjacentHTML('beforeend', card);
        });
    };

    /**
     * 3. Axtarış düyməsi və hadisələr
     */
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const filter = {
                q: document.getElementById('search-input')?.value || '',
                make: document.getElementById('filter-make')?.value || '',
                model: document.getElementById('filter-model')?.value || '',
                price: document.getElementById('filter-price')?.value || ''
            };
            renderAds(filter);
            // Aşağıya sürüşdür
            document.querySelector('.ads-section')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // İlk yüklənmə
    syncHeader();
    renderAds();
});
