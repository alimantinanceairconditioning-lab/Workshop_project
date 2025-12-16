"use client";
import React, { useState } from "react";
import Button from "./ui/Button";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";
import { Phone, Menu, X, Home, Wrench, MessageCircle, Info, FolderOpen } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
      const headerHeight = 80; // Header height offset
      window.scrollTo({
        top: offsetTop - headerHeight,
        behavior: "smooth"
      });
      // Close mobile menu after click
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  const menuItems = [
    { name: t('nav.home'), icon: <Home size={20} />, link: "/", isExternal: true },
    { name: t('nav.services'), icon: <Wrench size={20}  /> ,link: "/services", isExternal: true },
    { name: t('nav.contact'), icon: <MessageCircle size={20} />, link: "/contact", isExternal: true },
    { name: t('nav.about'), icon: <Info size={20} />, link: "/about", isExternal: true },
    { name: t('nav.projects'), icon: <FolderOpen size={20} />, link: "/project-gallery", isExternal: true },
  ];

  return (
    <header className="bg-primaryBlue text-white w-full relative">
      <div className="flex items-center justify-between gap-2 md:gap-4 lg:gap-6 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-27 py-3 md:py-4">
        <div className="shrink-0 min-w-0 flex-1 lg:flex-none">
          <h1 className="text-[12px] sm:text-sm md:text-base lg:text-xl xl:text-2xl font-bold truncate lg:whitespace-nowrap">
            مؤسسة علي للتكييف والتبريد
          </h1>
        </div>

        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center gap-x-6 xl:gap-x-10 cursor-pointer">
            {menuItems.map((item) => (
              <li key={item.name} className="font-semibold text-base xl:text-lg relative header_list_hover whitespace-nowrap">
                {item.isExternal ? (
                  <Link href={item.link}>{item.name}</Link>
                ) : (
                  <Link
                    href={item.link}
                    onClick={(e) => handleSmoothScroll(e, item.link)}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <LanguageSwitcher />
          
          <a href="tel:0502575350" className="hidden sm:block">
            <Button
              type="button"
              icon={<Phone className="text-white" size={16} />}
              hoverIcon={<Phone className="text-accentYellow" size={16} />}
              className="px-3 md:px-4 lg:px-5 py-2 md:py-2.5 text-sm md:text-base whitespace-nowrap"
            >
              {t('nav.callNow')}
            </Button>
          </a>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-1.5 sm:p-2 text-white focus:outline-none hover:bg-white/10 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-primaryBlue shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
          <h2 className="text-lg font-bold">{t('nav.menu')}</h2>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="px-4 py-6">
          <ul className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className="font-semibold text-base py-3 border-b border-white/10 last:border-0 hover:text-accentYellow transition-colors cursor-pointer"
              >
                {item.isExternal ? (
                  <Link 
                    href={item.link}
                    className="flex items-center gap-3 w-full"
                  >
                    <span className="text-white">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <Link 
                    href={item.link}
                    onClick={(e) => handleSmoothScroll(e, item.link)}
                    className="flex items-center gap-3 w-full"
                  >
                    <span className="text-white">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </header>
  );
};

export default Header;
