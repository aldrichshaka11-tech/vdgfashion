import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./context/StoreContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: "Vdgfashion | Curated Streetwear & Fashion Dashboard Boutique",
  description: "Express your unique style with premium catalog drops. Explore baby pink comfort hoodies, emerald green oversized tees, blue denim jeans, and minimal leather trainers.",
  keywords: "fashion, streetwear, vdgfashion, e-commerce dashboard, boutique apparel",
  openGraph: {
    title: "Vdgfashion - Express Your Unique Style",
    description: "Shop premium hoodies, tees, and retro canvas cargo items in our boutique dashboard storefront.",
    url: "https://vdgfashion.com",
    siteName: "Vdgfashion",
    images: [
      {
        url: "/products/tshirt_green.png",
        width: 800,
        height: 600,
        alt: "Vdgfashion Storefront",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
