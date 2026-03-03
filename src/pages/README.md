# Pages

This directory contains page-level components for the application.

## Structure

Pages should be organized by feature or route:

```
pages/
├── Home/
│   └── index.tsx
├── Services/
│   └── index.tsx
├── Prestataire/
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard.tsx
└── Client/
    ├── Login.tsx
    ├── Register.tsx
    └── Dashboard.tsx
```

## Guidelines

- Each page should be a default export
- Keep pages focused on layout and composition
- Move business logic to hooks or services
- Use components from the components directory
