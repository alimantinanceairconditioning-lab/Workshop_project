"use client";
import React, { useEffect } from 'react'
import Image from 'next/image'
import Button from '../ui/Button'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { fetchProjects } from '@/lib/store/slices/projectsSlice'
import { useLanguage } from '@/lib/LanguageContext'
import { translateProject } from '@/lib/projectTranslations'
import Link from 'next/link';

const Project = () => {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);
  const { t, locale } = useLanguage();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Get first 6 project images for homepage display
  const displayImages = projects
    .slice(0, 6)
    .flatMap((project: any) => {
      // Use Arabic from DB if available, otherwise use translation, fallback to English
      const displayTitle = locale === 'ar' 
        ? (project.titleAr || translateProject(project.title, 'ar'))
        : project.title;
      
      return project.images.map((img: string, idx: number) => ({
        id: `${project._id}-${idx}`,
        imageUrl: img,
        title: displayTitle,
      }));
    })
    .slice(0, 6);

  return (
    <section className='bg-[#F5F5F5] px-4 sm:px-6 md:px-12 lg:px-20 xl:px-27 py-8 sm:py-10 md:py-12 lg:py-16' id='projects'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-primaryBlue text-center mb-6 md:mb-8 lg:mb-10'>{t('projects.title')}</h1>
        
        {loading ? (
          <div className='grid grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8 lg:mb-10 gap-3 sm:gap-4 md:gap-5 lg:gap-6'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className='w-full h-40 sm:h-48 md:h-56 lg:h-64 rounded-2xl md:rounded-3xl bg-gray-200 animate-pulse'></div>
            ))}
          </div>
        ) : displayImages.length === 0 ? (
          <div className='text-center py-12 mb-6 md:mb-8 lg:mb-10'>
            <p className='text-gray-500 text-lg'>{t('projects.noProjects')}</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8 lg:mb-10 gap-3 sm:gap-4 md:gap-5 lg:gap-6'>
            {displayImages.map((project) => (
              <div key={project.id} className='w-full h-40 sm:h-48 md:h-56 lg:h-64 rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300'>
                <Image 
                  src={project.imageUrl} 
                  alt={project.title} 
                  width={500}
                  height={400}
                  quality={75}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/transparent.webp';
                  }}
                />
              </div>
            ))}
          </div>
        )}

     <div className='flex items-center justify-center w-full'>
           <Link href="/project-gallery">
             <Button type='button' className='px-6 py-2.5 md:px-8 md:py-3 font-semibold text-sm md:text-base'>
              {t('projects.viewFullGallery')}
            </Button>
           </Link>
     </div>

    </section>
  )
}

export default Project