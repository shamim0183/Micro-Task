# 🚀 TaskEarn - Micro-Task and Earning Platform

A comprehensive full-stack MERN application that connects workers with micro-task opportunities and enables buyers to get work done efficiently through a coin-based payment system.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)

---

## 🎯 Live Demo

- **Client**: [Coming Soon]
- **Server API**: [Coming Soon]

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- Firebase Authentication integration
- JWT-based session management
- Role-based access control (Admin, Buyer, Worker)
- Secure password handling

### 💼 For Buyers

- Create and manage micro-tasks
- Purchase coins via Stripe
- Track task submissions
- Review and approve worker submissions
- Payment history tracking

### 👷 For Workers

- Browse available tasks
- Submit work with file uploads
- Earn coins for approved submissions
- Request withdrawals
- Track submission history with pagination

### 🛡️ For Admins

- Manage users (update roles, coins)
- Monitor all tasks
- Approve/reject withdrawal requests
- View platform statistics
- Payment tracking

### 💳 Payment System

- Stripe integration for coin purchases
- Secure payment processing
- Multiple coin packages
- Transaction history
- Admin payment oversight

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Framer Motion
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Carousel**: Swiper.js

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Admin SDK + JWT
- **Payment**: Stripe API
- **File Upload**: ImgBB API
- **Email**: EmailJS
- **Security**: Helmet, CORS, Rate Limiting

---

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Firebase project
- Stripe account (test mode)
- ImgBB API key
- EmailJS account

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/shamim0183/Micro-Task.git
cd Micro-Task
```

### 2. Install dependencies

**Client:**

```bash
cd client
npm install
```

**Server:**

```bash
cd server
npm install
```

### 3. Environment Variables

**Client** (`client/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_id
```

**Server** (`server/.env`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
FIREBASE_PROJECT_ID=your_project_id
STRIPE_SECRET_KEY=sk_test_your_secret_key
IMGBB_API_KEY=your_imgbb_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_key
EMAILJS_SERVICE_ID=service_id
CLIENT_URL=http://localhost:3000
```

### 4. Run the application

**Development mode:**

Terminal 1 (Server):

```bash
cd server
npm run dev
```

Terminal 2 (Client):

```bash
cd client
npm run dev
```

Visit: `http://localhost:3000`

---

## 👤 Test Accounts

### Admin

- **Email**: admin@taskearn.com
- **Password**: Admin@12345

### Buyer

- **Email**: as@as.com
- **Password**: As@123

### Worker

- **Email**: sa@sa.com
- **Password**: As@123

---

## 🧪 Testing Stripe Payments

Use Stripe test card:

```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

---

## 📁 Project Structure

```
Micro-Task/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities
│   └── public/            # Static assets
│
└── server/                # Node.js backend
    └── src/
        ├── controllers/   # Business logic
        ├── models/        # MongoDB schemas
        ├── routes/        # API routes
        ├── middleware/    # Auth, validation
        └── config/        # Database, Firebase
```

---

## 🚀 Deployment

### Vercel (Recommended)

**Client:**

1. Push code to GitHub
2. Import project to Vercel
3. Set root directory to `client`
4. Add environment variables
5. Deploy

**Server:**

1. Create new Vercel project
2. Set root directory to `server`
3. Add `vercel.json`:

```json
{
  "version": 2,
  "builds": [{ "src": "src/server.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/server.ts" }]
}
```

4. Add environment variables
5. Deploy

---

## 🔒 Security Features

- JWT-based authentication
- Firebase Auth integration
- Role-based access control
- Helmet security headers
- CORS configuration
- Rate limiting
- Input sanitization
- Secure password storage

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Developer

**Shamim Hossain**

- GitHub: [@shamim0183](https://github.com/shamim0183)
- Email: shamim.hossaain@gmail.com

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Stripe for payment processing
- Firebase for authentication
- MongoDB for database
- All contributors and supporters

---

**⭐ Star this repository if you find it helpful!**
