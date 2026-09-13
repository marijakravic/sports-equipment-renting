# SportRent

SportRent is a bachelor-level full-stack web application for managing sports-equipment rentals. It provides a small inventory catalogue where visitors can browse equipment by sport or target age group, search the catalogue, add items to a persistent basket, and submit a rental reservation after signing in. Authenticated users can also add new equipment, including an optional image.

The repository contains two independently run applications:

- **Laravel 12 API** in the repository root. It owns the MySQL data model, validation, file storage, Sanctum tokens, and JSON endpoints.
- **React 19 client** in [`react/`](react). It is a Vite single-page application that consumes the Laravel API.

The UI and user-facing copy are primarily in Bosnian/Serbian Latin script; the codebase uses English identifiers and Laravel conventions.

## Features

- Browse sports and equipment inventory.
- Search equipment by its name, brand, model, equipment type, sport, or age group.
- View equipment state (`Available`, `Damaged`, or `WrittenOff`), daily price in KM, image, and specifications.
- Create an account, log in, and log out using Laravel Sanctum personal-access tokens.
- Add equipment with cataloguing information, condition, size, price, and an optional image upload.
- Keep a client-side basket in `localStorage` and submit a reservation with customer details and dates.
- Show a lightweight dashboard with inventory totals and the five most recently added items.

## Technology

| Area | Technology |
| --- | --- |
| API | PHP 8.2+, Laravel 12, Eloquent ORM |
| Authentication | Laravel Sanctum bearer tokens |
| Database | MySQL (configured through Laravel environment variables) |
| Image handling | Intervention Image installed; Laravel public disk is used for equipment uploads |
| Client | React 19, React Router 7, Axios |
| UI | Bootstrap / React Bootstrap and custom CSS |
| Client tooling | Vite 7, ESLint 9 |
| Backend tests | PHPUnit 11 with an in-memory SQLite test configuration |

## Architecture

```text
React SPA (react/, Vite :5173)
  ├─ React Router views and reusable cards/layouts
  ├─ Context providers
  │   ├─ authentication token in localStorage
  │   └─ basket item IDs in localStorage
  └─ Axios / fetch requests
             │
             ▼
Laravel API (root, /api, :8000)
  ├─ route definitions (routes/api.php)
  ├─ API controllers and request validation
  ├─ Eloquent models and migrations
  ├─ Sanctum personal-access tokens
  └─ public-disk image files (storage/app/public/equipment)
             │
             ▼
          MySQL database
```

Laravel’s root Vite configuration (`vite.config.js`) is retained for the default Blade assets. It is separate from `react/vite.config.js`; the React application is the active user interface and must be started and built from `react/`.

### Backend structure

| Location | Responsibility |
| --- | --- |
| [`routes/api.php`](routes/api.php) | API endpoints under `/api` |
| [`app/Http/Controllers/Api/`](app/Http/Controllers/Api) | Authentication, catalogue, equipment, and reservation actions |
| [`app/Http/Requests/`](app/Http/Requests) | Sign-up and login validation rules |
| [`app/Models/`](app/Models) | Eloquent models and relationships |
| [`database/migrations/`](database/migrations) | The evolving MySQL schema and lookup-state inserts |
| [`database/seeders/DatabaseSeeder.php`](database/seeders/DatabaseSeeder.php) | A single development `Test User` seed |

The API returns Eloquent JSON directly rather than using API resource classes. Catalogue responses eagerly include the `equipmentType` and `equipmentState` relationships where needed.

### Frontend structure

| Location | Responsibility |
| --- | --- |
| [`react/src/router.jsx`](react/src/router.jsx) | Browser-router route definitions |
| [`react/src/views/`](react/src/views) | Page-level screens |
| [`react/src/components/`](react/src/components) | Layout, sport, basket, and equipment cards |
| [`react/src/contexts/ContextProvider.jsx`](react/src/contexts/ContextProvider.jsx) | Logged-in user/token state |
| [`react/src/contexts/BasketContext.jsx`](react/src/contexts/BasketContext.jsx) | Persistent basket of equipment IDs |
| [`react/src/axios-client.js`](react/src/axios-client.js) | Axios client and bearer-token interceptor |
| [`react/src/index.css`](react/src/index.css) | Shared visual design system and responsive layout styles |

