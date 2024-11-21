import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../components/auth/AuthProvider";
import Navbar from '../components/layout/Navigation'
import Footer from '../components/layout/Footer'
import Chatbot from '../components/layout/Chatbot'
import LoadingWrapper from '../components/layout/LoadingWrapper'
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "KOS Yachts - Kings of The Sea Yacht Charters",
  description: "Prestigious yacht charters in Miami, Florida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <LoadingWrapper>
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </LoadingWrapper>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
