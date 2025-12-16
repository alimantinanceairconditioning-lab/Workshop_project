"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { translateService } from "@/lib/serviceTranslations";

interface IServiceCard {
  id: string | number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  image: string | any;
  slug?: string;
}

const ServiceCard = ({ service }: { service: IServiceCard }) => {
  const isCloudinaryImage = typeof service.image === "string";
  const { locale, t } = useLanguage();

  const link = `/services/${service.slug || service.id}`;

  // Use Arabic fields if available and locale is Arabic, otherwise fallback to English or translation
  const displayTitle = locale === 'ar' && service.titleAr 
    ? service.titleAr 
    : translateService(service.title, locale);
  
  // Get description based on language
  const originalDescription = locale === 'ar' && service.descriptionAr 
    ? service.descriptionAr 
    : service.description || "";
  
  // Truncate description
  const maxLength = 80;
  const truncatedDescription = originalDescription.length > maxLength 
    ? originalDescription.substring(0, maxLength) + "..." 
    : originalDescription;
  
  // Fallback to translation if no Arabic content
  const displayDescription = locale === 'ar' && service.descriptionAr 
    ? truncatedDescription 
    : translateService(truncatedDescription, locale);

  return (
    <div
      className="w-full bg-white border border-cardStroke hover:border-cardHoverStroke rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-col gap-4 transition-all duration-400 h-full"
      style={{
        boxShadow: "var(--color-shadowBase)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--color-shadowHover)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--color-shadowBase)")}
    >
      {/* --- Entire top area clickable --- */}
      <Link href={link} className="flex flex-col items-center gap-4 flex-1">
        <div className="w-full h-48 md:h-52 shrink-0 relative">
          {isCloudinaryImage ? (
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              quality={85}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Image
              src={service.image}
              alt={service.title}
              quality={85}
              placeholder="blur"
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>

        <div className="flex flex-col items-center w-full">
          <h1 className="text-primaryBlue text-lg md:text-xl font-bold text-center mb-3 line-clamp-2 w-full">
            {displayTitle}
          </h1>

          <p className="text-sm  leading-relaxed text-center text-gray-600 px-2 w-full">
            {displayDescription}
          </p>
        </div>
      </Link>

      {/* --- View More Button --- */}
      <Link
        href={link}
        className="w-full px-4 py-2.5 bg-primaryBlue text-white rounded-lg text-sm font-semibold hover:bg-heroBlue transition text-center"
      >
        {t('services.viewDetails')}
      </Link>
    </div>
  );
};

export default ServiceCard;
