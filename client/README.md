# Wina Bwangu — Agent Console

A full-stack prototype of the Wina Bwangu mobile money agent console.
Client-side interface, Express API, and MariaDB database.

Built for Logbook Exercise 3.

## What it does

The console lets a Wina Bwangu agent:
- see the float remaining on each service this month,
- capture new transactions (with validation),
- browse the full transaction register with filters and pagination,
- review per-booth performance,
- and log in securely with a registered account.

## Running it

You'll need Node.js and MariaDB installed.

### 1. Set up the database

    mariadb -u root < wina_bwangu_schema_seed.sql

That creates the `wina_bwangu` database, the five tables (including `users`),
and seeds the 308 transactions from Appendix 1 plus two default users.

### 2. Configure the backend

Create a `.env` file in `server/`:

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=wina_bwangu
    PORT=3000

### 3. Start the API

    cd server
    npm install
    npm run dev

The API runs on `http://localhost:3000`. Check it:

    curl http://localhost:3000/api/booths

### 4. Serve the frontend

The client is plain HTML/CSS/JS — no build step. Serve it over HTTP
so the browser can reach the API:

    cd client
    python -m http.server 8000

Then open `http://localhost:8000` in your browser. You'll land on the
login page.

If the API is unreachable, the app falls back to the built-in dataset
in `js/data.js` and notifies you with a toast.

## Files

### Client

| File | What it does |
|---|---|
| `login.html` | Login form |
| `register.html` | Account creation form |
| `index.html` | Dashboard — float board, summaries, pie chart, tables, matrix |
| `capture.html` | Transaction capture form |
| `transactions.html` | Register of all transactions |
| `booths.html` | Per-booth performance |
| `css/base.css` | Design tokens, reset, typography, form and table base |
| `css/layout.css` | App shell, navigation rail, responsive breakpoints |
| `css/components.css` | Float board, stats, data bars, pie key, toasts, matrix |
| `css/style.css` | Login and register page styling |
| `js/auth.js` | Page protection — redirects to login if not authenticated |
| `js/data.js` | Booths, services, limits, catalogue, business rules, offline seed |
| `js/api.js` | Ajax layer — XMLHttpRequest, fallback, session persistence |
| `js/store.js` | All calculations: tax, headroom, per-booth and per-service totals |
| `js/ui.js` | Navigation, toasts, formatting, pie chart, data bars, logout |
| `js/login.js` | Login form logic |
| `js/register.js` | Registration form logic |
| `js/dashboard.js` · `js/capture.js` · `js/transactions.js` · `js/booths.js` | One script per page |

### Server

| File | What it does |
|---|---|
| `server.js` | Express app, route wiring, health check |
| `config/database.js` | MySQL connection pool |
| `routes/authRoutes.js` | `POST /api/auth/login`, `POST /api/auth/register` |
| `routes/boothRoutes.js` | `GET /api/booths` |
| `routes/serviceRoutes.js` | `GET /api/services`, `GET /api/services/booth/:code` |
| `routes/transactionRoutes.js` | `GET /api/transactions`, `POST /api/transactions` |
| `database.sql` | Schema + seed |

## API

| Method | Endpoint | What it returns |
|---|---|---|
| GET | `/api/booths` | All six booths with locations |
| GET | `/api/services` | All five services with limits and rates |
| GET | `/api/services/booth/:code` | Services a specific booth carries |
| GET | `/api/transactions` | All transactions, joined with booth and service |
| POST | `/api/transactions` | Create a new transaction |
| POST | `/api/auth/login` | Validate credentials, return username and role |
| POST | `/api/auth/register` | Create a new user with role `agent` |

### POST payload (transaction)

```json
{
  "boothCode": "Wina3",
  "serviceName": "Airtel Money",
  "transactionAmount": 1500
}