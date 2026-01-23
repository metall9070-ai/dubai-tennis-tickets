# Django Backend for Dubai Duty Free Tennis Championships

A production-ready Django REST API backend for the Dubai Tennis Championships ticket booking system.

## Features

- **Events API**: List and retrieve tennis events (WTA 1000 & ATP 500)
- **Categories API**: Seating categories with live availability
- **Orders API**: Guest and authenticated checkout with seat reservation
- **Contact API**: Contact form submissions
- **JWT Authentication**: Secure token-based authentication
- **Admin Panel**: Full Django admin for content management
- **CORS Configured**: Ready for frontend integration

## Tech Stack

- Django 5.0
- Django REST Framework
- SimpleJWT for authentication
- SQLite (development) / PostgreSQL (production)
- django-cors-headers

## Quick Start

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

The `.env` file is pre-configured for development. For production, update:

```bash
SECRET_KEY=your-production-secret-key
DEBUG=False
DATABASE_URL=postgres://user:pass@host:5432/dbname
ALLOWED_HOSTS=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Create Superuser (Admin Access)

```bash
python manage.py createsuperuser
```

### 6. Seed Initial Data

```bash
python manage.py seed_data
```

This creates:
- 2 Tournaments (WTA 1000 & ATP 500)
- 13 Events matching the frontend schedule
- 52 Seating categories with pricing

### 7. Run Development Server

```bash
python manage.py runserver 8000
```

## API Endpoints

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events/` | List all events |
| GET | `/api/events/{id}/` | Get event with categories |
| GET | `/api/events/wta/` | List WTA events |
| GET | `/api/events/atp/` | List ATP events |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/` | List all categories |
| GET | `/api/categories/{id}/` | Get category availability |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/` | Create order |
| GET | `/api/orders/{id}/` | Get order details |

**Example Order Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+971501234567",
  "comments": "VIP request",
  "items": [
    {"event_id": 1, "category_id": 1, "quantity": 2}
  ]
}
```

### Contact

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact/` | Submit contact form |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Get JWT tokens |
| POST | `/api/auth/refresh/` | Refresh access token |

## Admin Panel

Access at: `http://localhost:8000/admin/`

Manage:
- Tournaments & Events
- Seating Categories & Availability  
- Orders & Order Items
- Contact Messages
- Users

## Frontend Integration

The frontend currently uses hardcoded data. To integrate:

1. Install axios in frontend: `npm install axios`
2. Update components to fetch from API endpoints
3. Update Checkout to POST to `/api/orders/`
4. Update ContactsPage to POST to `/api/contact/`

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Configure PostgreSQL database
3. Run `python manage.py collectstatic`
4. Use gunicorn: `gunicorn tennis_backend.wsgi:application`
5. Configure nginx as reverse proxy
