"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { CheckCircle2 } from "lucide-react";
import hero_image2 from "@/public/images/hero_image_optimized.webp";
import Link from "next/link";

const Hero = () => {
  const { t, locale } = useLanguage();
  const isRTL = locale === 'ar';
  
  return (
    <main className="bg-heroBlue px-4 sm:px-6 md:px-12 xl:px-27 lg:px-20 py-8 md:py-10 lg:py-12" id="hero">
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-stretch gap-8 md:gap-10 lg:gap-x-12">
        <div className={`w-full lg:w-[55%] text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'} flex flex-col justify-center`}>
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-3 md:mb-4 leading-tight font-bold">
              {t('hero.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-accentYellow mb-3 md:mb-4">
              {t('hero.subtitle')}
            </p>
          </div>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-medium mb-5 md:mb-6">
            {t('hero.description')}
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3 mb-5 md:mb-6">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className={`flex items-start gap-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-accentYellow shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm md:text-base font-medium leading-snug">
                  {t(`hero.features.${index}`)}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/contact"
              className="bg-accentYellow text-primaryBlue px-8 py-4 rounded-lg font-bold text-base md:text-lg hover:bg-white transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-300 text-center"
            >
              {t('services.getServiceNow')}
            </Link>
            <a
              href="tel:0502575350"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-base md:text-lg hover:bg-white hover:text-primaryBlue transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-300 text-center"
            >
              {t('nav.callNow')}
            </a>
          </div>
        </div>
        <div className="w-full lg:w-[45%] flex items-center justify-center">
          <Image 
            src={hero_image2} 
            alt="Professional AC Technician - Ali Air Conditioning Services" 
            width={700} 
            height={640}
            quality={85}
            priority
            placeholder="blur"
            className="w-full max-w-md md:max-w-lg lg:max-w-full h-auto rounded-2xl mx-auto object-cover shadow-2xl" 
          />
        </div>
      </div>
    </main>
  );
};

export default Hero;
