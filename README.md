# EduTrack

## Installation

1. Clone the repository.
1. Install [Node.js](https://nodejs.org/en/download). 
1. Install [pnpm](https://pnpm.io/installation).
1. Install dependencies:
    ```bash
    pnpm install
    ```

1. Run program:
    ```bash
    pnpm run dev
    ```

## Folder Structure

```php
src/                      # Application source code
├── api/                  # API integration files
├── assets/               # Icons and images
├── components/           # React components (page specific components are stored in respective subfolders)
├── constants/            # Global constants
├── context/              # Page components (LandingPage, ViewPdfPage, etc.)
│   ├── AuthContext.tsx   # Context for user authentication
├── pages/                # Page components
├── types/                # Commonly used types
├── App.tsx               # Main application file
├── main.tsx              # Entry point

.gitignore                # Files and directories to ignore in Git
DEV_MEMO.md               # Notes for developers
index.html                # Root HTML file
package.json              # Project dependencies and scripts
pnpm-lock.yaml            # Lock file to ensure consistent dependency versions
README.md                 # Project documentation
```

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## License

## Contributions
