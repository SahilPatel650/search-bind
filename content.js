document.addEventListener('keydown', (e) => {
    // Check if user is already in an input
    const active = document.activeElement;
    const isInput = active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable;

    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (isInput) return;
        
        // Simple heuristic: First search input
        const searchInput = document.querySelector('input[type="search"], input[name="search"], input[name="q"]');
        
        if (searchInput) {
            e.preventDefault(); 
            searchInput.focus();
        }
    }
});
