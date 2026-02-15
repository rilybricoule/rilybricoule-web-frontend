# Services

This directory contains API service functions and external integrations.

## Examples

```typescript
// api.ts
export const api = {
  get: (url: string) => fetch(url),
  post: (url: string, data: any) => fetch(url, { method: 'POST', body: JSON.stringify(data) }),
};

// authService.ts
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// prestataireService.ts
export const prestataireService = {
  getAll: () => api.get('/prestataires'),
  getById: (id) => api.get(`/prestataires/${id}`),
};
```

## Guidelines

- Group related API calls together
- Use async/await for cleaner code
- Handle errors consistently
- Export service objects with related methods
