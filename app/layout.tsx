import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toast"
import "./globals.css";
import NavbarShell from "@/_components/layout/navbar/NavbarShell";
import Footer from "@/_components/layout/footer/Footer";
import Provider from './../_components/Provider/Provider';
import Providers from './../_components/Provider/makeQueryClient';
import ReduxProvider from '@/_components/Provider/ReduxProvider';
import { getAppInitialData } from '@/API/initialData'
import type { RootState } from '@/lib/store'

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: {
    default: "FreshCart | Shop everyday essentials",
    template: "%s | FreshCart",
  },
  description: "Shop quality products and everyday essentials with FreshCart. Browse products, manage your cart, and place your order online.",
  applicationName: "FreshCart",
  keywords: ["FreshCart", "online shopping", "groceries", "everyday essentials"],
  openGraph: {
    type: "website",
    siteName: "FreshCart",
    title: "FreshCart | Shop everyday essentials",
    description: "Shop quality products and everyday essentials with FreshCart.",
  },
  twitter: {
    card: "summary",
    title: "FreshCart | Shop everyday essentials",
    description: "Shop quality products and everyday essentials with FreshCart.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { session, categories, initialCart, initialWishlist } = await getAppInitialData()
  const initialState: Partial<RootState> = {
    cart: { data: initialCart ?? null, itemCount: initialCart?.data?.products.reduce((sum, item) => sum + item.count, 0) ?? initialCart?.numOfCartItems ?? 0 },
    ...(initialWishlist ? { wishlist: initialWishlist.map(product => product._id) } : {}),
  }
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider initialState={initialState}>
         <Providers initialCart={initialCart} initialWishlist={initialWishlist}>
          <Provider session={session}>
            <NavbarShell categories={categories} />
            <main className="min-h-screen pt-17 lg:pt-26.5">
              <Toaster />
              {children}
            </main>
            <Footer />
          </Provider>
         </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
