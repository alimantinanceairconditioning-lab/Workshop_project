import type { Metadata } from 'next';
import { getSEOData } from "@/lib/getSEOData";
import connectDB from "@/lib/db";
import Service from "@/lib/models/service.model";
import PageSEO from "@/lib/models/pageSeo.model";
import Script from 'next/script';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = await getSEOData();
  const { slug } = await params;
  
  try {
    await connectDB();
    
    // First try to get PageSEO data for this specific service
    const pageSEO: any = await PageSEO.findOne({ 
      pageId: slug,
      isActive: true 
    }).lean();
    
    // If PageSEO exists for this service, use it
    if (pageSEO) {
      return {
        title: pageSEO.metaTitle,
        description: pageSEO.metaDescription,
        keywords: pageSEO.metaKeywords,
        openGraph: {
          title: pageSEO.ogTitle || pageSEO.metaTitle,
          description: pageSEO.ogDescription || pageSEO.metaDescription,
          url: pageSEO.ogUrl || `${seo.siteUrl}/services/${slug}`,
          siteName: seo.businessName,
          images: pageSEO.ogImage ? [
            {
              url: pageSEO.ogImage,
              width: 1200,
              height: 630,
              alt: pageSEO.metaTitle,
            },
          ] : [],
          locale: 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: pageSEO.twitterTitle || pageSEO.metaTitle,
          description: pageSEO.twitterDescription || pageSEO.metaDescription,
          images: pageSEO.twitterImage ? [pageSEO.twitterImage] : [],
        },
        alternates: {
          canonical: pageSEO.canonicalUrl || `/services/${slug}`,
        },
        robots: {
          index: pageSEO.robotsIndex,
          follow: pageSEO.robotsFollow,
        },
      };
    }
    
    // Fallback: If no PageSEO, use Service data
    const service: any = await Service.findOne({ slug }).lean();

    if (!service) {
      return {
        title: "Service Not Found",
        description: `The requested service could not be found. Visit ${seo.businessName} to explore our range of air conditioning and refrigeration services.`,
      };
    }

    // Use service-specific meta fields if available, otherwise use service name and shortDescription
    const metaTitle = service.metaTitle || service.name;
    const metaDescription = service.metaDescription || service.shortDescription || `Professional ${service.name} services by ${seo.businessName}. Expert technicians, quality workmanship, and 24/7 availability in Saudi Arabia.`;

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: [...seo.siteKeywords, service.name, service.slug, "service details"],
      openGraph: {
        title: `${metaTitle} - ${seo.businessName}`,
        description: metaDescription,
        url: `${seo.siteUrl}/services/${slug}`,
        siteName: seo.businessName,
        images: service.image ? [
          {
            url: service.image,
            width: 1200,
            height: 630,
            alt: `${metaTitle} - ${seo.businessName}`,
          },
        ] : seo.ogImage ? [
          {
            url: seo.ogImage,
            width: 1200,
            height: 630,
            alt: `${metaTitle} - ${seo.businessName}`,
          },
        ] : [],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${metaTitle} - ${seo.businessName}`,
        description: metaDescription,
        images: service.image ? [service.image] : seo.ogImage ? [seo.ogImage] : [],
      },
      alternates: {
        canonical: `/services/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: "Service Details",
      description: `Professional air conditioning and refrigeration services by ${seo.businessName}`,
    };
  }
}

export default async function ServiceDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const seo = await getSEOData();
  const { slug } = await params;
  
  let service: any = null;
  try {
    await connectDB();
    service = await Service.findOne({ slug }).lean();
  } catch (error) {
    console.error('Error fetching service for schema:', error);
  }
  
  // Schema.org for Service Detail Page
  const serviceSchema = service ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.shortDescription,
    provider: {
      '@type': 'LocalBusiness',
      '@id': seo.siteUrl,
      name: seo.businessName,
      telephone: seo.phoneNumber,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'SA',
      },
    },
    serviceType: service.name,
    areaServed: {
      '@type': 'Country',
      name: 'Saudi Arabia',
    },
    image: service.image,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
    },
  } : null;
  
  return (
    <>
      {serviceSchema && (
        <Script
          id="service-detail-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {children}
    </>
  );
}
