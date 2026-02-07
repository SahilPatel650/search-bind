document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('search-list');
  const status = document.createElement('div');
  status.className = 'status';
  document.querySelector('.container').appendChild(status);

  // Query active tab
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs.length === 0) return;
    const tab = tabs[0];
    
    if (!tab.url) {
        list.innerHTML = '<div class="no-results">Cannot access page URL.</div>';
        return;
    }
    
    // Check for restricted pages
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:') || tab.url.startsWith('file://')) {
        list.innerHTML = '<div class="no-results">Extension cannot run on this page type.</div>';
        return;
    }

    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {action: 'getSearchBars'}, (response) => {
      if (chrome.runtime.lastError) {
        // Likely content script not loaded yet
        list.innerHTML = `<div class="no-results">
            Script not ready.<br>Try refreshing the page.
        </div>`;
        return;
      }

      if (!response || !response.searchBars || response.searchBars.length === 0) {
        list.innerHTML = '<div class="no-results">No search bars detected.</div>';
        return;
      }

      renderList(response.searchBars, tab);
    });
  });

  function renderList(searchBars, tab) {
    list.innerHTML = '';
    let hostname;
    try {
        hostname = new URL(tab.url).hostname;
    } catch(e) {
        console.error(e);
        return;
    }

    searchBars.forEach(bar => {
      const item = document.createElement('div');
      item.className = `search-item ${bar.isSelected ? 'selected' : ''}`;
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'search-choice';
      radio.checked = bar.isSelected;
      
      const label = document.createElement('span');
      label.className = 'label-text';
      label.textContent = bar.label;
      item.title = bar.selector; // Tooltip shows raw selector

      item.appendChild(radio);
      item.appendChild(label);

      // Handle click
      item.addEventListener('click', () => {
        // Update UI
        document.querySelectorAll('.search-item').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);
        item.classList.add('selected');
        radio.checked = true;

        // Visual feedback on page
        chrome.tabs.sendMessage(tab.id, {action: 'highlight', index: bar.index});

        // Save preference
        savePreference(hostname, bar.selector);
      });
      
      list.appendChild(item);
    });
  }

  function savePreference(hostname, selector) {
    const setting = {};
    setting[hostname] = selector;
    chrome.storage.local.set(setting, () => {
      status.textContent = 'Saved preference!';
      status.classList.add('visible');
      setTimeout(() => {
        status.classList.remove('visible');
      }, 2000);
    });
  }
});
