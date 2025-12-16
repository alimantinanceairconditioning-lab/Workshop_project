"use client";
import React, { useEffect } from "react";
import ServiceCard from "@/components/ui/ServiceCard";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchServices } from "@/lib/store/slices/servicesSlice";
import { useLanguage } from "@/lib/LanguageContext";

// ⭐ Add Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ServicesPage = () => {
  const dispatch = useAppDispatch();
  const { services, loading } = useAppSelector((state) => state.services);
  const { t } = useLanguage();

  const activeServices = services.filter(
    (service: any) => service.status === "Active"
  );

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primaryBlue mb-3 md:mb-4">
            {t('nav.services')}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        {/* ⭐ Mobile Swiper (Small Screens Only) */}
        {/* <div className="block md:hidden">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="services-swiper"
          >
            {activeServices.map((service: any) => (
              <SwiperSlide key={service._id}>
                <ServiceCard
                  service={{
                    id: service._id,
                    title: service.name,
                    description: service.shortDescription,
                    image: service.image,
                    slug: service.slug,
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div> */}

        {/* ⭐ Grid – Medium & Large Screens */}
        <div className="grid-cols-1 grid  md:grid-cols-2 lg:grid-cols-4  gap-4 md:gap-6">
          {activeServices.map((service: any) => (
            <ServiceCard
              key={service._id}
              service={{
                id: service._id,
                title: service.name,
                description: service.shortDescription,
                image: service.image,
                slug: service.slug,
              }}
            />
          ))}
        </div>

        {/* CTA Section */}
        {activeServices.length > 0 && (
          <div className="mt-12 md:mt-16 bg-linear-to-r from-primaryBlue to-heroBlue rounded-2xl p-8 md:p-12 text-center shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('services.needService')}
            </h2>
            <p className="text-base md:text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              {t('services.needServiceDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="inline-block bg-accentYellow px-8 py-3 rounded-lg font-bold text-base md:text-lg text-primaryBlue hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-300"
              >
                {t('services.contactUs')}
              </a>
              <a
                href="tel:0502575350"
                className="inline-block border-2 border-white px-8 py-3 rounded-lg font-bold text-base md:text-lg text-white hover:bg-white hover:text-primaryBlue transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-300"
              >
                {t('nav.callNow')}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
