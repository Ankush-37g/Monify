# 💰 Monify — Personal Finance Manager

> A full-stack personal finance application with AI-powered insights, bank statement parsing, and smart budget tracking.

---

## ✨ Features

- 📊 **Dashboard** — Visual overview of income, expenses, and net balance with interactive charts
- 💵 **Income & Expense Tracking** — Log and categorize all your financial transactions
- 🎯 **Budget Management** — Set budgets per category and get alerted when you overspend
- 🤖 **AI Assistant** — Chat with an AI advisor powered by Mistral to get personalized spending insights
- 📄 **Bank Statement Parser** — Upload a PDF bank statement and automatically extract all transactions using OCR + LLM
- 🔐 **Authentication** — JWT-based auth with Google OAuth2 sign-in support
- 📧 **Email Notifications** — Automated budget alerts and reminders via Nodemailer
- 🖼️ **Profile Management** — Upload and manage profile pictures via Cloudinary
- ⏰ **Cron Jobs** — Scheduled background tasks for budget monitoring

---

## 🏗️ Architecture

Monify is a **monorepo** composed of three independent services:

```
Monify/
├── frontend/        # React + Vite client app
├── backend/         # Node.js + Express REST API
└── ai-service/      # Python FastAPI microservice (AI & OCR)
```

```
Browser ──► React Frontend
               │
               ▼
         Node.js Backend (Express)
          ├── MongoDB (Mongoose)
          ├── Cloudinary (images)
          ├── Nodemailer (email)
          └── Python AI Service (FastAPI)
                   └── Mistral AI (OCR + LLM)
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite 7 | UI framework & build tool |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Chart.js + react-chartjs-2 | Data visualization |
| Lucide React + React Icons | Icon library |
| Axios | HTTP client |
| React Toastify | Toast notifications |
| Google OAuth (`@react-oauth/google`) | Social login |
| Three.js | 3D animations |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Cloudinary + Multer | File / image uploads |
| Nodemailer | Email delivery |
| node-cron | Scheduled background tasks |
| Google Auth Library | OAuth2 token verification |
| Validator | Input validation |

### AI Service
| Technology | Purpose |
|---|---|
| Python + FastAPI | Microservice framework |
| Uvicorn | ASGI server |
| Mistral AI (mistralai SDK) | LLM + OCR |
| python-dotenv | Environment configuration |
| python-multipart | File upload handling |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **MongoDB** (Atlas or local)
- **Mistral AI API key** — [console.mistral.ai](https://console.mistral.ai)
- **Cloudinary account** — [cloudinary.com](https://cloudinary.com)
- **Google OAuth credentials** — [Google Cloud Console](https://console.cloud.google.com)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/monify.git
cd monify
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net

CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=30m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=15d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id

NODE_ENV=development

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# URL of the Python FastAPI AI microservice
PYTHON_AI_SERVICE_URL=http://localhost:8000
```

Start the development server:

```bash
npm run server      # with nodemon (hot reload)
# or
npm start           # without hot reload
```

The backend runs on **http://localhost:5000**.

---

### 3. AI Service Setup

```bash
cd ai-service
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `ai-service/`:

```env
MISTRAL_API_KEY=your_mistral_api_key
```

Start the service:

```bash
uvicorn main:app --reload --port 8000
```

The AI service runs on **http://localhost:8000**.
Interactive API docs available at **http://localhost:8000/docs**.

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

The frontend runs on **http://localhost:5173**.

---

## 📡 API Reference

### Auth & User — `/api/user`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login with email & password |
| POST | `/google-login` | Login via Google OAuth |
| POST | `/logout` | Logout current session |
| GET | `/me` | Get authenticated user profile |
| PUT | `/update` | Update profile info & avatar |

### Income — `/api/income`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/add` | Add income transaction |
| GET | `/all` | Get all income entries |
| DELETE | `/:id` | Delete an income entry |

### Expenses — `/api/expense`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/add` | Add expense transaction |
| GET | `/all` | Get all expense entries |
| DELETE | `/:id` | Delete an expense entry |

### Budgets — `/api/budget`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/add` | Create a budget |
| GET | `/all` | Get all budgets |
| DELETE | `/:id` | Delete a budget |

### AI — `/api/ai`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/parse` | Parse a PDF bank statement |
| POST | `/insights` | Get AI-powered spending insights |

---

## 📂 Project Structure

```
Monify/
│
├── frontend/
│   └── src/
│       ├── pages/          # Route-level page components
│       ├── components/     # Reusable UI components
│       ├── context/        # React context (auth, global state)
│       ├── Layout/         # App layout wrappers
│       └── utils/          # Helper functions
│
├── backend/
│   ├── controllers/        # Route handler logic
│   ├── models/             # Mongoose data models
│   ├── routes/             # Express route definitions
│   ├── middleware/         # Auth, error handling middleware
│   ├── database/           # DB connection setup
│   └── utils/              # Cron jobs, email helpers, etc.
│
└── ai-service/
    └── main.py             # FastAPI app with /parse and /insights endpoints
```

---

## 🌐 Deployment

| Service | Recommended Platform |
|---------|----------------------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) / [Railway](https://railway.app) |
| AI Service | [Render](https://render.com) (Docker or Python runtime) |
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |

> After deploying, update `CORS_ORIGIN` in backend `.env` and `VITE_BACKEND_URL` in frontend `.env` with your production URLs.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ by <strong>Ankush</strong>
</div>
