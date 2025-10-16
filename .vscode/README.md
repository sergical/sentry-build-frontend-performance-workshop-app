# VS Code Workspace Configuration

This workspace is configured with recommended extensions and settings for the best development experience.

## Recommended Extensions

When you open this workspace, VS Code will prompt you to install these extensions:

### Essential

- **Prettier** (`esbenp.prettier-vscode`) - Code formatter
- **ESLint** (`dbaeumer.vscode-eslint`) - JavaScript/TypeScript linter

### Helpful

- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - Autocomplete for Tailwind classes
- **Error Lens** (`usernamehw.errorlens`) - Inline error/warning display

## Workspace Settings

The following settings are automatically applied:

- ✅ **Format on Save**: Enabled
- ✅ **Default Formatter**: Prettier
- ✅ **ESLint Auto-fix**: Runs on save
- ✅ **File-specific Formatters**: Configured for TypeScript, JavaScript, and JSON

## Manual Installation

If prompted, click "Install All" or install individually:

```
1. Open Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
2. Type "Extensions: Show Recommended Extensions"
3. Click "Install" next to each extension
```

## Verifying Setup

After installation:

1. Open any `.ts` or `.tsx` file
2. Make a formatting change (e.g., add extra spaces)
3. Save the file (Cmd+S / Ctrl+S)
4. File should auto-format with Prettier
5. ESLint warnings should appear inline (if Error Lens installed)

## Troubleshooting

### Prettier not formatting on save?

- Check bottom-right of VS Code for "Prettier" as the formatter
- Ensure Prettier extension is installed and enabled
- Reload VS Code window

### ESLint errors not showing?

- Check VS Code output panel (View → Output → ESLint)
- Ensure ESLint extension is installed
- Run `pnpm install` to ensure dependencies are installed

### Conflicting formatters?

- Disable any other formatter extensions (e.g., Beautify, JS-CSS-HTML Formatter)
- Set Prettier as default in settings
