"use client";
import { usePathname } from "next/navigation";
import StoreProvider from "@/lib/store/StoreProvider";
import { LanguageProvider } from "@/lib/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <StoreProvider>{children}</StoreProvider>;
  }

  return (
    <LanguageProvider>
      <StoreProvider>
        <Header />
        <main className="grow">{children}</main>
        <Footer />
      </StoreProvider>
    </LanguageProvider>
  );
}