The main layout provides the dashboard, sports, adults, children, add-equipment, basket, and search flows. Guest routes contain login and sign-up. A token is stored as `ACCESS_TOKEN`; basket contents are stored as `basket`.

## Domain model

The central concept is an **equipment item**. It belongs to one sport through its equipment type, has a condition and age group, and can appear in many reservations through the `reserved_equipment` pivot table.

```text
Sport 1 ── * EquipmentType 1 ── * EquipmentItem * ── * Reservation
                                       │                    │
                                       ├─ 1 EquipmentState   ├─ 1 User
                                       ├─ 1 Age              └─ 1 ReservationState
                                       └─ 1 SizeType
```

| Entity | Important attributes / purpose |
| --- | --- |
| `sports` | Sport name and optional image path |
| `equipment_types` | Equipment category belonging to a sport |
| `equipment_items` | Inventory details: names, serial and barcode numbers, brand/model, size, price, condition, target age, image, and notes |
| `equipment_states` | Lookup values inserted by migration: `Available`, `WrittenOff`, `Damaged` |
| `ages` | Target-age lookup table (renamed from the original `genders` table) |
| `size_types` | Size-type lookup referenced by equipment items |
| `reservations` | Rental dates, customer contact fields, requesting user, notes, and reservation state |
| `reservation_states` | Lookup values inserted by migration: `Zatrazena`, `Aktivna`, `Otkazana` |
| `reserved_equipment` | Reservation-to-equipment many-to-many pivot |
| `users` / `personal_access_tokens` | Laravel users and Sanctum tokens |

The database seeder does not create sports, equipment types, ages, or size types. Create those lookup records before adding inventory. Equipment and reservation state values are inserted automatically by their migrations.

## API reference

All endpoints are prefixed with `/api`. Successful login and sign-up responses contain `user` and `token`; authenticated requests use `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/signup` | Create a user and Sanctum token |
| `POST` | `/login` | Authenticate a user and issue a token |
| `POST` | `/logout` | Revoke the current token (Sanctum-protected) |
| `GET` | `/user` | Return the authenticated user |
| `GET` | `/sports` | List sports |
| `GET` | `/sports/{id}/equipment` | List a sport’s equipment; accepts `search` |
| `GET` | `/equipmentTypes` | List equipment types with their sports |
| `GET` | `/ages` | List age groups |
| `GET` | `/states` | List equipment states |
| `GET` | `/equipment-items` | List equipment with type and state |
| `GET` | `/equipment-items/{id}` | Get one equipment item |
| `PUT` | `/equipment-items/{id}` | Update an equipment item (Sanctum-protected) |
| `POST` | `/equipment-items` or `/additems` | Create an equipment item; accepts multipart form data |
| `GET` | `/equipment` | Search/filter equipment; accepts `search`, `sport`, and `age` query parameters |
| `POST` | `/basket` | Resolve an `ids` array to equipment records, including sport/type/state data |
| `POST` | `/reservations` | Create a reservation and attach `equipment_item_ids` (Sanctum-protected) |
| `GET` | `/reservations/{id}` | Get one reservation with its equipment (Sanctum-protected) |
| `PUT` | `/reservations/{id}` | Update an open reservation and its equipment (admin only) |
| `POST` | `/reservations/{id}/equipment-items` | Add one available item to an open reservation (admin only) |

### Key request shapes

`POST /api/equipment-items` and `POST /api/additems` require the following fields:

```text
equipment_type_id, equipment_state_id, age_id, name, serial_number,
barcode, internal_registration_number, price, size_type_id
```

Optional fields are `size`, `description`, `brand`, `model`, `notes`, and image file `imageurl` (`jpeg`, `jpg`, or `png`). Images are saved on the Laravel `public` disk beneath `equipment/`.

`POST /api/reservations` expects:

```json
{
  "reservation_date": "2026-08-10",
  "return_date": "2026-08-12",
  "name": "Ime",
  "surname": "Prezime",
  "phone": "+387...",
  "identification_document": "optional",
  "notes": "optional",
  "equipment_item_ids": [1, 2]
}
```

