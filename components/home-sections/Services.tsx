"use client";
import React, { useEffect } from "react";
import ServiceCard from "../ui/ServiceCard";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchServices } from "@/lib/store/slices/servicesSlice";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Services = () => {
  const dispatch = useAppDispatch();
  const { services, loading } = useAppSelector((state) => state.services);
  const { t } = useLanguage();

  // Filter only active services and limit to 4 for home page
  const activeServices = services.filter((service: any) => service.status === "Active").slice(0, 4);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="text-black px-4 sm:px-6 md:px-12 lg:px-20 xl:px-27 py-4 md:py-10 lg:py-12" id="services">
        <h1 className="text-primaryBlue text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 px-2">
          {t('services.title')}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-center px-4 mb-6 md:mb-8 lg:mb-10">
          {t('services.subtitle')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full bg-white border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-4 xl:p-6 flex md:flex-col gap-4 items-center md:items-center animate-pulse"
              style={{ boxShadow: "var(--color-shadowBase)" }}
            >
              {/* Image skeleton */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-full md:h-48 shrink-0 md:shrink bg-gray-200 rounded-lg md:rounded-md"></div>

              {/* Text skeleton */}
              <div className="flex-1 md:flex-none md:w-full flex flex-col justify-center md:items-center gap-3">
                <div className="h-6 bg-gray-200 rounded w-3/4 md:w-full"></div>
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="text-black px-4 sm:px-6 md:px-12 lg:px-20 xl:px-27 py-4 md:py-10 lg:py-12" id="services">
      <h1 className="text-primaryBlue text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 px-2">
        {t('services.title')}
      </h1>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-center px-4 mb-6 md:mb-8 lg:mb-10">
        {t('services.subtitle')}
      </p>

      {/* Swiper Slider for small screens (mobile) */}
      <div className="block md:hidden mb-8">
        <style jsx>{`
          .services-swiper .swiper-button-next,
          .services-swiper .swiper-button-prev {
            width: 32px !important;
            height: 32px !important;
            margin-top: -16px !important;
            border-radius: 50% !important;
          
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) !important;
            transition: all 0.3s ease !important;
          }
          
          .services-swiper .swiper-button-next:hover,
          .services-swiper .swiper-button-prev:hover {
            background: #FFD700 !important;
            transform: scale(1.05) !important;
          }
          
          .services-swiper .swiper-button-next::after,
          .services-swiper .swiper-button-prev::after {
            font-size: 8px !important;
            font-weight: bold !important;
            color: #1E3A8A !important;
          }
          
          .services-swiper .swiper-pagination-bullet {
            width: 8px !important;
            height: 8px !important;
            background: #1E3A8A !important;
            opacity: 0.4 !important;
          }
          
          .services-swiper .swiper-pagination-bullet-active {
            opacity: 1 !important;
            background: #FFD700 !important;
          }
        `}</style>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          dir="ltr"
          className="services-swiper"
        >
          {activeServices.map((service: any) => (
            <SwiperSlide key={service._id}>
              <ServiceCard
                service={{
                  id: service._id,
                  title: service.name,
                  titleAr: service.nameAr,
                  description: service.shortDescription || service.description,
                  descriptionAr: service.shortDescriptionAr,
                  image: service.image,
                  slug: service.slug,
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Grid for medium screens (tablets) */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 mb-8">
        {activeServices.map((service: any) => (
          <ServiceCard
            key={service._id}
            service={{
              id: service._id,
              title: service.name,
              titleAr: service.nameAr,
              description: service.shortDescription || service.description,
              descriptionAr: service.shortDescriptionAr,
              image: service.image,
              slug: service.slug,
            }}
          />
        ))}
      </div>

      {/* Grid for large screens */}
      <div className="hidden lg:grid grid-cols-4 gap-6 mb-8">
        {activeServices.map((service: any) => (
          <ServiceCard
            key={service._id}
            service={{
              id: service._id,
              title: service.name,
              titleAr: service.nameAr,
              description: service.shortDescription || service.description,
              descriptionAr: service.shortDescriptionAr,
              image: service.image,
              slug: service.slug,
            }}
          />
        ))}
      </div>
      
      {/* More Services Button */}
      <div className="flex justify-center mt-8">
        <Link
          href="/services"
          className="bg-accentYellow px-8 py-3 rounded-lg font-bold text-primaryBlue hover:bg-primaryBlue hover:text-accentYellow transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-300"
        >
          {t('services.moreServices')}
        </Link>
      </div>
    </section>
  );
};

export default Services;
