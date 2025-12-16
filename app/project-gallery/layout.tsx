import type { Metadata } from 'next';
import { getSEOData } from "@/lib/getSEOData";
import Script from 'next/script';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOData('gallery');
  
  return {
    title: "Project Gallery",
    description: `View our completed air conditioning and refrigeration projects. ${seo.businessName} showcases quality workmanship in AC installation, repair, and maintenance across Saudi Arabia.`,
    keywords: [...seo.siteKeywords, "project gallery", "completed projects", "AC installation photos", "portfolio", "case studies"],
    openGraph: {
      title: `Project Gallery - ${seo.businessName}`,
      description: `Explore our portfolio of completed AC and refrigeration projects. See the quality of our work and customer satisfaction.`,
      url: `${seo.siteUrl}/project-gallery`,
      siteName: seo.businessName,
      images: seo.ogImage ? [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${seo.businessName} - Project Gallery`,
        },
      ] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Project Gallery - ${seo.businessName}`,
      description: `Explore our portfolio of completed AC and refrigeration projects. See the quality of our work and customer satisfaction.`,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    alternates: {
      canonical: '/project-gallery',
    },
  };
}

export default async function ProjectGalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seo = await getSEOData('gallery');
  
  // Schema.org for Image Gallery
  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Project Gallery - Completed AC and Refrigeration Work',
    description: 'View our portfolio of completed air conditioning and refrigeration projects',
    provider: {
      '@type': 'LocalBusiness',
      name: seo.businessName,
      url: seo.siteUrl,
    },
  };
  
  return (
    <>
      <Script
        id="gallery-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      {children}
    </>
  );
}
