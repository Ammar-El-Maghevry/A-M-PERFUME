# A&M Perfume — Backend

Spring Boot 3.2 · Java 17 · PostgreSQL · JWT · Cloudinary · Docker.

The backend lives under [`backend/`](./backend) and exposes a REST API at `/api/*`.
The Next.js frontend lives under [`frontend/`](./frontend); the two are deployed
independently.

---

## LOCAL DEV

### 1. Start everything with Docker

From the repo root:

```bash
docker compose up --build
```

This brings up:

- **PostgreSQL 16** on `localhost:5432`
  - db `amperfume`, user `postgres`, password `postgres`, persisted in a named volume
- **Spring Boot API** on `localhost:8080`

| URL                                          | What |
|----------------------------------------------|------|
| http://localhost:8080/api/health             | Health check (public) |
| http://localhost:8080/swagger-ui.html        | Interactive OpenAPI docs |
| http://localhost:8080/v3/api-docs            | OpenAPI JSON spec |

### 2. First-run seed data

A `CommandLineRunner` (`DataSeeder.java`) seeds the database on the first start:

- Admin user — **`admin@amperfume.mr` / `Admin@2024`** (bcrypt-hashed at runtime)
- 12 fragrances from the catalogue
- 5 categories (Femme, Homme, Unisexe, Oriental, Édition Limitée)

`data.sql` additionally seeds `site_settings` and the categories themselves
idempotently via `ON CONFLICT DO NOTHING`. Re-running the app is safe; seeds
are skipped when records already exist.

### 3. Smoke-test from the CLI

```bash
# Health
curl -s http://localhost:8080/api/health
# {"status":"ok","service":"A&M Perfume API"}

# Login as the seeded admin
curl -s -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@amperfume.mr","password":"Admin@2024"}' | jq

# Public catalogue
curl -s 'http://localhost:8080/api/products?size=4' | jq
```

### 4. Running the backend without Docker

You need Java 17/21, Maven (or use `./mvnw`), and a local Postgres.

```bash
cd backend
./mvnw spring-boot:run
```

The default profile is `dev`. Override anything via env vars listed below.

> **Note on JDK versions.** Lombok 1.18.38 (the version we ship) supports
> Java 17–24 cleanly and Java 25 with a harmless `sun.misc.Unsafe`
> deprecation warning. Earlier Lombok releases (1.18.36 and below) fail to
> compile under Java 25 with `com.sun.tools.javac.code.TypeTag :: UNKNOWN`;
> if you hit that, upgrade Lombok or point `JAVA_HOME` at a Java 21 JDK for
> local builds. Production uses Java 17 via the Docker image.

---

## ENVIRONMENT VARIABLES

All vars have sensible local defaults in `application.yml` so the API runs
out-of-the-box with `docker compose up`. In production (Render / managed
Postgres) supply them explicitly.

| Variable                    | Purpose                                        |
|-----------------------------|------------------------------------------------|
| `SPRING_PROFILES_ACTIVE`    | `dev` (default) or `prod`                      |
| `DATABASE_URL`              | `jdbc:postgresql://host:5432/db`               |
| `DB_USERNAME` / `DB_PASSWORD` | Postgres credentials                         |
| `JWT_SECRET`                | ≥ 32 chars, used to sign access + refresh tokens |
| `CLOUDINARY_CLOUD_NAME`     | Cloudinary cloud name                          |
| `CLOUDINARY_API_KEY`        | Cloudinary API key                             |
| `CLOUDINARY_API_SECRET`     | Cloudinary API secret                          |
| `BASE_URL`                  | Public URL of the API (used in build metadata) |
| `CORS_ALLOWED_ORIGINS`      | Comma list of explicit origins                 |
| `CORS_ALLOWED_ORIGIN_PATTERNS` | Comma list of glob origins (e.g. `https://*.vercel.app`) |

Access tokens are valid 15 minutes, refresh tokens 7 days
(`app.jwt.access-token-ttl-minutes` / `app.jwt.refresh-token-ttl-days`).

---

## API SURFACE (cheat-sheet)

| Group        | Path                                        | Auth     |
|--------------|---------------------------------------------|----------|
| Health       | `GET /api/health`                           | Public   |
| Auth         | `POST /api/auth/{register,login,refresh}`   | Public   |
| Products     | `GET /api/products`, `GET /api/products/{slug}` | Public |
| Products     | `POST/PUT/DELETE /api/products/**`          | ADMIN    |
| Products     | `POST /api/products/{id}/images` (multipart)| ADMIN    |
| Categories   | `GET /api/categories`                       | Public   |
| Categories   | `POST/PUT/DELETE /api/categories/**`        | ADMIN    |
| Cart         | `GET/POST/PUT/DELETE /api/cart/**`          | USER     |
| Wishlist     | `GET/POST/DELETE /api/wishlist/**`          | USER     |
| Users        | `GET/PUT /api/users/me/**`                  | USER     |
| Orders       | `POST /api/orders`                          | **Public** (guest+user) |
| Orders       | `POST /api/orders/{id}/proof` (multipart)   | **Public** |
| Orders       | `GET/PUT /api/orders/my/**`                 | USER     |
| Admin Orders | `GET/PUT /api/admin/orders/**`              | ADMIN    |
| Dashboard    | `GET /api/admin/dashboard`                  | ADMIN    |
| Customers    | `GET /api/admin/customers`, `PUT .../toggle-active` | ADMIN |
| Settings     | `GET/PUT /api/admin/settings`               | ADMIN    |
| Notifications| `GET/PUT /api/notifications/**`             | USER     |
| Files        | `POST /api/files/upload`                    | ADMIN    |

Errors are normalised to:

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": { "email": "must be a well-formed email address" },
  "timestamp": "2026-05-21T10:00:00Z"
}
```

---

## RENDER DEPLOY

1. **Push to GitHub** (already done).
2. **New PostgreSQL** in Render → copy the **Internal Database URL**.
   Render gives you `postgres://user:pass@host/db` — convert to
   `jdbc:postgresql://host/db?sslmode=require` and split out `DB_USERNAME` /
   `DB_PASSWORD`.
3. **New → Web Service** in Render → connect this repo.
   - **Root directory:** `backend`
   - **Build command:** `./mvnw package -DskipTests`
   - **Start command:** `java -jar target/am-perfume-api.jar`
   - **Health check path:** `/api/health`
4. **Environment variables** on the web service (see table above):
   - `SPRING_PROFILES_ACTIVE=prod`
   - `DATABASE_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET` (≥ 32 chars; rotate per environment)
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `BASE_URL` (e.g. `https://am-perfume.onrender.com`)
   - `CORS_ALLOWED_ORIGINS=https://amperfume.mr` (or your real production origin)
   - `CORS_ALLOWED_ORIGIN_PATTERNS=https://*.vercel.app`
5. **Deploy.** Render builds the multi-stage Docker image (`backend/Dockerfile`)
   or, if you skip Docker, falls back to native Maven build.
6. **First boot** runs `DataSeeder.java` which creates the admin user.
   **Immediately log in and change the password** (`PUT /api/users/me/password`).

---

## CRON-JOB.ORG — keep Render alive

Render's free tier puts services to sleep after ~15 min of idleness, which
adds 30 s of cold-start latency to the next request. Ping the health endpoint
every 14 minutes:

| Field      | Value                                              |
|------------|----------------------------------------------------|
| **URL**    | `https://YOUR-APP.onrender.com/api/health`         |
| **Method** | GET                                                |
| **Interval** | every 14 minutes                                 |
| **Notify on failure** | yes (optional)                          |

Sign up at <https://cron-job.org>, paste the URL above, save. Done.

---

## PROJECT LAYOUT

```
backend/
├── Dockerfile                 # multi-stage build (Maven → JRE)
├── pom.xml                    # Spring Boot 3.2 + Lombok + JJWT + Cloudinary
├── mvnw, mvnw.cmd, .mvn/      # Maven wrapper
└── src/main/
    ├── java/com/amperfume/api/
    │   ├── ApiApplication.java
    │   ├── config/            # SecurityConfig, AppProperties, CloudinaryConfig, OpenApiConfig, DataSeeder
    │   ├── security/          # JwtService, JwtAuthFilter, UserPrincipal, AppUserDetailsService, SecurityUtils
    │   ├── entity/            # JPA entities (12 of them)
    │   ├── repository/        # Spring Data repositories
    │   ├── enums/             # Role, OrderStatus, PaymentMethod, NotificationType
    │   ├── dto/{request,response}/
    │   ├── exception/         # GlobalExceptionHandler + typed errors
    │   ├── service/           # business logic
    │   └── controller/        # REST controllers
    └── resources/
        ├── application.yml
        ├── application-dev.yml
        ├── application-prod.yml
        └── data.sql           # idempotent seed (settings + categories)
docker-compose.yml             # postgres + backend + named volume
```

---

## NOTES

- Prices are stored as `DECIMAL(10,2)` in MRU.
- Soft-delete only — `active=false` instead of physically removing products /
  categories / users. Order items keep a **snapshot** of name + SKU + price.
- Order numbers follow `AM-YYYY-NNNN`, where `NNNN` is the count of orders for
  the current year + 1.
- Guest orders work end-to-end: `POST /api/orders` is publicly accessible and
  accepts `guestName`, `guestPhone`, `guestEmail`, plus either `addressId`
  (for logged-in users) or a `newAddress` block.
- Cloudinary is used for product images (`POST /api/products/{id}/images`),
  generic admin uploads (`POST /api/files/upload`) and payment proofs
  (`POST /api/orders/{id}/proof`).
- Status changes (`confirm`, `reject`, `status`) restore stock automatically
  when an order moves to `REJECTED` or `CANCELLED` and fire a notification
  to the order owner.

---

## TROUBLESHOOTING

| Symptom | Fix |
|---------|-----|
| `JWT secret must be at least 32 characters` on startup | Set `JWT_SECRET` to a string ≥ 32 chars. |
| `relation "users" does not exist` | First-run only. Hibernate creates schemas via `ddl-auto=update`; restart once. |
| Cloudinary uploads return 400 | Confirm `CLOUDINARY_*` env vars are set; the SDK is happy with empty strings locally but won't actually upload. |
| CORS error from the SPA | Add the origin to `CORS_ALLOWED_ORIGINS` or `CORS_ALLOWED_ORIGIN_PATTERNS`. |
