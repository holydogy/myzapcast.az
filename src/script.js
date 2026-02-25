// Səhifə yükləndikdən sonra işləyəcək kodlar
document.addEventListener('DOMContentLoaded', () => {

    // 0. LocalStorage-dan elanları yükləyib göstərmək (Admin panel ilə sinxronizasiya)
    const renderAds = () => {
        const adsContainer = document.querySelector('.ads-grid');
        if (!adsContainer) return;

        // Bazarımızda olan elanları alırıq (yoxdursa default olaraq boş massiv)
        const storedAds = JSON.parse(localStorage.getItem('ads')) || [];

        // Əgər yeni elanlar varsa, onları göstəririk
        if (storedAds.length > 0) {
            // Əvvəlki nümunələri tam silmirik ki, sayt boş görünməsin, 
            // Amma real datanı əvvələ əlavə edirik
            storedAds.reverse().forEach(ad => {
                const adHTML = `
                    <article class="product-card">
                        <div class="product-img-wrapper">
                            <img src="${ad.image || 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=400&h=300&auto=format&fit=crop'}" 
                                 alt="${ad.title}" class="product-img">
                        </div>
                        <div class="product-info">
                            <div class="product-price">${ad.price} ₼</div>
                            <h3 class="product-name">${ad.title}</h3>
                            <div class="product-footer">
                                <span class="loc">Bakı, bugün</span>
                                <button class="btn-call-cirle">
                                    <i class="fa-solid fa-phone"></i>
                                </button>
                            </div>
                        </div>
                    </article>
                `;
                adsContainer.insertAdjacentHTML('afterbegin', adHTML);
            });
        }
    };

    renderAds();

    // 1. Hero Reveal Animations
    const heroItems = document.querySelectorAll('.hero-reveal-item');
    setTimeout(() => {
        heroItems.forEach(item => {
            item.classList.add('revealed');
        });
    }, 100);

    // 2. Scroll Parallax
    const blobs = document.querySelectorAll('.parallax-blob');
    const heroContainer = document.querySelector('.hero-reveal-container');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.1;
            blob.style.transform = `translateY(${scrolled * speed}px)`;
        });

        if (heroContainer) {
            heroContainer.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContainer.style.opacity = 1 - (scrolled / 700);
        }
    });

    // 3. Mouse Parallax (Kartlar üçün 3D Effekt)
    // Dinamik əlavə olunan kartlar üçün event delegation istifadə edirik
    document.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    document.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.product-card');
        if (card) {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
        }
    });

    // 4. Scroll Reveal
    const revealElements = document.querySelectorAll('.product-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Zəng Et düyməsi
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-call-cirle')) {
            e.preventDefault();
            alert('Satıcı ilə əlaqə yaradılır: +994 50 123 45 67');
        }
    });

    // 6. Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

});
