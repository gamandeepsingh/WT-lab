
# Find Your Vibe

Find your vibe-event listing web application


## Demo

USER:https://event-listing-portal-user.vercel.app
ADMIN:https://event-listing-portal-admin.vercel.app
## Run Locally

Clone the project

```bash
  git clone https://github.com/Priyanshu-web-tech/Event-Listing-Portal.git
```

Go to the project directory

```bash
  cd Event-Listing-Portal
```
### Backend Setup

Go to the backend directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Create .env file & add the following in it:

```bash
MONGODB_URI=
PORT=
JWT_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
ORIGINS=
```

Start the server

```bash
  npm run dev
```
### Frontend Setup(ADMIN)

Go to the frontend directory

```bash
  cd frontend_Admin
```

Install dependencies

```bash
  npm install
```

Create .env file & add the following in it:

```bash
VITE_BASE_URL=
VITE_CKEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEOCODE_KEY=
```

Start the server

```bash
  npm run dev
```

### Frontend Setup(USER)

Go to the frontend directory

```bash
  cd frontend_User
```

Install dependencies

```bash
  npm install
```

Create .env file & add the following in it:

```bash
VITE_BASE_URL=
VITE_CKEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_EMAIL_JS_SERVICE_ID=
VITE_EMAIL_JS_TEMPLATE_ID=
VITE_EMAIL_JS_PUBLIC_KEY=
VITE_GEOCODE_KEY=
```

Start the server

```bash
  npm run dev
```


## Tech Stack

**Client:** React, Redux Tool Kit, TailwindCSS

**Server:** Node, Express

**Database:** MongoDB with ORM-Mongoose

**Google Auth:** Firebase
