"use client";
import React from "react";
import { Shield, Award, Clock, Users, Wrench, Star, CheckCircle, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primaryBlue to-blue-900 text-white py-10 md:py-17 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 md:mb-8">
              {t('about.subtitle')}
            </p>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              {t('about.intro')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-8 sm:py-10 lg:py-24 px-4 sm:px-6 lg:px-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl text-center lg:text-left font-bold text-primaryBlue mb-6">
                {t('about.ourStory')}
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  {t('about.storyPara1')}
                </p>
                <p className="text-lg">
                  {t('about.storyPara2')}
                </p>
                <p className="text-lg">
                  {t('about.storyPara3')}
                </p>
              </div>
            </div>
            <div className="bg-linear-to-br from-primaryBlue to-blue-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">{t('about.mission')}</h3>
              <p className="text-lg mb-8 text-white/90">
                {t('about.missionText')}
              </p>
              
              <h3 className="text-2xl font-bold mb-6">{t('about.vision')}</h3>
              <p className="text-lg text-white/90">
                {t('about.visionText')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-8 sm:py-10 md:py-15 lg:py-24 bg-primaryBlue text-white px-4 sm:px-6 lg:px-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accentYellow mb-2">5+</div>
              <div className="text-lg text-white/80">{t('about.yearsExperience')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accentYellow mb-2">1000+</div>
              <div className="text-lg text-white/80">{t('about.happyCustomers')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accentYellow mb-2">24/7</div>
              <div className="text-lg text-white/80">{t('about.support')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accentYellow mb-2">100%</div>
              <div className="text-lg text-white/80">{t('about.satisfactionRate')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 sm:py-10 md:py-24 bg-gray-50 px-4 sm:px-6 lg:px-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primaryBlue mb-4">
              {t('about.whyChooseUs')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.whyChooseDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accentYellow rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-primaryBlue" />
              </div>
              <h3 className="text-xl font-bold text-primaryBlue mb-3">{t('about.expertTechniciansTitle')}</h3>
              <p className="text-gray-600">
                {t('about.expertTechniciansDesc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accentYellow rounded-full flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-primaryBlue" />
              </div>
              <h3 className="text-xl font-bold text-primaryBlue mb-3">{t('about.availabilityTitle')}</h3>
              <p className="text-gray-600">
                {t('about.availabilityDesc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accentYellow rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primaryBlue" />
              </div>
              <h3 className="text-xl font-bold text-primaryBlue mb-3">{t('about.qualityGuaranteeTitle')}</h3>
              <p className="text-gray-600">
                {t('about.qualityGuaranteeDesc')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accentYellow rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-primaryBlue" />
              </div>
              <h3 className="text-xl font-bold text-primaryBlue mb-3">{t('about.customerFocusedTitle')}</h3>
              <p className="text-gray-600">
                {t('about.customerFocusedDesc')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accentYellow rounded-full flex items-center justify-center mb-6">
                <Wrench className="w-8 h-8 text-primaryBlue" />
              </div>
              <h3 className="text-xl font-bold text-primaryBlue mb-3">{t('about.allBrandsTitle')}</h3>
              <p className="text-gray-600">
                {t('about.allBrandsDesc')}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accentYellow rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-primaryBlue" />
              </div>
              <h3 className="text-xl font-bold text-primaryBlue mb-3">{t('about.competitivePricingTitle')}</h3>
              <p className="text-gray-600">
                {t('about.competitivePricingDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

    


   
     
    </main>
  );
}
