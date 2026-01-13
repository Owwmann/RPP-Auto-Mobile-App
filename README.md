# 🚗 RPP Auto - Mobile SaaS Application

**Recession-Proof Products Auto** - AI-Powered Vehicle Diagnostics & Maintenance Platform

## 📋 Project Overview

RPP Auto is a comprehensive mobile SaaS application that provides:
- 🔍 AI-powered OBD2 vehicle diagnostics
- 📱 Native Android application
- 🤖 Multi-agent AI architecture
- 💰 Subscription-based SaaS model
- 🔧 Maintenance tracking & scheduling
- 👨‍🔧 Mechanic directory & appointments

## 🏗️ Architecture

### Technology Stack
- **Backend:** FastAPI + Python 3.11+
- **Database:** Supabase PostgreSQL
- **ORM:** SQLAlchemy 2.0
- **Authentication:** Supabase Auth + JWT
- **Payments:** Stripe
- **AI:** OpenRouter (Claude 3.5)
- **Mobile:** Android Kotlin
- **Deployment:** Docker + Cloud

### Database Schema
18 core tables covering:
- User management & preferences
- Vehicle registry & tracking
- OBD2 diagnostics & DTC codes
- AI diagnostic reports
- Maintenance schedules & records
- Mechanic directory & appointments
- Subscription & payments
- Community forum
- CMS & notifications

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL (via Supabase)
- Docker (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/Owwmann/RPP-Auto-Mobile-App.git
cd RPP-Auto-Mobile-App

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
# Edit .env with your API keys

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

### Docker Setup

```bash
# Build image
docker build -t rpp-auto-backend .

# Run container
docker-compose up -d
```

## 📁 Project Structure

```
RPP-Auto-Mobile-App/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Configuration
│   ├── database.py             # Database connection
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── vehicle.py
│   │   ├── diagnostic.py
│   │   └── ...
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── vehicle.py
│   │   └── ...
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── vehicles.py
│   │   │   ├── diagnostics.py
│   │   │   └── ...
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── vehicle_service.py
│   │   └── ...
│   ├── utils/                  # Utilities
│   │   ├── __init__.py
│   │   ├── security.py
│   │   └── ...
│   └── middleware/             # Custom middleware
│       ├── __init__.py
│       └── ...
├── alembic/                    # Database migrations
├── tests/                      # Test suite
├── .env.example                # Environment template
├── .gitignore
├── requirements.txt            # Python dependencies
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔑 Environment Variables

See `.env.example` for required configuration:
- Supabase credentials
- API keys (Motor DaaS, Auto.dev, OpenRouter, Stripe, etc.)
- JWT secrets
- External service credentials

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_auth.py
```

## 📚 API Documentation

Once running, access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Input validation with Pydantic

## 📈 Development Roadmap

### Phase 1: Foundation ✅
- [x] Database schema design
- [x] Project structure setup
- [ ] Core API endpoints
- [ ] Authentication system

### Phase 2: Core Features (Weeks 4-8)
- [ ] Vehicle management
- [ ] OBD2 integration
- [ ] AI diagnostics engine
- [ ] API integrations

### Phase 3: Advanced Features (Weeks 9-16)
- [ ] Subscription & payments
- [ ] Community forum
- [ ] Admin dashboard
- [ ] Mobile app development

### Phase 4: Launch (Weeks 17-22)
- [ ] Testing & QA
- [ ] Performance optimization
- [ ] Production deployment

## 📝 License

© 2026 RPP Auto. All rights reserved.

## 👥 Contributors

- AI Agent (Rube) - Initial development
- [@Owwmann](https://github.com/Owwmann) - Project Owner

## 📞 Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ by AI agents for the automotive community
