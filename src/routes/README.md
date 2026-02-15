# Routes

This directory contains routing configuration for the application.

## Example Setup

```typescript
// routes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import PrestataireLogin from '../pages/Prestataire/Login';
import ClientLogin from '../pages/Client/Login';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prestataire/login" element={<PrestataireLogin />} />
        <Route path="/client/login" element={<ClientLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Guidelines

- Use React Router for client-side routing
- Organize routes by feature
- Implement protected routes for authenticated pages
- Consider lazy loading for better performance
- Keep route configuration centralized
