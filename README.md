# SportRent

SportRent is a bachelor-level full-stack web application for managing sports-equipment rentals. It provides a small inventory catalogue where visitors can browse equipment by sport or target age group, search the catalogue, add items to a persistent basket, and submit a rental reservation after signing in. Authenticated users can also add new equipment, including an optional image.



- **Laravel 12 API** in the repository root. It owns the MySQL data model, validation, file storage, Sanctum tokens, and JSON endpoints.
- **React 19 client** in [`react/`](react). It is a Vite single-page application that consumes the Laravel API.
