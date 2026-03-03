# Context

This directory contains React Context providers for global state management.

## Examples

```typescript
// AuthContext.tsx
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  // Auth state and methods
};

// ThemeContext.tsx
export const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  // Theme state and methods
};
```

## Guidelines

- Use Context for truly global state
- Combine with custom hooks for easier consumption
- Keep context focused on a specific domain
- Avoid over-using context for performance
