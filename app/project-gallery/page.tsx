"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProjects } from "@/lib/store/slices/projectsSlice";
import { useLanguage } from "@/lib/LanguageContext";
import { translateProject } from "@/lib/projectTranslations";
import { X } from "lucide-react";

const ProjectGalleryPage = () => {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);
  const { t, locale } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white px-4 sm:px-6 md:px-12 lg:px-20 xl:px-27 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-primaryBlue text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('projects.title')}
          </h1>
          <p className="text-center text-gray-600 mb-8 md:mb-12 text-sm sm:text-base md:text-lg">
            {t('projects.subtitle')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-72"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white px-4 sm:px-6 md:px-12 lg:px-20 xl:px-27 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-primaryBlue text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {t('projects.title')}
        </h1>
        <p className="text-center text-gray-600 mb-8 md:mb-12 text-sm  md:text-lg">
          {t('projects.subtitle')}
        </p>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t('projects.noProjects')}</p>
            <p className="text-gray-400 text-sm mt-2">
              {t('projects.checkBack')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) =>
              project.images.map((image: string, index: number) => (
                <div
                  key={`${project._id}-${index}`}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={75}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-lg">
                          {locale === 'ar' 
                            ? (project.titleAr || translateProject(project.title, 'ar'))
                            : project.title
                          }
                        </h3>
                        <p className="text-sm opacity-90 line-clamp-2">
                          {locale === 'ar'
                            ? (project.descriptionAr || translateProject(project.description, 'ar'))
                            : project.description
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
              <Image
                src={selectedImage}
                alt="Project detail"
                fill
                sizes="100vw"
                quality={100}
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectGalleryPage;