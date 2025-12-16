import type { Metadata } from 'next';
import { getSEOData } from "@/lib/getSEOData";
import Script from 'next/script';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOData('contact');
  
  return {
    title: "Contact Us",
    description: `Contact ${seo.businessName} for professional AC and refrigeration services. Available 24/7 in Saudi Arabia. Call ${seo.phoneNumber} or email ${seo.email || 'us'} for immediate assistance.`,
    keywords: [...seo.siteKeywords, "contact", "get in touch", "AC service contact", "emergency AC repair"],
    openGraph: {
      title: `Contact ${seo.businessName}`,
      description: `Get in touch with ${seo.businessName} for all your air conditioning and refrigeration needs. 24/7 service available.`,
      url: `${seo.siteUrl}/contact`,
      siteName: seo.businessName,
      images: seo.ogImage ? [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${seo.businessName} - Contact Us`,
        },
      ] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Contact ${seo.businessName}`,
      description: `Get in touch with ${seo.businessName} for all your air conditioning and refrigeration needs. 24/7 service available.`,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    alternates: {
      canonical: '/contact',
    },
  };
}

export default async function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seo = await getSEOData('contact');
  
  // Schema.org for Contact Page
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'LocalBusiness',
      '@id': seo.siteUrl,
      name: seo.businessName,
      telephone: seo.phoneNumber,
      email: seo.email,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'SA',
        addressLocality: 'Medina',
        streetAddress: seo.address,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      ],
    },
  };
  
  return (
    <>
      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}
