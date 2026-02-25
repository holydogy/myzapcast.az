// Səhifə yükləndikdən sonra işləyəcək kodlar
document.addEventListener('DOMContentLoaded', () => {

    // 1. Zəng Et Düyməsinin funksionallığı
    const callButtons = document.querySelectorAll('.btn-call');

    callButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Düymənin səhifəni yeniləməsinin qarşısını alırıq

            // Düymənin aid olduğu kartı tapırıq
            const card = e.target.closest('.ad-card');

            if (card) {
                // Həmin kartın məlumatlarını alırıq
                const adTitle = card.querySelector('.ad-title').textContent.trim();

                // İçərisində istifadəçi (fa-user) ikonu olan .ad-detail elementini tapırıq
                const userDetail = Array.from(card.querySelectorAll('.ad-detail')).find(
                    el => el.querySelector('.fa-user')
                );
                const sellerName = userDetail ? userDetail.textContent.trim() : 'Satıcı';

                // Xəbərdarlıq pəncərəsi (Alert) göstəririk
                alert(`Siz "${adTitle}" elanı üçün ${sellerName} ilə əlaqə saxlayırsınız.\n\nTelefon nömrəsi nümayiş etdirilir: +994 50 XXX XX XX`);
            }
        });
    });

    // 2. Axtarış ikonu üçün fokuslama (Mobil cihazlarda toxunduqda rahat olması üçün)
    const searchWrapper = document.querySelector('.search-wrapper');
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');

    if (searchWrapper && searchInput && searchIcon) {
        searchIcon.addEventListener('click', () => {
            searchInput.focus();
        });
    }

});
