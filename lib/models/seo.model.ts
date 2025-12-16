import mongoose, { Document, Schema } from "mongoose";

interface ISEO extends Document {
  // Basic SEO
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string[];
  siteUrl: string;
  
  // Contact Information
  businessName: string;
  businessNameArabic: string;
  phoneNumber: string;
  email?: string;
  address: string;
  
  // Social Media Links
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  
  // Advanced SEO
  googleAnalyticsId?: string;
  googleAdsId?: string;
  googleAdsConversionLabel?: string;
  googleSiteVerification?: string;
  facebookPixelId?: string;
  
  // OpenGraph Settings
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  
  // Schema.org Settings
  businessType: string;
  priceRange: string;
  operatingHours: string;
  
  // Robots & Indexing
  allowIndexing: boolean;
  allowFollowLinks: boolean;
  
  // Additional
  footerText?: string;
  copyrightText?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const SEOSchema = new Schema<ISEO>(
  {
    // Basic SEO
    siteTitle: {
      type: String,
      required: [true, "Site title is required"],
      trim: true,
      maxlength: [100, "Site title must not exceed 100 characters"],
      default: "Ali Air Conditioning & Refrigeration | مؤسسة علي للتكييف والتبريد",
    },
    siteDescription: {
      type: String,
      required: [true, "Site description is required"],
      trim: true,
      maxlength: [300, "Site description must not exceed 300 characters"],
      default: "Professional air conditioning and refrigeration services in Saudi Arabia. Expert AC installation, maintenance, and repair available 24/7.",
    },
    siteKeywords: {
      type: [String],
      default: [
        "air conditioning Saudi Arabia",
        "AC repair",
        "refrigeration services",
        "AC installation",
        "AC maintenance",
        "cooling services",
        "تكييف السعودية",
        "صيانة تكييف",
        "تبريد وتكييف",
      ],
    },
    siteUrl: {
      type: String,
      required: [true, "Site URL is required"],
      default: "https://www.aliacservicesksa.com",
    },
    
    // Contact Information
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      default: "Ali Air Conditioning & Refrigeration",
    },
    businessNameArabic: {
      type: String,
      default: "مؤسسة علي للتكييف والتبريد",
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      default: "+966502575350",
    },
    email: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      default: "Medina, Al Madinah al-Munawwarah Region, Saudi Arabia",
    },
    
    // Social Media
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String,
    
    // Advanced SEO
    googleAnalyticsId: String,
    googleAdsId: String,
    googleAdsConversionLabel: String,
    googleSiteVerification: String,
    facebookPixelId: String,
    
    // OpenGraph
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    
    // Schema.org
    businessType: {
      type: String,
      default: "LocalBusiness",
    },
    priceRange: {
      type: String,
      default: "$$",
    },
    operatingHours: {
      type: String,
      default: "24/7",
    },
    
    // Robots
    allowIndexing: {
      type: Boolean,
      default: true,
    },
    allowFollowLinks: {
      type: Boolean,
      default: true,
    },
    
    // Additional
    footerText: String,
    copyrightText: {
      type: String,
      default: "© 2025 Ali Air Conditioning & Refrigeration. All rights reserved.",
    },
  },
  {
    timestamps: true,
  }
);

// Remove the _id index - MongoDB handles this automatically
// SEOSchema.index({ _id: 1 }, { unique: true });

const SEO = mongoose.models.SEO || mongoose.model<ISEO>("SEO", SEOSchema);

export default SEO;
export type { ISEO };
