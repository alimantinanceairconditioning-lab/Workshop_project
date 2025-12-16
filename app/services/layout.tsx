import type { Metadata } from 'next';
import { getSEOData } from "@/lib/getSEOData";
import Script from 'next/script';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOData('services');
  
  return {
    title: "Our Services",
    description: `Explore our comprehensive range of air conditioning and refrigeration services. ${seo.businessName} offers expert AC installation, repair, maintenance, washing machine repair, and freezer services in Saudi Arabia.`,
    keywords: [...seo.siteKeywords, "AC services", "refrigeration services", "washing machine repair", "appliance services", "HVAC services"],
    openGraph: {
      title: `Our Services - ${seo.businessName}`,
      description: `Professional AC installation, repair, maintenance, and appliance services in Saudi Arabia. Expert technicians available 24/7.`,
      url: `${seo.siteUrl}/services`,
      siteName: seo.businessName,
      images: seo.ogImage ? [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${seo.businessName} - Our Services`,
        },
      ] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Our Services - ${seo.businessName}`,
      description: `Professional AC installation, repair, maintenance, and appliance services in Saudi Arabia. Expert technicians available 24/7.`,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    alternates: {
      canonical: '/services',
    },
  };
}

export default async function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seo = await getSEOData('services');
  
  // Schema.org for Services Page
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Air Conditioning and Refrigeration Services',
    description: 'Comprehensive AC and appliance repair services',
    itemListElement: [
      {
        '@type': 'Service',
        name: 'AC Installation',
        provider: {
          '@type': 'LocalBusiness',
          name: seo.businessName,
        },
      },
      {
        '@type': 'Service',
        name: 'AC Repair',
        provider: {
          '@type': 'LocalBusiness',
          name: seo.businessName,
        },
      },
      {
        '@type': 'Service',
        name: 'AC Maintenance',
        provider: {
          '@type': 'LocalBusiness',
          name: seo.businessName,
        },
      },
    ],
  };
  
  return (
    <>
      <Script
        id="services-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      {children}
    </>
  );
}
