import { Inter } from "next/font/google";
import "../styles/global.css";

import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { NotificationProvider } from "@/providers/notification/notifications";
import ContactCTA from "@/components/modals/contact-us";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body>
        <NotificationProvider>
          <NavBar />
          <main>{children}</main>
          <Footer />
          <ContactCTA />
        </NotificationProvider>
      </body>
    </html>
  );
}
