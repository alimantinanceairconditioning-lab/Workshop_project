"use client";
import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { translateService } from "@/lib/serviceTranslations";

interface Service {
  _id: string;
  name: string;
  status: string;
}

export default function ContactPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    serviceType: "",
    phoneNumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/service', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const data = await response.json();
        if (data.success) {
          const activeServices = data.services.filter((s: Service) => s.status === 'Active');
          setServices(activeServices);
        }
      } catch (error) {
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        setFormData({ firstName: "", lastName: "", serviceType: "", phoneNumber: "", message: "" });
        
        // Redirect to thank you page after 2 seconds
        setTimeout(() => {
          router.push("/thank-you");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen text-black bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-primaryBlue text-white sm:py-12 py-10 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20">
            {/* Phone Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accentYellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primaryBlue" />
              </div>
              <h3 className="text-lg font-bold text-primaryBlue mb-2">{t('contact.phone')}</h3>
              <a href="tel:+966502575350" className="text-gray-700 hover:text-accentYellow transition-colors">
                +966 50 257 5350
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accentYellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primaryBlue" />
              </div>
              <h3 className="text-lg font-bold text-primaryBlue mb-2">{t('contact.email')}</h3>
              <a href="mailto:info@aliacservicesksa.com" className="text-gray-700 hover:text-accentYellow transition-colors break-all">
                alimantinanceairconditioning@gmail.com
              </a>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accentYellow rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primaryBlue" />
              </div>
              <h3 className="text-lg font-bold text-primaryBlue mb-2">{t('contact.location')}</h3>
              <p className="text-gray-700">Medina, Saudi Arabia</p>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accentYellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primaryBlue" />
              </div>
              <h3 className="text-lg font-bold text-primaryBlue mb-2">{t('contact.workingHours')}</h3>
              <p className="text-gray-700">{t('contact.available24')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Contact Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primaryBlue mb-4">
                {t('contact.sendMessage')}
              </h2>
              <p className="text-gray-600 mb-8">
                {t('contact.formSubtitle')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success/Error Messages */}
                {submitStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <p className="text-green-800 font-medium">{t('contact.successMessage')}</p>
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">{t('contact.errorMessage')}</p>
                  </div>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('contact.firstName')} {t('common.required')}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none transition-all text-gray-900"
                      placeholder={t('contact.firstName')}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('contact.lastName')} {t('common.required')}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none transition-all text-gray-900"
                      placeholder={t('contact.lastName')}
                    />
                  </div>
                </div>

                {/* Phone and Service Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('contact.phoneNumber')} {t('common.required')}
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none transition-all text-gray-900"
                      placeholder="05XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('contact.serviceType')} {t('common.required')}
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      required
                      disabled={loadingServices}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none transition-all text-gray-900"
                    >
                      <option value="">
                        {loadingServices ? t('contact.loadingServices') : t('contact.selectService')}
                      </option>
                      {services.map((service) => (
                        <option key={service._id} value={service.name}>
                          {translateService(service.name, locale)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.message')} {t('common.required')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none transition-all resize-none text-gray-900"
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accentYellow text-primaryBlue font-bold py-4 px-6 rounded-lg hover:bg-primaryBlue hover:text-accentYellow transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primaryBlue border-t-transparent rounded-full animate-spin"></div>
                      {t('contact.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('contact.send')}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Side - Additional Info */}
            <div className="bg-linear-to-br from-primaryBlue to-blue-900 rounded-2xl p-8 md:p-12 text-white h-full flex flex-col">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                {t('contact.whyChooseUs')}
              </h3>
              
              <div className="space-y-6 grow">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-accentYellow rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{t('contact.expertTechnicians')}</h4>
                    <p className="text-white/80">{t('contact.expertDesc')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-accentYellow rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{t('contact.fastResponse')}</h4>
                    <p className="text-white/80">{t('contact.fastResponseDesc')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-accentYellow rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{t('contact.competitivePricing')}</h4>
                    <p className="text-white/80">{t('contact.competitivePricingDesc')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <h4 className="font-bold text-xl mb-4">{t('contact.quickContact')}</h4>
                <div className="space-y-3">
                  <a href="tel:+966502575350" className="flex items-center gap-3 hover:text-accentYellow transition-colors">
                    <Phone className="w-5 h-5" />
                    +966 50 257 5350
                  </a>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    Medina, Saudi Arabia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional - you can add Google Maps embed here) */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-20 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primaryBlue text-center mb-8">
            {t('contact.serviceArea')}
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <MapPin className="w-16 h-16 text-accentYellow mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primaryBlue mb-2">{t('contact.serviceAreaTitle')}</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('contact.serviceAreaDesc')}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
