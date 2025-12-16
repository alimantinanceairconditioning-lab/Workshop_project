import SEO from "@/lib/models/seo.model";
import PageSEO from "@/lib/models/pageSeo.model";
import connectDB from "@/lib/db";

export async function getSEOData(pageId?: string) {
  try {
    // Only connect to DB if not in build time
    const connection = await connectDB();
    
    // If no DB connection, return defaults
    if (!connection) {
      return getDefaultSEO();
    }
    
    // Get global SEO settings
    const seo: any = await SEO.findOne().lean();
    
    // If pageId is provided, get page-specific SEO
    if (pageId) {
      const pageSEO: any = await PageSEO.findOne({ pageId }).lean();
      
      if (pageSEO) {
        // Merge page-specific SEO with global settings
        return {
          _id: seo?._id?.toString() || "",
          siteTitle: pageSEO.metaTitle || seo?.siteTitle || "Ali Air Conditioning & Refrigeration",
          siteDescription: pageSEO.metaDescription || seo?.siteDescription || "Professional air conditioning services",
          siteKeywords: pageSEO.metaKeywords.length > 0 ? pageSEO.metaKeywords : (seo?.siteKeywords || []),
          siteUrl: seo?.siteUrl || "https://www.aliacservicesksa.com",
          businessName: seo?.businessName || "Ali Air Conditioning & Refrigeration",
          businessNameArabic: seo?.businessNameArabic || "مؤسسة علي للتكييف والتبريد",
          phoneNumber: seo?.phoneNumber || "+966502575350",
          address: seo?.address || "Medina, Saudi Arabia",
          businessType: seo?.businessType || "LocalBusiness",
          priceRange: seo?.priceRange || "$$",
          operatingHours: seo?.operatingHours || "24/7",
          allowIndexing: pageSEO.robotsIndex !== undefined ? pageSEO.robotsIndex : (seo?.allowIndexing || true),
          allowFollowLinks: pageSEO.robotsFollow !== undefined ? pageSEO.robotsFollow : (seo?.allowFollowLinks || true),
          copyrightText: seo?.copyrightText || "© 2024 Ali Air Conditioning & Refrigeration. All rights reserved.",
          ogTitle: pageSEO.ogTitle || pageSEO.metaTitle || seo?.ogTitle,
          ogDescription: pageSEO.ogDescription || pageSEO.metaDescription || seo?.ogDescription,
          ogImage: pageSEO.ogImage || seo?.ogImage,
          googleSiteVerification: seo?.googleSiteVerification,
          googleAdsId: seo?.googleAdsId,
          googleAnalyticsId: seo?.googleAnalyticsId,
          facebookPixelId: seo?.facebookPixelId,
          email: seo?.email,
          facebook: seo?.facebook,
          twitter: seo?.twitter,
          instagram: seo?.instagram,
          linkedin: seo?.linkedin,
          youtube: seo?.youtube,
          canonicalUrl: pageSEO.canonicalUrl,
          schemaType: pageSEO.schemaType || "WebPage",
        };
      }
    }
    
    // Return global SEO if no page-specific data found
    
    if (!seo) {
      // Return defaults if no SEO data exists
      return getDefaultSEO();
    }
    
    // Convert MongoDB _id to string and ensure all fields have values
    return {
      _id: seo._id?.toString() || "",
      siteTitle: seo.siteTitle || "Ali Air Conditioning & Refrigeration | مؤسسة علي للتكييف والتبريد",
      siteDescription: seo.siteDescription || "Professional air conditioning and refrigeration services in Saudi Arabia. Expert AC installation, maintenance, and repair available 24/7.",
      siteKeywords: seo.siteKeywords || ["air conditioning Saudi Arabia", "AC repair", "refrigeration services"],
      siteUrl: seo.siteUrl || "https://www.aliacservicesksa.com",
      businessName: seo.businessName || "Ali Air Conditioning & Refrigeration",
      businessNameArabic: seo.businessNameArabic || "مؤسسة علي للتكييف والتبريد",
      phoneNumber: seo.phoneNumber || "+966502575350",
      address: seo.address || "Medina, Saudi Arabia",
      businessType: seo.businessType || "LocalBusiness",
      priceRange: seo.priceRange || "$$",
      operatingHours: seo.operatingHours || "24/7",
      allowIndexing: seo.allowIndexing !== undefined ? seo.allowIndexing : true,
      allowFollowLinks: seo.allowFollowLinks !== undefined ? seo.allowFollowLinks : true,
      copyrightText: seo.copyrightText || "© 2025 Ali Air Conditioning & Refrigeration. All rights reserved.",
      ogTitle: seo.ogTitle || undefined,
      ogDescription: seo.ogDescription || undefined,
      ogImage: seo.ogImage || undefined,
      googleSiteVerification: seo.googleSiteVerification || undefined,
      googleAdsId: seo.googleAdsId || undefined,
      googleAnalyticsId: seo.googleAnalyticsId || undefined,
      facebookPixelId: seo.facebookPixelId || undefined,
      email: seo.email || undefined,
      facebook: seo.facebook || undefined,
      twitter: seo.twitter || undefined,
      instagram: seo.instagram || undefined,
      linkedin: seo.linkedin || undefined,
      youtube: seo.youtube || undefined,
    };
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    // Return defaults if DB connection fails (e.g., during build)
    return getDefaultSEO();
  }
}

function getDefaultSEO() {
  return {
    _id: "",
    siteTitle: "Ali Air Conditioning & Refrigeration | مؤسسة علي للتكييف والتبريد",
    siteDescription: "Professional air conditioning and refrigeration services in Saudi Arabia. Expert AC installation, maintenance, and repair available 24/7.",
    siteKeywords: ["air conditioning Saudi Arabia", "AC repair", "refrigeration services"],
    siteUrl: "https://www.aliacservicesksa.com",
    businessName: "Ali Air Conditioning & Refrigeration",
    businessNameArabic: "مؤسسة علي للتكييف والتبريد",
    phoneNumber: "+966502575350",
    address: "Medina, Saudi Arabia",
    businessType: "LocalBusiness",
    priceRange: "$$",
    operatingHours: "24/7",
    allowIndexing: true,
    allowFollowLinks: true,
    copyrightText: "© 2025 Ali Air Conditioning & Refrigeration. All rights reserved.",
    ogTitle: undefined,
    ogDescription: undefined,
    ogImage: undefined,
    googleSiteVerification: undefined,
    googleAdsId: undefined,
    googleAnalyticsId: undefined,
    facebookPixelId: undefined,
    email: undefined,
    facebook: undefined,
    twitter: undefined,
    instagram: undefined,
    linkedin: undefined,
    youtube: undefined,
  };
}
