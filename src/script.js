document.addEventListener('DOMContentLoaded', () => {

    // 1. Auth & Header state
    const updateHeaderAuth = () => {
        const headerAuth = document.getElementById('header-auth');
        const mobileProfileLink = document.getElementById('mobile-profile-link');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser && headerAuth) {
            headerAuth.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; font-weight: 700;">
                    <span style="color: var(--text-main); font-size: 0.9rem;">${currentUser.name}</span>
                    <button id="logout-btn" style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">Çıxış</button>
                </div>
            `;

            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.reload();
            });

            if (mobileProfileLink) {
                mobileProfileLink.innerHTML = `<i class="fa-solid fa-user-circle" style="color: var(--primary);"></i><span>Profil</span>`;
                mobileProfileLink.href = "/profile.html"; // Or any other profile page
            }
        }
    };

    updateHeaderAuth();

    // 2. Render Ads
    const renderAds = () => {
        const adsContainer = document.getElementById('ads-container');
        if (!adsContainer) return;

        let ads = JSON.parse(localStorage.getItem('ads')) || [];

        // If no ads, show some defaults so it looks good
        if (ads.length === 0) {
            ads = [
                { id: 1, title: 'BMW E60 Mühərrik Yastığı (M-Tech)', price: 150, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=500&auto=format&fit=crop', status: 'active' },
                { id: 2, title: 'Mercedes W211 Ön Bufer (Yeni)', price: 350, image: 'https://images.unsplash.com/photo-1600320254378-01e4a2dc98cc?w=500&auto=format&fit=crop', status: 'active' },
                { id: 3, title: 'Mercedes W222 Multi-Beam LED Faralar', price: 7980, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&auto=format&fit=crop', status: 'active' },
                { id: 4, title: 'Toyota Land Cruiser Su Nasosu (OEM)', price: 3550, image: 'https://images.unsplash.com/photo-1511407397940-d57f68e81203?w=500&auto=format&fit=crop', status: 'active' }
            ];
            localStorage.setItem('ads', JSON.stringify(ads));
        }

        adsContainer.innerHTML = '';

        const activeAds = ads.filter(a => a.status === 'active');

        if (activeAds.length === 0) {
            adsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">Hazırda heç bir elan tapılmadı.</p>';
            return;
        }

        // Show newest ads first
        [...activeAds].reverse().forEach(ad => {
            const adHTML = `
                <article class="ad-card">
                    <div class="ad-image-wrapper">
                        <img src="${ad.image || 'https://placehold.co/400x300?text=Şəkil+Yoxdur'}" alt="${ad.title}" class="ad-image" onerror="this.src='https://placehold.co/400x300?text=Şəkil+Yoxdur'">
                        <div class="ad-price">${ad.price} ₼</div>
                    </div>
                    <div class="ad-content">
                        <h3 class="ad-title">${ad.title}</h3>
                        <div class="ad-footer">
                            <span><i class="fa-solid fa-location-dot"></i> Bakı</span>
                            <button class="btn-contact"><i class="fa-solid fa-phone"></i></button>
                        </div>
                    </div>
                </article>
            `;
            adsContainer.insertAdjacentHTML('beforeend', adHTML);
        });
    };

    renderAds();

    // 3. Search functionality (Simple filter for demo)
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.btn-search');

    const handleSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            renderAds();
            return;
        }

        const ads = JSON.parse(localStorage.getItem('ads')) || [];
        const filtered = ads.filter(ad =>
            ad.status === 'active' &&
            (ad.title.toLowerCase().includes(query) || (ad.category && ad.category.toLowerCase().includes(query)))
        );

        const adsContainer = document.getElementById('ads-container');
        adsContainer.innerHTML = '';

        if (filtered.length === 0) {
            adsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">Axtarışa uyğun nəticə tapılmadı.</p>';
        } else {
            [...filtered].reverse().forEach(ad => {
                // ... same adHTML as above (could be refactored) ...
                const adHTML = `
                    <article class="ad-card">
                        <div class="ad-image-wrapper">
                            <img src="${ad.image || ''}" alt="${ad.title}" class="ad-image" onerror="this.src='https://placehold.co/400x300?text=Şəkil+Yoxdur'">
                            <div class="ad-price">${ad.price} ₼</div>
                        </div>
                        <div class="ad-content">
                            <h3 class="ad-title">${ad.title}</h3>
                            <div class="ad-footer">
                                <span><i class="fa-solid fa-location-dot"></i> Bakı</span>
                                <button class="btn-contact"><i class="fa-solid fa-phone"></i></button>
                            </div>
                        </div>
                    </article>
                `;
                adsContainer.insertAdjacentHTML('beforeend', adHTML);
            });
        }
    };

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

});
