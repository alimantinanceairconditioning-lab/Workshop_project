"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchServices } from "@/lib/store/slices/servicesSlice";
import { useLanguage } from "@/lib/LanguageContext";
import { translateService } from "@/lib/serviceTranslations";

const ServiceDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useAppDispatch();
  const { services, loading } = useAppSelector((state) => state.services);
  const { t, locale } = useLanguage();

  const [service, setService] = useState<any>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (services.length > 0) {
      const foundService = services.find((s: any) => s.slug === slug);
      setService(foundService);
    }
  }, [services, slug]);

  if (loading || !service) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use Arabic fields if available and locale is Arabic, otherwise fallback to translation
  const displayName = locale === 'ar' && service.nameAr 
    ? service.nameAr 
    : translateService(service.name, locale);
  
  const displayShortDesc = locale === 'ar' && service.shortDescriptionAr 
    ? service.shortDescriptionAr 
    : translateService(service.shortDescription, locale);
  
  const displayLongDesc = locale === 'ar' && service.longDescriptionAr 
    ? service.longDescriptionAr 
    : translateService(service.longDescription, locale);
  
  // Get features based on language - use Arabic if available, otherwise translate from English
  const displayFeatures = locale === 'ar' && service.featuresAr && service.featuresAr.length > 0
    ? service.featuresAr
    : service.features 
      ? service.features.map((feature: string) => translateService(feature, locale))
      : [];
  
  // Get FAQs based on language - use Arabic if available, otherwise translate from English
  const displayFaqs = locale === 'ar' && service.faqsAr && service.faqsAr.length > 0
    ? service.faqsAr
    : service.faqs 
      ? service.faqs.map((faq: any) => ({
          question: translateService(faq.question, locale),
          answer: translateService(faq.answer, locale)
        }))
      : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="px-4 sm:px-6 lg:px-20 xl:px-27">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-primaryBlue hover:text-blue-700 font-medium">{t('nav.home')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/services" className="text-primaryBlue hover:text-blue-700 font-medium">{t('nav.services')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{displayName}</span>
        </nav>

        {/* Service Info Section with Image */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image - Left Side */}
            <div className="relative h-64 md:h-full min-h-[350px]">
              <Image
                src={service.image}
                alt={displayName}
                fill
                className="object-cover rounded-l-2xl"
                priority
              />
            </div>
            {/* Content - Right Side */}
            <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primaryBlue mb-4">{displayName}</h1>
              <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">{displayShortDesc}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/#contact"
                  className="inline-block bg-accentYellow text-primaryBlue px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition shadow-md hover:shadow-lg text-center"
                >
                  {t('services.getServiceNow')}
                </Link>
                <Link
                  href="tel:0502575350"
                  className="inline-block border-2 border-primaryBlue text-primaryBlue px-6 py-3 rounded-lg font-semibold hover:bg-primaryBlue hover:text-white transition text-center"
                >
                  {t('nav.callNow')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primaryBlue mb-6">{t('services.serviceDetails')}</h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">{displayLongDesc}</p>
        </div>

        {/* Features */}
        {displayFeatures && displayFeatures.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primaryBlue mb-6">{t('services.whatWeOffer')}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {displayFeatures.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                  <span className="w-3 h-3 bg-accentYellow rounded-full mt-1.5 shrink-0"></span>
                  <span className="text-base text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQs */}
        {displayFaqs && displayFaqs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-primaryBlue mb-4 sm:mb-6">{t('services.faq')}</h2>
            <div className="space-y-4">
              {displayFaqs.map((faq: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className={`w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition ${locale === 'ar' ? 'text-right' : 'text-left'}`}
                  >
                    <h3 className={`text-xs sm:text-lg md:text-xl font-semibold text-gray-800 flex-1 ${locale === 'ar' ? 'pl-4' : 'pr-4'}`}>{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-primaryBlue transition-transform duration-300 shrink-0 ${
                        openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaqIndex === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <p className={`p-4 text-base text-gray-600 leading-relaxed ${locale === 'ar' ? 'text-right' : 'text-left'}`}>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {service.gallery && service.gallery.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primaryBlue mb-6">{t('services.serviceGallery')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {service.gallery.map((image: string, index: number) => (
                <div key={index} className="relative h-48 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                  <Image
                    src={image}
                    alt={`${displayName} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-linear-to-r from-primaryBlue to-heroBlue text-white rounded-2xl p-8 md:p-10 text-center shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('services.needThisService')}</h2>
          <p className="text-lg mb-8 opacity-90">{t('services.needThisServiceDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="bg-accentYellow text-primaryBlue px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition shadow-lg hover:shadow-xl"
            >
              {t('services.contactUs')}
            </Link>
            <Link
              href="tel:0502575350"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primaryBlue transition shadow-lg"
            >
              {t('nav.callNow')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;