"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "@/lib/LanguageContext";

export default function ThankYouPage() {
  const { t } = useLanguage();
  const [seoSettings, setSeoSettings] = useState<any>(null);

  useEffect(() => {
    // Fetch SEO settings for conversion tracking
    const fetchSEO = async () => {
      try {
        const response = await fetch("/api/seo");
        const data = await response.json();
        if (data.success) {
          setSeoSettings(data.seo);
        }
      } catch (error) {
        console.error("Error fetching SEO settings:", error);
      }
    };

    fetchSEO();
  }, []);

  useEffect(() => {
    // Google Ads Conversion Tracking
    // This fires when someone successfully submits the form
    if (seoSettings && typeof window !== "undefined" && (window as any).gtag) {
      if (seoSettings.googleAdsId && seoSettings.googleAdsConversionLabel) {
        (window as any).gtag("event", "conversion", {
          send_to: `${seoSettings.googleAdsId}/${seoSettings.googleAdsConversionLabel}`,
        });
      }
      
      // Facebook Pixel Conversion
      if (seoSettings.facebookPixelId && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
      }
    }
  }, [seoSettings]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primaryBlue text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {t('thankYou.title')}
          </h1>
        </div>
      </section>

      {/* Thank You Card */}
      <section className="py-12 md:py-16 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center -mt-20">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-6">
                <FaCheckCircle className="text-green-600 text-6xl md:text-7xl" />
              </div>
            </div>

            {/* Thank You Message */}
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              {t('thankYou.title')}
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold text-purple-600 mb-6">
              {t('thankYou.titleArabic')}
            </h3>

            {/* Message */}
            <p className="text-lg text-gray-700 mb-4">
              {t('thankYou.successMessage')}
            </p>
            <p className="text-lg text-gray-700 mb-8">
              {t('thankYou.responseTime')}
            </p>

            {/* Arabic Message */}
            <p className="text-gray-600 mb-8" dir="rtl">
              {t('thankYou.successMessageArabic')}
            </p>

            {/* Contact Information */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700 mb-3">
                <strong>{t('thankYou.urgentMatters')}</strong>
              </p>
              <a
                href="tel:+966502575350"
                className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                +966502575350
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
              >
                {t('thankYou.backHome')}
              </Link>
              <Link
                href="/contact"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
              >
                {t('thankYou.sendAnother')}
              </Link>
            </div>
        </div>
      </section>
    </main>
  );
}
