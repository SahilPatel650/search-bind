# Contributing to Search Bind

Thank you for your interest in contributing!

## How to Contribute

1.  **Fork the repository**.
2.  **Create a feature branch**:
    ```bash
    git checkout -b feature/my-new-feature
    ```
3.  **Make your changes**.
    - If adding a new feature, please update the detecting logic in `content.js` carefully to avoid performance regressions on complex pages.
    - Ensure your code follows the existing style (standard JS, no frameworks).
4.  **Test your changes**:
    - Load the extension as an unpacked extension in Chrome/Edge.
    - Test on multiple sites (Wikipedia, GitHub, Reddit) to ensure no regressions.
5.  **Commit your changes**:
    ```bash
    git commit -am 'Add some feature'
    ```
6.  **Push to the branch**:
    ```bash
    git push origin feature/my-new-feature
    ```
7.  **Submit a Pull Request**.

## Reporting Bugs

Please include:
- The website URL where the issue occurs.
- Steps to reproduce.
- What browser/OS you are using.
