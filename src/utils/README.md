# Utils

This directory contains utility functions and helper methods.

## Examples

```typescript
// formatters.ts
export const formatDate = (date: Date) => {
  // Date formatting logic
};

export const formatCurrency = (amount: number) => {
  // Currency formatting logic
};

// validators.ts
export const isValidEmail = (email: string) => {
  // Email validation logic
};

export const isValidPhone = (phone: string) => {
  // Phone validation logic
};

// constants.ts
export const API_BASE_URL = 'https://api.rilybricoule.com';
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
```

## Guidelines

- Keep functions pure when possible
- Export individual functions as named exports
- Group related utilities in the same file
- Document complex utility functions
