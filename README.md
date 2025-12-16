# Ali Air Conditioning & Refrigeration | مؤسسة علي للتكييف والتبريد

A modern, full-stack web application for managing air conditioning and refrigeration services. Built with Next.js 16, TypeScript, MongoDB, and Redux Toolkit.

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.10-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-cyan)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Admin Panel](#-admin-panel)
- [Deployment](#-deployment)

## ✨ Features

### Public Website
- 🏠 **Responsive Homepage** with multiple sections (Hero, Services, Projects, Why Choose Us, Contact)
- 🛠️ **Service Showcase** with dynamic service cards, detailed pages, and image galleries
- 📸 **Project Gallery** with interactive lightbox and multi-image projects
- 📞 **Contact Form** with real-time validation and email notifications
- 🌐 **Full Bilingual Support** (English & Arabic) with RTL layout support
- 🔍 **SEO Optimized** with dynamic meta tags, sitemap, and robots.txt
- 📱 **Mobile-First Design** with smooth scrolling navigation and touch-friendly UI
- ⚡ **Dynamic Content** - Services and Projects loaded from database with Arabic translations
- 🎨 **Modern UI/UX** with Swiper carousels, smooth animations, and interactive components

### Admin Panel
- 🔐 **Secure Authentication** with JWT and HTTP-only cookies (7-day session)
- 📊 **Dashboard Analytics** with interactive charts (Recharts) and real-time statistics
- ⚙️ **Service Management** (Full CRUD with bilingual support - English & Arabic)
  - Add services with name, short description, long description, features, FAQs
  - Upload service images to Cloudinary with automatic optimization
  - Optional SEO fields (metaTitle, metaDescription)
  - Status management (Active/Inactive)
- 🖼️ **Project Management** with bilingual support and multi-image upload
  - Add title and description in both English and Arabic
  - Upload multiple images per project with Cloudinary integration
  - Automatic image deletion on project removal
- 💬 **Inquiry Tracking** with comprehensive status management
  - View all customer inquiries with detailed information
  - Status tracking: Pending, In Progress, Completed, Cancelled
  - Filter and search capabilities
- 📈 **Real-time Statistics** showing inquiry distribution and trends
- 🌍 **Page-Level SEO Management** for each public page
- 🔒 **Protected Routes** with middleware authentication and automatic redirects

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.0.1](https://nextjs.org/) (App Router with Turbopack)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI Framework**: [React 19.2.0](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom design system
- **State Management**: [Redux Toolkit 2.10.1](https://redux-toolkit.js.org/)
- **Internationalization**: [next-intl 4.5.5](https://next-intl-docs.vercel.app/) for bilingual support
- **Carousel/Slider**: [Swiper 12.0.3](https://swiperjs.com/)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Charts**: [Recharts 3.3.0](https://recharts.org/) for dashboard analytics
- **Image Optimization**: [Sharp 0.34.5](https://sharp.pixelplumbing.com/)

### Backend
- **Database**: [MongoDB 7.0](https://www.mongodb.com/) with [Mongoose ODM 8.19.3](https://mongoosejs.com/)
- **Authentication**: JWT (jsonwebtoken 9.0.2) with HTTP-only cookies
- **Password Hashing**: [bcryptjs 3.0.3](https://www.npmjs.com/package/bcryptjs) (12 salt rounds)
- **Image Storage**: [Cloudinary 2.8.0](https://cloudinary.com/) with [next-cloudinary 6.17.4](https://next-cloudinary.spacejelly.dev/)
- **Email Service**: [Resend 6.4.2](https://resend.com/) for contact form notifications
- **URL Slugs**: [slugify 1.6.6](https://www.npmjs.com/package/slugify) for SEO-friendly URLs

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Code Quality**: TypeScript strict mode

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- MongoDB database (local or cloud)
- Cloudinary account for image uploads
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hashimgujjar447/alaa-cooling-website.git
   cd alaa-cooling-website
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   
   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Environment
   NODE_ENV=development
   ```

4. **Create an admin user** (first-time setup)
   
   You'll need to manually create an admin user in MongoDB or create a seed script. The password will be automatically hashed by the model's pre-save hook.

5. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT token signing | ✅ Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ Yes |
| `NODE_ENV` | Environment (development/production) | ⚠️ Recommended |

## 📁 Project Structure

```
workshop_project/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── admin/                    # Admin panel pages
│   │   ├── dashboard/            # Dashboard page
│   │   ├── services/             # Services management
│   │   ├── projects/             # Projects management
│   │   ├── contacts/             # Contact inquiries
│   │   └── login/                # Admin login
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── service/              # Service CRUD
│   │   ├── project/              # Project CRUD
│   │   ├── contact/              # Contact CRUD
│   │   └── upload/               # Image upload
│   └── project-gallery/          # Public project gallery
├── components/                   # React components
│   ├── Header.tsx                # Navigation header
│   ├── Footer.tsx                # Footer section
│   ├── LayoutWrapper.tsx         # Layout controller
│   ├── admin/                    # Admin components
│   │   ├── Sidebar.tsx           # Admin sidebar
│   │   ├── DashboardStats.tsx    # Statistics cards
│   │   └── ...
│   ├── home-sections/            # Homepage sections
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Contact.tsx
│   │   └── ...
│   └── ui/                       # Reusable UI components
│       ├── Button.tsx
│       ├── FormField.tsx
│       └── ServiceCard.tsx
├── lib/                          # Core utilities
│   ├── db.js                     # MongoDB connection
│   ├── auth.ts                   # JWT utilities
│   ├── models/                   # Mongoose models
│   │   ├── admin.model.ts
│   │   ├── service.model.ts
│   │   ├── project.model.ts
│   │   └── contact.model.ts
│   └── store/                    # Redux store
│       ├── index.ts
│       ├── hooks.ts
│       ├── StoreProvider.tsx
│       └── slices/               # Redux slices
│           ├── servicesSlice.ts
│           ├── projectsSlice.ts
│           └── contactsSlice.ts
├── utils/                        # Helper functions
│   ├── cloudinary.js             # Cloudinary config
│   └── uploadImageDirect.js      # Image upload helper
├── public/                       # Static assets
│   └── images/
├── middleware.ts                 # Next.js middleware (route protection)
├── next.config.ts                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS config
└── tsconfig.json                 # TypeScript configuration
```

## 🔌 API Documentation

### Authentication

#### POST `/api/auth/login`
Login admin user and receive JWT token in HTTP-only cookie.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin Name",
    "role": "admin"
  }
}
```

#### POST `/api/auth/logout`
Clear authentication cookie.

#### GET `/api/auth/session`
Check if user is authenticated.

### Services

#### GET `/api/service`
Fetch all services with bilingual content.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "AC Installation",
      "nameAr": "تركيب المكيفات",
      "shortDescription": "Professional AC installation...",
      "shortDescriptionAr": "تركيب احترافي للمكيفات...",
      "longDescription": "Complete installation service...",
      "longDescriptionAr": "خدمة تركيب كاملة...",
      "features": ["Feature 1", "Feature 2"],
      "featuresAr": ["ميزة 1", "ميزة 2"],
      "faqs": [{"question": "...", "answer": "..."}],
      "faqsAr": [{"question": "...", "answer": "..."}],
      "image": "cloudinary_url",
      "slug": "ac-installation",
      "status": "Active",
      "metaTitle": "...",
      "metaDescription": "..."
    }
  ]
}
```

#### POST `/api/service`
Create a new service with bilingual support (requires admin auth).

**Request:** FormData with fields:
- `name`: string (required)
- `nameAr`: string (optional, Arabic name)
- `shortDescription`: string (required)
- `shortDescriptionAr`: string (optional)
- `longDescription`: string (required)
- `longDescriptionAr`: string (optional)
- `features`: JSON string array (required)
- `featuresAr`: JSON string array (optional)
- `faqs`: JSON string array of {question, answer} (required)
- `faqsAr`: JSON string array of {question, answer} (optional)
- `image`: File (optional, uploaded to Cloudinary)
- `status`: "Active" | "Inactive" (default: "Active")
- `metaTitle`: string (optional, for SEO)
- `metaDescription`: string (optional, for SEO)

#### PATCH `/api/service/[id]`
Update service (supports partial updates).

#### DELETE `/api/service/[id]`
Delete a service and its associated Cloudinary image.

### Contacts

#### GET `/api/contact`
Fetch all contact inquiries.

#### POST `/api/contact`
Submit a contact form.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "serviceType": "AC Installation",
  "phoneNumber": "+1234567890",
  "message": "I need AC installation..."
}
```

#### PATCH `/api/contact/[id]`
Update inquiry status.

#### DELETE `/api/contact/[id]`
Delete an inquiry.

### Projects

#### GET `/api/project`
Fetch all projects with bilingual content.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Project Title",
      "titleAr": "عنوان المشروع",
      "description": "Project description...",
      "descriptionAr": "وصف المشروع...",
      "images": ["cloudinary_url1", "cloudinary_url2"],
      "createdAt": "2025-11-22T...",
      "updatedAt": "2025-11-22T..."
    }
  ]
}
```

#### POST `/api/project`
Create a new project with bilingual support.

**Request Body:**
```json
{
  "title": "Project Title",
  "titleAr": "عنوان المشروع",
  "description": "Project description (min 10 chars)...",
  "descriptionAr": "وصف المشروع (اختياري)...",
  "images": ["cloudinary_url1", "cloudinary_url2"]
}
```

**Validation:**
- `title`: Required, English title
- `titleAr`: Optional, Arabic title (min 3 chars if provided)
- `description`: Required, English description (min 10 chars)
- `descriptionAr`: Optional, Arabic description (min 10 chars if provided)
- `images`: Required, array with at least one image URL

#### GET `/api/project/[id]`
Fetch a single project by ID.

#### PATCH `/api/project/[id]`
Update a project (automatically deletes removed images from Cloudinary).

#### DELETE `/api/project/[id]`
Delete a project and all associated Cloudinary images.

## 👨‍💼 Admin Panel

### Access
- URL: `/admin/login`
- Protected routes: `/admin/*`
- Authentication: JWT stored in HTTP-only cookies
- Session duration: 7 days

### Features
- **Dashboard**: Overview with statistics and charts
- **Services Management**: Add, edit, delete services with images
- **Projects Management**: Manage project gallery with multiple images
- **Contacts Management**: View and track customer inquiries with status updates
- **Analytics**: Visual charts showing inquiry distribution and trends

### Default Admin Setup
Create an admin user in MongoDB with the following structure:
```javascript
{
  email: "admin@example.com",
  password: "your_plain_password", // Will be auto-hashed by Mongoose pre-save hook
  name: "Admin Name",
  role: "admin",
  isActive: true
}
```

### Bilingual Content Management
The admin panel supports adding content in both English and Arabic:
- **Required Fields**: English content (name, description, etc.)
- **Optional Fields**: Arabic translations (nameAr, descriptionAr, etc.)
- **Automatic Fallback**: If Arabic content is not provided, the system uses:
  1. Database Arabic fields (if available)
  2. Static translation files (`serviceTranslations.ts`, `projectTranslations.ts`)
  3. English content as last resort
- **RTL Support**: Arabic input fields automatically display right-to-left

## 🎨 Theming

Custom color palette defined in `globals.css`:

```css
--color-heroBlue: #006FF1
--color-primaryBlue: #1E3A8A
--color-accentPurple: #9747FF
--color-accentYellow: #FFD447
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Railway
- Render

**Build Command:**
```bash
pnpm build
```

**Start Command:**
```bash
pnpm start
```

## 📝 Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 🔒 Security Features

- **JWT Authentication** with HTTP-only cookies (7-day expiry)
- **Password Hashing** with bcryptjs (12 salt rounds)
- **CSRF Protection** via SameSite cookies
- **XSS Protection** through HTTP-only cookies
- **Input Validation** on all forms (client & server-side)
- **File Upload Security**:
  - Type validation (images only)
  - Size limits enforced
  - Cloudinary secure upload
- **Protected API Routes** with middleware authentication
- **Mongoose Schema Validation** with strict type checking
- **Environment Variables** for sensitive data
- **Automatic Session Expiry** and token verification

## 🌍 Internationalization (i18n)

The application fully supports English and Arabic:

- **Static Content**: Using `next-intl` with JSON translation files (`messages/en.json`, `messages/ar.json`)
- **Dynamic Content**: Bilingual database fields for Services and Projects
- **Translation Fallback System**:
  ```
  Database Arabic field → Static translation file → English content
  ```
- **RTL Layout Support**: Automatic direction switching for Arabic
- **Language Switcher**: Component in header for easy language switching
- **SEO**: Proper `lang` and `dir` attributes for better search engine indexing

## 📦 Key Features Implementation

### Image Upload System
- **Direct Upload**: Client uploads to Cloudinary via `/api/upload`
- **Automatic Optimization**: WebP format with quality 75
- **Organized Storage**: Folder structure (services/, projects/)
- **Cleanup**: Automatic deletion when content is removed
- **Multi-upload**: Support for multiple images in projects

### State Management (Redux)
Three main slices:
- `servicesSlice`: Manages all service-related data and operations
- `projectsSlice`: Handles project gallery with bilingual support
- `contactsSlice`: Tracks customer inquiries and status updates

### SEO Optimization
- **Dynamic Meta Tags**: Per-page SEO management
- **Sitemap Generation**: Automatic sitemap.xml for all public pages
- **Robots.txt**: Configured for optimal crawling
- **Manifest**: PWA-ready with site.webmanifest
- **Structured Data**: Proper semantic HTML structure
- **Optimized Images**: Next.js Image component with lazy loading

## 📄 License

This project is private and proprietary.

## 👥 Contact

**Ali Air Conditioning & Refrigeration**  
مؤسسة علي للتكييف والتبريد

For support or inquiries, please contact through the website's contact form.

---

Built with ❤️ using Next.js and TypeScript
