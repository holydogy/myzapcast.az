// Səhifə yükləndikdən sonra işləyəcək kodlar
document.addEventListener('DOMContentLoaded', () => {

    // 1. Auth & Header state
    const updateHeaderAuth = () => {
        const headerAuth = document.getElementById('header-auth');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser && headerAuth) {
            headerAuth.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-weight: 800; color: var(--text-main); font-size: 0.95rem;">${currentUser.name}</span>
                    <button id="logout-btn" style="background: #f1f5f9; border: none; padding: 0.6rem 1.2rem; border-radius: var(--radius-full); font-weight: 700; cursor: pointer; color: var(--text-main); transition: var(--transition);">Çıxış</button>
                </div>
            `;

            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        }
    };

    updateHeaderAuth();

    // 2. Render Ads
    const renderAds = (filterData = null) => {
        const adsContainer = document.getElementById('ads-container');
        if (!adsContainer) return;

        let ads = JSON.parse(localStorage.getItem('ads')) || [];

        // If no ads in storage, load defaults
        if (ads.length === 0) {
            ads = [
                { id: 1, title: 'BMW E60 Mühərrik Yastığı (M-Tech)', price: 150, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=500&auto=format&fit=crop', status: 'active', make: 'BMW', model: 'E60' },
                { id: 2, title: 'Mercedes W211 Ön Bufer (Yeni)', price: 350, image: 'https://images.unsplash.com/photo-1600320254378-01e4a2dc98cc?w=500&auto=format&fit=crop', status: 'active', make: 'Mercedes', model: 'W211' },
                { id: 3, title: 'Mercedes W222 Multi-Beam LED Faralar', price: 7980, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&auto=format&fit=crop', status: 'active', make: 'Mercedes', model: 'W222' },
                { id: 4, title: 'Toyota Land Cruiser Su Nasosu (OEM)', price: 3550, image: 'https://images.unsplash.com/photo-1511407397940-d57f68e81203?w=500&auto=format&fit=crop', status: 'active', make: 'Toyota', model: 'Land Cruiser' }
            ];
            localStorage.setItem('ads', JSON.stringify(ads));
        }

        let filteredAds = ads.filter(a => a.status === 'active');

        // Apply filters if provided
        if (filterData) {
            const { query, make, model, maxPrice } = filterData;

            filteredAds = filteredAds.filter(ad => {
                const matchesQuery = !query || ad.title.toLowerCase().includes(query.toLowerCase());
                const matchesMake = !make || (ad.make && ad.make.toLowerCase() === make.toLowerCase());
                const matchesModel = !model || (ad.model && ad.model.toLowerCase().includes(model.toLowerCase()));
                const matchesPrice = !maxPrice || Number(ad.price) <= Number(maxPrice);

                return matchesQuery && matchesMake && matchesModel && matchesPrice;
            });
        }

        adsContainer.innerHTML = '';

        if (filteredAds.length === 0) {
            adsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted); font-weight: 600;">Axtarışa uyğun elan tapılmadı.</p>';
            return;
        }

        // Show newest first
        [...filteredAds].reverse().forEach(ad => {
            const adHTML = `
                <article class="product-card">
                    <div class="product-img-wrapper">
                        <img src="${ad.image || ''}" alt="${ad.title}" class="product-img" onerror="this.src='https://placehold.co/400x300?text=Şəkil+Yoxdur'">
                    </div>
                    <div class="product-info-box">
                        <div class="product-price">${ad.price} ₼</div>
                        <h3 class="product-name">${ad.title}</h3>
                        <div class="product-footer">
                            <span class="loc"><i class="fa-solid fa-location-dot"></i> Bakı, bugün</span>
                            <button class="btn-call-circle">
                                <i class="fa-solid fa-phone"></i>
                            </button>
                        </div>
                    </div>
                </article>
            `;
            adsContainer.insertAdjacentHTML('beforeend', adHTML);
        });
    };

    renderAds();

    // 3. Search & Filters Logic
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const filterMake = document.getElementById('filter-make');
    const filterModel = document.getElementById('filter-model');
    const filterPrice = document.getElementById('filter-price');

    const handleSearch = () => {
        const filterData = {
            query: searchInput.value.trim(),
            make: filterMake.value,
            model: filterModel.value.trim(),
            maxPrice: filterPrice.value
        };
        renderAds(filterData);

        // Scroll to results
        const adsGrid = document.querySelector('.ads-section');
        if (adsGrid) {
            adsGrid.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);

    // Enter key support for all inputs
    [searchInput, filterModel, filterPrice].forEach(el => {
        if (el) el.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    });

});
