function isVisible(elem) {
    if (!elem) return false;
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
}

function getSearchInputs() {
    const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea'));
    
    return inputs.filter(input => {
        if (!isVisible(input) || input.disabled || input.readOnly) return false;

        const type = (input.type || '').toLowerCase();
        const name = (input.name || '').toLowerCase();
        const id = (input.id || '').toLowerCase();
        const placeholder = (input.placeholder || '').toLowerCase();
        const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
        const classList = (input.className || '').toLowerCase();
        const role = (input.getAttribute('role') || '').toLowerCase();

        // Strong signals
        if (type === 'search') return true;
        if (role === 'searchbox') return true;
        
        // Naming signals
        const searchTerms = ['search', 'query', 'find', 'q', 'k', 'keyword'];
        const hasSearchName = searchTerms.some(term => name === term || name.includes('search'));
        const hasSearchId = id.includes('search') || id.includes('query');
        const hasSearchPlaceholder = placeholder.includes('search') || placeholder.includes('find') || placeholder.includes('ask');
        const hasSearchAria = ariaLabel.includes('search');
        const hasSearchClass = classList.includes('search');

        return hasSearchName || hasSearchId || hasSearchPlaceholder || hasSearchAria || hasSearchClass;
    });
}

function focusSearchBar() {
    const candidates = getSearchInputs();
    if (candidates.length > 0) {
        // Default to first one
        candidates[0].focus();
        candidates[0].select();
        candidates[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

document.addEventListener('keydown', (e) => {
    // Check if user is already in an input
    const active = document.activeElement;
    const isInput = active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable;

    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (isInput) return;
        
        e.preventDefault();
        focusSearchBar();
    }
});
