# FreshCart

<p align="center">
  <img src="public/Assets/images/freshcart-logo.svg" alt="FreshCart" width="220" />
</p>

<p align="center">
  A responsive online store built with Next.js and the Route E-commerce API.
</p>

<p align="center">
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img alt="React 19" src="https://img.shields.io/badge/React-19-149eca?logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript" />
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" />
</p>

FreshCart lets customers browse products, manage a cart and wishlist, save delivery addresses, and place orders. It includes account registration, sign-in, profile settings, and password recovery.

## Features

- Browse products, categories, subcategories, and brands.
- View product details and reviews.
- Register, sign in, recover a password, and manage profile settings.
- Add products to a cart or wishlist and manage them from their respective pages.
- Save and remove delivery addresses.
- Checkout and view order history.
- Responsive pages, accessible form feedback, loading states, and custom not-found UI.
- Terms of Service and Privacy Policy pages.

## Tech stack

- [Next.js 16](https://nextjs.org/) with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Redux Toolkit for shared client state
- TanStack Query for server data and caching
- NextAuth for authentication
- Route E-commerce API for store data

## Getting started

### Requirements

- Node.js 20 or newer
- npm
- A Route E-commerce API connection

### Install and run

```bash
git clone <your-repository-url>
cd <repository-folder>
npm install
```

Create a local environment file from the example:

```bash
# macOS / Linux
cp .env.example .env.local

# Windows PowerShell
Copy-Item .env.example .env.local
```

Update `.env.local` with your local settings, then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose | Example |
| --- | --- | --- |
| `API` | Server-only Route E-commerce API base URL (the `/api` root; `/api/v1` is also accepted) | `https://ecommerce.routemisr.com/api` |
| `NEXTAUTH_URL` | The app URL used by NextAuth | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret used to protect authentication sessions | Generate a long, random value |
| `NEXT_PUBLIC_SITE_URL` | Public site URL used for canonical metadata and sitemap links | `https://your-domain.com` |

Never commit `.env.local` or real secrets. `API` is read only by server-side code and must never use a `NEXT_PUBLIC_` prefix. For deployment, set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the public HTTPS domain. Replace the example domain before publishing.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Start the production server after building. |
| `npm run check` | Run lint and the production build. |

## Project structure

```text
app/                  App Router pages, layouts, and API route handlers
  (routes)/           Store, account, and authentication pages
  api/                Server-side API routes
_components/          Shared page sections and feature components
API/                  Route API request functions
components/ui/         Shared UI primitives
Schema/               Form validation schemas
interfaces/           Shared TypeScript interfaces
utilities/            Shared helpers
public/               Static images and other public assets
```

## API and data flow

The browser uses app API routes for protected account operations. These server routes read the authenticated session and forward supported requests to the Route E-commerce API, keeping the API token out of client-side code. Product and category data are loaded through the app's API functions.

The project uses the Route E-commerce API. Some operations, such as checkout and online payment, also depend on the API account and payment provider configuration.

## Production deployment

1. Configure `API`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and `NEXT_PUBLIC_SITE_URL` in your hosting provider.
2. Use the deployed HTTPS domain for both URL variables, and generate a unique secret for the production environment.
3. Run `npm run check` and deploy the project to a Node.js-compatible host, such as Vercel.
4. Configure the environment variables in the host before starting the deployment.
5. Use `/api/health` as a basic deployment health-check endpoint.

The app also provides `robots.txt` and `sitemap.xml`. Set `NEXT_PUBLIC_SITE_URL` to your real public domain so the sitemap and canonical URLs use the correct host.

## Contributing

1. Create a branch for your change.
2. Keep components and API logic consistent with the existing project structure.
3. Run `npm run check` before opening a pull request.

## License

No license has been specified yet. Add a `LICENSE` file before redistributing or reusing this project.
