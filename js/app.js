document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const articleCards = document.querySelectorAll('.card');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        articleCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.card-excerpt').textContent.toLowerCase();
            const category = card.querySelector('.category-tag').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});
