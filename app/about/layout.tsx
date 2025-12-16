import type { Metadata } from 'next';
import { getSEOData } from "@/lib/getSEOData";
import Script from 'next/script';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOData('about');
  
  return {
    title: "About Us",
    description: `Learn about ${seo.businessName} - your trusted partner for air conditioning and refrigeration services in Saudi Arabia. Expert technicians, 24/7 service, and guaranteed satisfaction.`,
    keywords: [...seo.siteKeywords, "about us", "company profile", "AC service company", "Saudi Arabia HVAC"],
    openGraph: {
      title: `About ${seo.businessName}`,
      description: `Learn about ${seo.businessName} - your trusted partner for air conditioning and refrigeration services in Saudi Arabia.`,
      url: `${seo.siteUrl}/about`,
      siteName: seo.businessName,
      images: seo.ogImage ? [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${seo.businessName} - About Us`,
        },
      ] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `About ${seo.businessName}`,
      description: `Learn about ${seo.businessName} - your trusted partner for air conditioning and refrigeration services in Saudi Arabia.`,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    alternates: {
      canonical: '/about',
    },
  };
}

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seo = await getSEOData('about');
  
  // Schema.org for About Page
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Organization',
      name: seo.businessName,
      alternateName: seo.businessNameArabic,
      url: seo.siteUrl,
      logo: [
        {
          '@type': 'ImageObject',
          url: `${seo.siteUrl}/siteLogoJpeg.jpeg`,
          width: 512,
          height: 512,
        },
        {
          '@type': 'ImageObject',
          url: `${seo.siteUrl}/siteLogo.svg`,
          width: 600,
          height: 60,
        },
      ],
      description: seo.siteDescription,
      telephone: seo.phoneNumber,
      email: seo.email,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'SA',
        addressLocality: 'Medina',
      },
    },
  };
  
  return (
    <>
      <Script
        id="about-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {children}
    </>
  );
}
