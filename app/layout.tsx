import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { getSEOData } from "@/lib/getSEOData";

// Force dynamic rendering to avoid build-time DB calls
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await getSEOData('home');
    
    return {
      title: {
        default: seo.siteTitle,
        template: `%s | ${seo.businessName}`,
      },
      description: seo.siteDescription,
      keywords: seo.siteKeywords,
      authors: [{ name: seo.businessName }],
      creator: seo.businessName,
      publisher: seo.businessName,
      metadataBase: new URL(seo.siteUrl),
      alternates: {
        canonical: '/',
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        alternateLocale: 'ar_SA',
        url: seo.siteUrl,
        title: seo.ogTitle || seo.siteTitle,
        description: seo.ogDescription || seo.siteDescription,
        siteName: seo.businessName,
        images: seo.ogImage ? [
          {
            url: seo.ogImage,
            width: 1200,
            height: 630,
            alt: `${seo.businessName} Logo`,
          },
        ] : [
          {
            url: '/siteLogoJpeg.jpeg',
            width: 512,
            height: 512,
            alt: `${seo.businessName} Logo`,
          },
          {
            url: '/siteLogo.svg',
            width: 600,
            height: 60,
            alt: `${seo.businessName} Logo`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.ogTitle || seo.siteTitle,
        description: seo.ogDescription || seo.siteDescription,
        images: seo.ogImage ? [seo.ogImage] : ['/siteLogoJpeg.jpeg', '/siteLogo.svg'],
      },
      robots: {
        index: seo.allowIndexing,
        follow: seo.allowFollowLinks,
        googleBot: {
          index: seo.allowIndexing,
          follow: seo.allowFollowLinks,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      verification: {
        google: seo.googleSiteVerification || undefined,
      },
      category: 'business',
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Return static metadata if DB is unavailable
    return {
      title: {
        default: "Ali Air Conditioning & Refrigeration | مؤسسة علي للتكييف والتبريد",
        template: "%s | Ali Air Conditioning & Refrigeration",
      },
      description: "Professional air conditioning and refrigeration services in Saudi Arabia. Expert AC installation, maintenance, and repair available 24/7.",
      keywords: ["air conditioning Saudi Arabia", "AC repair", "refrigeration services"],
      metadataBase: new URL("https://www.aliacservicesksa.com"),
    };
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1E3A8A',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let seo;
  try {
    seo = await getSEOData();
  } catch (error) {
    console.error("Error loading SEO data in layout:", error);
    // Use defaults if DB unavailable
    seo = {
      businessType: 'LocalBusiness',
      siteUrl: 'https://www.aliacservicesksa.com',
      businessName: 'Ali Air Conditioning & Refrigeration',
      businessNameArabic: 'مؤسسة علي للتكييف والتبريد',
      siteDescription: 'Professional air conditioning services',
      phoneNumber: '+966502575350',
      address: 'Medina, Saudi Arabia',
      priceRange: '$$',
    };
  }
  
  // Structured Data for Local Business with Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${seo.siteUrl}/#organization`,
    name: seo.businessName,
    alternateName: seo.businessNameArabic,
    url: seo.siteUrl,
    logo: {
      '@type': 'ImageObject',
      '@id': `${seo.siteUrl}/#logo`,
      url: `${seo.siteUrl}/siteLogoJpeg.jpeg`,
      contentUrl: `${seo.siteUrl}/siteLogoJpeg.jpeg`,
      width: 512,
      height: 512,
      caption: seo.businessName,
    },
    image: {
      '@type': 'ImageObject',
      '@id': `${seo.siteUrl}/#logo`,
      url: `${seo.siteUrl}/siteLogoJpeg.jpeg`,
      contentUrl: `${seo.siteUrl}/siteLogoJpeg.jpeg`,
      width: 512,
      height: 512,
      caption: seo.businessName,
    },
    sameAs: [
      seo.facebook,
      seo.twitter,
      seo.instagram,
      seo.linkedin,
      seo.youtube,
    ].filter(Boolean),
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': seo.businessType || 'LocalBusiness',
    '@id': seo.siteUrl,
    name: seo.businessName,
    alternateName: seo.businessNameArabic,
    description: seo.siteDescription,
    url: seo.siteUrl,
    telephone: seo.phoneNumber,
    email: seo.email || undefined,
    priceRange: seo.priceRange,
    image: `${seo.siteUrl}/siteLogoJpeg.jpeg`,
    logo: `${seo.siteUrl}/siteLogoJpeg.jpeg`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SA',
      addressRegion: 'Saudi Arabia',
      streetAddress: seo.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      addressCountry: 'SA',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    sameAs: [
      seo.facebook,
      seo.twitter,
      seo.instagram,
      seo.linkedin,
      seo.youtube,
    ].filter(Boolean),
  };
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Favicons - Multiple sizes for all devices */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Android Chrome Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1E3A8A" />
        
        {/* Theme Colors */}
        <meta name="theme-color" content="#1E3A8A" />
        
        {/* Google Ads Global Site Tag (gtag.js) */}
        {seo.googleAdsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${seo.googleAdsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${seo.googleAdsId}');
              `}
            </Script>
          </>
        )}

        {/* Google Analytics */}
        {seo.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${seo.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${seo.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}

        {/* Facebook Pixel */}
        {seo.facebookPixelId && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${seo.facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
        
        {/* Organization Schema for Logo */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        
        {/* LocalBusiness Schema */}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex text-white flex-col">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
