import type { Metadata } from 'next';
import { getSEOData } from "@/lib/getSEOData";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOData('thank-you');
  
  return {
    title: "Thank You",
    description: `Thank you for contacting ${seo.businessName}. We have received your message and will get back to you within 24 hours. For urgent matters, call ${seo.phoneNumber}.`,
    keywords: [...seo.siteKeywords, "thank you", "form submitted", "confirmation"],
    openGraph: {
      title: `Thank You - ${seo.businessName}`,
      description: `Thank you for contacting ${seo.businessName}. We will respond to your inquiry soon.`,
      url: `${seo.siteUrl}/thank-you`,
      siteName: seo.businessName,
      images: seo.ogImage ? [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${seo.businessName} - Thank You`,
        },
      ] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Thank You - ${seo.businessName}`,
      description: `Thank you for contacting ${seo.businessName}. We will respond to your inquiry soon.`,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    robots: {
      index: false, // Don't index thank you pages
      follow: false,
    },
  };
}

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
