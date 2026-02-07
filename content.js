
// Unique identifier for the search bar the user explicitly selected
let userPreferredSelector = null;

// Load preference on start
const hostname = window.location.hostname;
chrome.storage.local.get([hostname], (result) => {
    if (result[hostname]) {
        userPreferredSelector = result[hostname];
    }
});

// Listen for updates from popup
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes[hostname]) {
        userPreferredSelector = changes[hostname].newValue;
    }
});

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
        const hasSearchId = id.includes('search') || id.includes('query') || id.includes('header-primary');
        const hasSearchPlaceholder = placeholder.includes('search') || placeholder.includes('find') || placeholder.includes('ask');
        const hasSearchAria = ariaLabel.includes('search');
        const hasSearchClass = classList.includes('search') || classList.includes('header-search');

        return hasSearchName || hasSearchId || hasSearchPlaceholder || hasSearchAria || hasSearchClass;
    });
}

// Generate a CSS selector for an element to save/load preference
function generateSelector(el) {
    if (el.id) return `#${CSS.escape(el.id)}`;
    if (el.name) return `${el.tagName.toLowerCase()}[name="${CSS.escape(el.name)}"]`;
    if (el.placeholder) return `${el.tagName.toLowerCase()}[placeholder="${CSS.escape(el.placeholder)}"]`;
    if (el.className) {
         return `${el.tagName.toLowerCase()}.${Array.from(el.classList).map(c => CSS.escape(c)).join('.')}`;
    }
    return el.tagName.toLowerCase();
}

function focusSearchBar() {
    let target = null;
    const candidates = getSearchInputs();

    if (candidates.length === 0) return;

    // 1. Try User Preference
    if (userPreferredSelector) {
        try {
            target = document.querySelector(userPreferredSelector);
        } catch (e) {
            console.error('Invalid selector stored', e);
        }
    }

    // 2. If preference not found or invalid, use best heuristic
    if (!target || !candidates.includes(target)) {
        // Sort candidates? For now just pick the first one which is usually the top of the page
        target = candidates[0];
    }

    if (target) {
        target.focus();
        target.select();
        // Scroll into view if needed
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Handle Key Press
document.addEventListener('keydown', (e) => {
    // Check if user is already in an input
    const active = document.activeElement;
    const isInput = active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable;
    
    // Allow '/' if strict modifiers are not held (like cmd or ctrl)
    // But if we are in an input, we only want to ignore if it's a typing character.
    // If it's a global shortcuts, usually extensions avoid triggering when typing.
    
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (isInput) return; // Don't interfere with typing '/' in a text box
        
        e.preventDefault(); // Stop '/' from being typed if we focus something
        focusSearchBar();
    }
});

// Handle Messages from Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSearchBars') {
        const inputs = getSearchInputs();
        const data = inputs.map((input, index) => {
            const selector = generateSelector(input);
            const label = input.placeholder || input.name || input.id || `Search Bar ${index + 1}`;
            // Check if this input attempts to match the user preference
            let isSelected = false;
            if (userPreferredSelector) {
                // Determine if this element matches the preferred selector
                // Note: strict equality check on selector string is fragile if generators change, 
                // but checking if document.querySelector(pref) === input is better.
                try {
                     const preferredEl = document.querySelector(userPreferredSelector);
                     isSelected = (preferredEl === input);
                } catch(e) {}
            }
            
            return {
                selector: selector,
                label: label.substring(0, 30) + (label.length > 30 ? '...' : ''),
                isSelected: isSelected,
                index: index
            };
        });
        sendResponse({ searchBars: data });
    } else if (request.action === 'highlight') {
        // Optional: Highlight element when hovering in popup
        const inputs = getSearchInputs();
        const target = inputs[request.index];
        if (target) {
            target.style.outline = '3px solid red';
            setTimeout(() => target.style.outline = '', 1000);
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});
