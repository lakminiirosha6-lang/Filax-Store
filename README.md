# 🎮 Filax Store - Gaming Topup Store & Admin Portal

> High-performance gaming top-up store built with **Next.js 14 App Router**, **Tailwind CSS**, **NextAuth Google Login**, and **Firebase Firestore**.

---

## ⚡ Key Highlights & Architecture

### 👑 Special Role-Based Access Control (RBAC) Rule
- **Super Admin Email**: `lakminiirosha6@gmail.com`
- **Display Role**: Strictly formatted as **`Admin`** in public labels, badges, and dashboard headers.
- **SUPER POWER Privilege**: Only `lakminiirosha6@gmail.com` possesses the exclusive power to see the **"Add New Owner"** button and assign new Owners/Admins.
- **Security Guard**: Any other user or standard Admin attempting this action receives an explicit **"Access Denied"** response.

---

## 📁 Repository Structure

```tree
filax-store/
├── app/
│   ├── admin/
│   │   ├── layout.tsx         # Admin layout (Session guard + Dark Neon Sidebar)
│   │   ├── page.tsx           # Dashboard HQ (Products, Payments, Users, Team cards)
│   │   ├── products/
│   │   │   └── page.tsx       # Products CRUD (Diamonds, UC, price editor, stock)
│   │   ├── payments/
│   │   │   └── page.tsx       # Payments CRUD (EzCash, Bank Transfer, PayHere)
│   │   ├── users/
│   │   │   └── page.tsx       # Users CRUD (Gmail, WhatsApp, Ban/Unban, Wallets)
│   │   └── team/
│   │       └── page.tsx       # Team Matrix (Super Admin 'Add New Owner' gate)
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts   # NextAuth Google Auth Route Handlers
│   ├── globals.css            # Dark theme, neon accents styling
│   ├── layout.tsx             # Root Layout
│   └── page.tsx               # Public Gaming Storefront
├── lib/
│   ├── roles.ts               # Super Admin definition & permission evaluator
│   ├── firebase.ts            # Firebase Firestore & Auth initialization
│   └── auth.ts                # NextAuth Google Provider & callbacks
├── middleware.ts              # Protects /admin/* routes with NextAuth
├── .env.example               # Environment variables template
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation & deployment guide
```

---

## 🚀 Setup & Local Development

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/filax-store.git
cd filax-store
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the values:
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="your-google-oauth-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
NEXT_PUBLIC_SUPER_ADMIN_EMAIL="lakminiirosha6@gmail.com"
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) to view the Admin Console.

---

## 🌐 Deploy to Vercel in 2 Minutes

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for Filax Store"
   git branch -M main
   git remote add origin https://github.com/<your-username>/filax-store.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `filax-store` repository.
4. Add the Environment Variables from your `.env.local` file.
5. Click **Deploy**. Vercel will build the Next.js 14 App Router project instantly.
