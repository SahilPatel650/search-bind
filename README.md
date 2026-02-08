# Search Bind

> A Chromium extension that allows you to press `/` on any website to immediately focus the search bar.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- ⌨️ **Global Shortcut**: Press `/` anywhere to focus the search bar.
- 🔍 **Smart Detection**: automatically detects multiple search bars on complex pages.
- ⚙️ **Configurable Default**: Too many search inputs? Open the extension popup to see detected bars and select your preferred default for that domain.
- 💾 **Persistent Settings**: Remembers your preferred search bar for each website.

## Installation

### Manual Installation (Developer Mode)

1.  Clone this repository or download the ZIP.
    ```bash
    git clone https://github.com/yourusername/search-bind.git
    ```
2.  Open Chrome/Edge/Brave and navigate to `chrome://extensions`.
3.  Enable **Developer mode** in the top-right corner.
4.  Click **Load unpacked**.
5.  Select the folder where you cloned this repository.

## Usage

1.  **Focus Search**: Go to any website (e.g., GitHub, Wikipedia, YouTube) and press `/`.
2.  **Select Preferred Input**:
    - If the wrong input is focused, click the **Search Bind** icon in the browser toolbar.
    - A list of detected inputs will appear.
    - Click on the one you want to use. It will highlight in red to confirm.
    - This selection is saved and will be used as the default for this domain next time.

## Development

The extension is built with vanilla JavaScript, HTML, and CSS. No build step is required.

- `manifest.json` - Extension configuration (Manifest V3).
- `content.js` - Injected script that handles keypress detection and DOM scanning.
- `popup.html` / `popup.js` - The UI for selecting preferred search inputs.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
