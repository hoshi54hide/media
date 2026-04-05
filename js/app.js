document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const articleGrid = document.getElementById('articleGrid');
    
    if (searchInput && articleGrid) {
        const articleCards = articleGrid.querySelectorAll('.card');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            articleCards.forEach(card => {
                const titleEl = card.querySelector('.card-title');
                const excerptEl = card.querySelector('.card-excerpt');
                const categoryEl = card.querySelector('.category-tag');
                
                if (!titleEl || !excerptEl || !categoryEl) return;
                
                const title = titleEl.textContent.toLowerCase();
                const excerpt = excerptEl.textContent.toLowerCase();
                const category = categoryEl.textContent.toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Reading Progress Bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;
            const scrolledHeight = window.scrollY;
            const percentage = (scrolledHeight / (fullHeight - windowHeight)) * 100;
            progressBar.style.width = percentage + '%';
        });
    }

    // Copy to Clipboard logic for Prompt Boxes
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetText = btn.parentElement.innerText.replace('コピー', '').trim();
            navigator.clipboard.writeText(targetText).then(() => {
                const originalText = btn.innerText;
                btn.innerText = 'コピーしました！';
                btn.style.background = '#10b981'; // Success green
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = ''; // Revert to primary
                }, 2000);
            });
        });
    });
});
