"use client";
import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { ChevronUp } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

// Types
type TextLink = { href: string; label: string };

// Reusable Components
function FooterSection({ 
  title, 
  children, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="border-b border-white/20 lg:border-none">
      {/* Mobile: Collapsible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 lg:hidden text-white"
      >
        <h3 className="text-base font-semibold">{title}</h3>
        <ChevronUp 
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      {/* Mobile: Collapsible Content */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 pb-4' : 'max-h-0'
      }`}>
        {children}
      </div>

      {/* Desktop: Always Visible */}
      <div className="hidden lg:block">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function FooterLinkList({ links }: { links: TextLink[] }) {
  return (
    <ul className="space-y-2">
      {links.map((link, idx) => (
        <li key={idx}>
          <a 
            href={link.href} 
            className="text-white/80 hover:text-white text-sm transition-colors inline-block"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

// Main Footer Component
export default function Footer() {
  const { t } = useLanguage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    household: false,
    business: false,
    buy: false,
    service: false,
    about: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const householdLinks: TextLink[] = [
    { href: "/services", label: t('footer.airConditioners') },
    { href: "/services", label: t('footer.refrigerators') },
    { href: "/services", label: t('footer.freezers') },
    { href: "/services", label: t('footer.washingMachines') },
    { href: "/services", label: t('footer.kitchenAppliances') },
    { href: "/services", label: t('footer.microwaveOvens') },
  ];

  const businessLinks: TextLink[] = [
    { href: "/services", label: t('footer.commercialAC') },
    { href: "/services", label: t('footer.commercialRefrig') },
  ];

  const buyLinks: TextLink[] = [
    { href: "/contact", label: t('footer.contactDealer') },
  ];

  const serviceLinks: TextLink[] = [
    { href: "/services", label: t('footer.serviceVideos') },
    { href: "/contact", label: t('footer.troubleshooting') },
    { href: "/contact", label: t('footer.manualDownload') },
    { href: "/contact", label: t('footer.serviceAppointment') },
    { href: "/contact", label: t('footer.warrantyDeclaration') },
  ];

  const aboutLinks: TextLink[] = [
    { href: "/about", label: t('footer.aboutAliAC') },
    { href: "/contact", label: t('footer.contactUs') },
    { href: "/contact", label: t('footer.investorRelations') },
    { href: "/about", label: t('footer.news') },
    { href: "/about", label: t('footer.importantNotice') },
    { href: "/about", label: t('footer.mediaKit') },
  ];

  return (
    <footer className="bg-[#0A4897] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 lg:gap-8">
          {/* Household */}
          <FooterSection 
            title={t('footer.household')}
            isOpen={openSections.household}
            onToggle={() => toggleSection('household')}
          >
            <FooterLinkList links={householdLinks} />
          </FooterSection>

          {/* Business */}
          <FooterSection 
            title={t('footer.business')}
            isOpen={openSections.business}
            onToggle={() => toggleSection('business')}
          >
            <FooterLinkList links={businessLinks} />
          </FooterSection>

          {/* Buy */}
          <FooterSection 
            title={t('footer.buy')}
            isOpen={openSections.buy}
            onToggle={() => toggleSection('buy')}
          >
            <FooterLinkList links={buyLinks} />
          </FooterSection>

          {/* Service & Support */}
          <FooterSection 
            title={t('footer.serviceSupport')}
            isOpen={openSections.service}
            onToggle={() => toggleSection('service')}
          >
            <FooterLinkList links={serviceLinks} />
          </FooterSection>

          {/* About Ali AC */}
          <FooterSection 
            title={t('footer.aboutCompany')}
            isOpen={openSections.about}
            onToggle={() => toggleSection('about')}
          >
            <FooterLinkList links={aboutLinks} />
          </FooterSection>

          {/* Logo & Social Media - Desktop Only */}
          <div className="hidden lg:flex flex-col items-end justify-between">
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-6 whitespace-nowrap">
                {t('footer.companyName')}
              </h2>
           
              <div className="flex gap-3 justify-end">
                <a 
                  href="https://www.facebook.com/share/17RmZi2P4i/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#3b5998] hover:bg-[#2d4373] flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="text-white text-lg" />
                </a>
                <a 
                  href="https://www.tiktok.com/@ali.mantinance.se?_r=1&_t=ZS-91aD3GIsUvH" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
                  aria-label="TikTok"
                >
                  <FaTiktok className="text-white text-lg" />
                </a>
                <a 
                  href="https://www.instagram.com/faniairconditioning?igsh=MTl6N3JzMXp1MGU3Mg==" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-linear-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90 flex items-center justify-center transition-opacity"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-white text-lg" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Logo & Social */}
        <div className="lg:hidden mt-4 pt-6  border-white/20">
          {/* <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <img 
                src="https://flagcdn.com/w40/sa.png" 
                alt="Saudi Arabia" 
                className="w-6 h-4 rounded"
              />
              <span className="text-sm">PK / English &gt;</span>
            </div>
          </div> */}
          
          <div className="flex gap-3">
            <a 
              href="https://www.facebook.com/share/17RmZi2P4i/" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#3b5998] hover:bg-[#2d4373] flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-white text-lg" />
            </a>
            <a 
              href="https://www.tiktok.com/@ali.mantinance.se?_r=1&_t=ZS-91aD3GIsUvH" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
              aria-label="TikTok"
            >
              <FaTiktok className="text-white text-lg" />
            </a>
            <a 
              href="https://www.instagram.com/faniairconditioning?igsh=MTl6N3JzMXp1MGU3Mg==" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-linear-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90 flex items-center justify-center transition-opacity"
              aria-label="Instagram"
            >
              <FaInstagram className="text-white text-lg" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a href="/about" className="hover:text-white transition-colors">{t('footer.aboutAliAC')}</a>
              <span className="hidden lg:inline">|</span>
              <a href="/services" className="hover:text-white transition-colors">{t('footer.serviceSupport')}</a>
              <span className="hidden lg:inline">|</span>
              <a href="/contact" className="hover:text-white transition-colors">{t('footer.jobOpportunities')}</a>
              <span className="hidden lg:inline">|</span>
              <a href="/contact" className="hover:text-white transition-colors">{t('footer.legal')}</a>
            </div>
            <p className="text-center lg:text-right">
              {t('footer.copyright')}
            </p>
          </div>
          
        
        </div>
          {/* Developer Credit */}
          <div className=" pt-4 border-t container mx-auto px-4 sm:px-6 lg:px-20 py-4 border-white/10 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <img 
                  src="/companyLogo.png" 
                  alt="Nexaro" 
                  className="h-7 w-auto rounded"
                />
                <div className="flex flex-col items-start">
                  <p className="text-white/50 text-xs">Next-gen Tech Solutions</p>
                </div>
              </div>
            </div>
          
          </div>
      </div>
    </footer>
  );
}
