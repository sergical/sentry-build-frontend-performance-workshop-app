# @repo/eslint-config

Shared ESLint configurations for the monorepo.

## Configurations

- `base.js` - Base TypeScript/JavaScript configuration
- `react.js` - React-specific configuration with hooks and refresh rules
- `node.js` - Node.js/API configuration

## Usage

Import the appropriate configuration in your workspace's `eslint.config.js`:

```js
import { reactConfig } from '@repo/eslint-config/react';

export default [{ ignores: ['dist'] }, ...reactConfig];
```

All ESLint dependencies are managed in this package, so you don't need to install them separately in your workspaces.
