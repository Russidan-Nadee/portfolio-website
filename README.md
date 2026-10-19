# Portfolio Website

Personal portfolio website of Russidan Nadee with multilingual support built with Next.js and TypeScript

## 📋 Project Overview

A personal portfolio website designed to showcase development skills, work experience, and various projects, focusing on modern technology usage and good user experience.

## ✨ Key Features

- **Multilingual Support**: Thai, English, Japanese with real-time language switching system
- **Dark/Light Mode**: Theme switching according to preference
- **Responsive Design**: Works well on all devices (mobile, tablet, computer)
- **Portfolio Display**: Project gallery with filter system
- **Personal Information**: About page showing experience and skills
- **Easy Contact**: Multiple contact channels integrated
- **SEO Optimized**: Optimized for Search Engines

## 🛠 Technologies Used

### Frontend

- **Framework**: Next.js 15.3.5 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animations**: GSAP 3.13.0, Framer Motion 12.23.1
- **Icons**: React Icons 5.5.0, Lucide React 0.525.0

### Development Tools

- **Linting**: ESLint 9
- **Fonts**: Geist, Inter (Google Fonts), IBM Plex Sans Thai, Noto Sans JP

## 🚀 Installation and Running

### System Requirements

- Node.js 20+
- npm, yarn, pnpm or bun

### Installation Steps

1. **Clone repository**

```bash
git clone https://github.com/Russidan-Nadee/portfolio.git
cd portfolio-website
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run in development mode**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open browser**
   Go to [http://localhost:3000](http://localhost:3000)

### Database connections

Copy `.env.example` to `.env` and fill in your Supabase credentials. Use separate connection URLs:

- `DATABASE_URL`: the Supabase transaction pooler on port `6543`, with `?pgbouncer=true`, for the running app.
- `DIRECT_URL`: the session pooler on port `5432` (or a direct database connection) for Prisma migrations. `prisma.config.ts` reads this variable first, with `DATABASE_URL` as a fallback for older setups.

Set both variables in the deployment environment too, then redeploy. Changing local `.env` does not update Vercel. Restart the local dev server after changing a connection URL so its Prisma client opens a new pool. No database schema migration is required for this change.

See [Supabase's Prisma guide](https://supabase.com/docs/guides/database/prisma) for the connection modes.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── portfolio/         # Portfolio page and subpages
│   ├── legal/             # Privacy Policy, Terms pages
│   └── globals.css        # Global styles
├── components/            # React Components
│   ├── home/             # Homepage components
│   ├── about/            # About page components
│   ├── contact/          # Contact page components
│   ├── portfolio/        # Portfolio page components
│   ├── layout/           # Header, Footer, Theme Provider
│   └── ui/               # General UI Components
├── data/                 # Project data
│   └── projects/         # Project data for each language
└── locales/              # Translation files (JSON)
    ├── en.json           # English
    ├── th.json           # Thai
    └── ja.json           # Japanese
```

## 🌍 Multilingual System

The website supports 3 languages:

- 🇹🇭 **Thai** - Main language
- 🇺🇸 **English** - International language
- 🇯🇵 **Japanese** - Japanese language

The system will remember the selected language in localStorage and can be changed in real-time

## 🎨 Theme System

- **Light Mode**: Light theme (default)
- **Dark Mode**: Dark theme
- **Auto Detection**: Automatic system theme detection

## 📱 Responsive Design

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🏗 Build and Deploy

### Build for Production

```bash
npm run build
```

### Build with Static Export

```bash
npm run build:static
```

### Create ZIP file

```bash
npm run build:zip
```

## 📄 Website Pages

- **Homepage** (`/`): Introduction and overview
- **About** (`/about`): Experience, skills, and education
- **Portfolio** (`/portfolio`): Display all projects
- **Contact** (`/contact`): Contact channels
- **Privacy Policy** (`/legal/privacy-policy`)
- **Terms of Service** (`/legal/terms-of-service`)

## 🎯 Projects Displayed in Portfolio

1. **RFID Asset Management System** - Flutter, Node.js, MySQL
2. **Portfolio Website** - Next.js, TypeScript, Tailwind CSS
3. **Asset Management Mobile App** - Flutter, Node.js, Express, MySQL
4. **Advanced Calculator App** - Python, Tkinter

## 📞 Contact Information

- **Email**: russidan.nadee@gmail.com
- **Phone**: +66 93-108-9420
- **GitHub**: [Russidan-Nadee](https://github.com/Russidan-Nadee)
- **LinkedIn**: [russidan-nadee](https://www.linkedin.com/in/russidan-nadee-1734a2352/)
- **Location**: Bangkok, Thailand

## 📜 License

© 2025 Russidan Nadee. All rights reserved.

## 🔧 Configuration

### Vercel Web Analytics and Environment Variables

The `/admin` traffic dashboard uses Vercel Web Analytics. Enable Web Analytics in your Vercel project before using the dashboard.

In the Vercel project settings, add these server-only environment variables:

- `VERCEL_ACCESS_TOKEN`: a Vercel access token that can read Web Analytics data. Keep this token server-only and never expose it to client-side code.
- `VERCEL_PROJECT_ID`: the Vercel project ID. You can set this explicitly or enable Vercel's automatic **System Environment Variables** so the project ID is available automatically.
- `VERCEL_TEAM_ID` (optional): add this for team-owned projects. Personal projects do not need it.

Redeploy after enabling Web Analytics or changing these environment variables so the dashboard can load the latest configuration.

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Known Issues

- No localStorage for artifacts according to Claude.ai restrictions
- External scripts usage limited to cdnjs.cloudflare.com CDN only

## 🚧 Development Notes

- Uses `--turbopack` flag for development server
- ESLint and TypeScript errors are set to ignore during build
- Supports Static Export for multiple deployment options
