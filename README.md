# 📖 BookNook – A Small Online Library

**Live Application URL**: [https://b14-a8-cat-ron.vercel.app](https://b14-a8-cat-ron.vercel.app) *(or your deployed live site)*  
**Client Repository**: [https://github.com/JakariaHoque242/B14-A8-Cat_Ron-client](https://github.com/JakariaHoque242/B14-A8-Cat_Ron-client)  
**Server Repository**: [https://github.com/JakariaHoque242/B14-A8-Cat_Ron-server](https://github.com/JakariaHoque242/B14-A8-Cat_Ron-server)  

BookNook is an online library application engineered with Next.js (App Router), TypeScript, Tailwind CSS, and BetterAuth with MongoDB. It offers an intuitive, accessible experience inspired by modern library catalogs and editorial design: **Add a book, borrow a book, return a book.**

---

## 🌟 Key Features

1. **BetterAuth & JWT Protected Architecture**: Seamless authentication powered by BetterAuth with the MongoDB adapter, Google OAuth, and signed JWT validation for secured REST API operations.
2. **Atomic Inventory & Real-Time Stock Management**: Live inventory tracking where borrowing a book decreases available copies by 1 with MongoDB's `$inc: { copies: -1 }`, and returning it increases copies by 1 with `$inc: { copies: 1 }`.
3. **No Double-Borrow Safeguard**: Robust backend validation ensuring a user cannot actively borrow the same book twice simultaneously, returning clear toast feedback.
4. **Dynamic Swiper.js Hero & New Arrivals**: Interactive multi-slide banner built with Swiper.js, accompanied by a dynamic New Arrivals section featuring the latest 6 additions loaded directly from MongoDB with sort and limit.
5. **Full CRUD & Lending Dashboard**: Complete management suite allowing users to add books with ImgBB upload or image URLs, view details with stock badges, update pre-filled forms, delete with custom confirm modals, and return books from an active borrows ledger.
6. **Zero-Error Reload Resiliency & Dark/Light Mode**: Private routes and user authentication states persist gracefully across page refreshes without premature login redirects. Includes a dark/light theme switchable from the navbar.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons, Custom Fonts (Merriweather & Inter)
- **Authentication**: BetterAuth with MongoDB Adapter & JSON Web Tokens (JWT)
- **Interactive UI**: Swiper.js (Carousel Slider), React Hot Toast (No default alerts)
- **Backend API**: Express.js, MongoDB Native Driver

---

## 📂 Project Structure

```
booknook-client/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with ThemeProvider, AuthProvider, and Toaster
│   │   ├── page.tsx           # Home page (Swiper banner, New Arrivals, Extra sections)
│   │   ├── books/             # All Books catalog with search & category filters
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx  # Book Details with Borrow Modal & copy status
│   │   ├── add-book/          # Private route: Add new book (ImgBB upload + URL)
│   │   ├── my-books/          # Private route: User's added books (Edit modal + Delete modal)
│   │   ├── my-borrows/        # Private route: Active loans ledger & Return book action
│   │   ├── login/             # User Login form with Google OAuth
│   │   ├── register/          # User Register with real-time password criteria validation
│   │   ├── not-found.tsx      # Custom 404 page with "Back to Home"
│   │   └── api/               # BetterAuth API handler & JWT token issuance route
│   ├── components/            # Navbar, Footer, BookCard, BannerSlider, BorrowModal, etc.
│   ├── context/               # AuthContext & ThemeContext
│   ├── lib/                   # API client, BetterAuth server/client instances
│   └── types/                 # TypeScript interfaces (Book, Borrow, User, AuthContext)
```

---

## ⚙️ Environment Variables

Create `.env.local` inside `booknook-client`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# BetterAuth & MongoDB Configuration
BETTER_AUTH_SECRET=your_super_secret_session_key
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_signing_secret

# Optional ImgBB Upload
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
```

---

## 💻 Getting Started Locally

1. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
