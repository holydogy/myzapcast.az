// Səhifə yükləndikdən sonra işləyəcək kodlar
document.addEventListener('DOMContentLoaded', () => {

    // 0. Hero Reveal Animations (Başlıq və Axtarışın altdan yuxarı gəlməsi)
    const heroItems = document.querySelectorAll('.hero-reveal-item');
    setTimeout(() => {
        heroItems.forEach(item => {
            item.classList.add('revealed');
        });
    }, 100);

    // 1. Scroll Parallax (Bloblar və Hero üçün)
    const blobs = document.querySelectorAll('.parallax-blob');
    const heroContainer = document.querySelector('.hero-reveal-container');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Blobların hərəkəti
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.1;
            blob.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Hero mətninin solğunlaşması və yavaşca yuxarı qalxması
        if (heroContainer) {
            heroContainer.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContainer.style.opacity = 1 - (scrolled / 700);
        }
    });

    // 2. Mouse Parallax (Kartlar üçün 3D Effekt)
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
        });
    });

    // 3. Scroll Reveal (Elanların çıxması)
    const revealElements = document.querySelectorAll('.product-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Zəng Et düyməsi
    const callBtns = document.querySelectorAll('.btn-call-cirle');
    callBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Satıcı ilə əlaqə yaradılır: +994 50 123 45 67');
        });
    });

    // 5. Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

});