The API assigns the newly created reservation the `Zatrazena` state and links the submitted item IDs through `reserved_equipment`.

## Run locally

### Prerequisites

- PHP 8.2 or later with Composer
- MySQL and a database for the project
- Node.js and npm

### 1. Configure and run the Laravel API

From the repository root:

```bash
composer install
copy .env.example .env
php artisan key:generate
```

Set the MySQL connection in `.env`. The supplied example uses:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=final_project
DB_USERNAME=root
DB_PASSWORD=
```

Create the database if it does not already exist, then run the migrations and expose public uploads:

```bash
php artisan migrate
php artisan storage:link
php artisan serve
```

The API will normally be available at `http://127.0.0.1:8000`. `storage:link` is needed for equipment image URLs such as `/storage/equipment/...` to resolve in the client.

> On PowerShell, use `Copy-Item .env.example .env` rather than `copy` if the latter is unavailable. Do not commit `.env`.

### 2. Configure and run the React client

Open a second terminal:

```bash
cd react
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The current client intentionally uses fixed local API URLs:

- Axios API base: `http://127.0.0.1:8000/api`
- Direct image and some fetch URLs: `http://localhost:8000`

Keep the API on port `8000` for the development client to work without code changes. For a different host or a deployment, centralize these URLs in Vite environment variables and update the image URL construction as well.

### Build and quality commands

```bash
# Laravel backend tests (uses in-memory SQLite from phpunit.xml)
php artisan test

# Laravel code style fixer/checker
vendor/bin/pint --test

# React checks and production bundle
cd react
npm run lint
npm run build
```

The repository currently contains Laravel’s example test files only; endpoint behaviour is primarily established by the controllers and request validation.

## Frontend routes

| Route | Screen |
| --- | --- |
| `/dashboard` | Inventory counts, recent equipment, and quick actions |
| `/sports` | Sports catalogue |
| `/equipment` | Search and filtered inventory results |
| `/equipment/:id` | Equipment details and add-to-basket action |
| `/adults` | Redirects to `/equipment?age=6` |
| `/kids` | Redirects to `/equipment?age=7` |
| `/basket` | Basket and reservation form |
| `/additems` | Equipment-entry form for a logged-in user |
| `/login`, `/signup` | Guest authentication screens |

## Conventions for future work

- Keep backend classes under the normal Laravel namespaces and use Eloquent relationships instead of manual joins.
- Add schema changes as new timestamped migrations; do not edit migrations that may already have been applied to a shared database.
- Put API interaction in `axios-client.js` or a focused service module so the bearer-token behaviour remains consistent.
- Use React function components, hooks, and the existing context providers for state that must survive navigation.
- Preserve the existing visual language: neutral green/cream surfaces, brown accent, rounded cards, compact Bootstrap forms, and Bosnian/Serbian user text.
- Keep the API and React app independently runnable until a deliberate deployment integration is introduced.

## Current implementation boundaries

This project is a functional academic prototype. The following points describe the current implementation and should be addressed before treating it as a production rental system:

- Reservation creation validates dates and item IDs but does not prevent double-booking, check equipment state, calculate a price based on rental duration, or provide reservation-management endpoints.
- The basket is client-side only and stores IDs in `localStorage`; it is not associated with a server-side user session.
- Equipment-detail pages receive the item through React Router navigation state. Opening or refreshing `/equipment/:id` directly does not fetch the item from the API.
- The adults and children shortcuts depend on database IDs `6` and `7`; use named age records or a server-provided mapping before relying on them in a fresh database.
- The add-equipment form currently sends a fixed `size_type_id` of `1`, and its selected sport does not constrain the available equipment types.
- Several lookup/user-type elements are only partially wired (`user_types` is not linked to `users`, and no management UI exists for lookup values).
- `routes/api.php` contains duplicate route declarations and a double-slash equipment-type-by-sport declaration. Consolidate and test the routes before extending the API.
- API and image base URLs are hard-coded for localhost rather than read from configuration.

## License

The repository includes the Laravel MIT license in [`LICENSE`](LICENSE). Confirm the intended license for original SportRent code and assets before publishing or redistributing the project.
