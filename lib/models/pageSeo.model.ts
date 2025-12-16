import mongoose, { Document, Schema } from "mongoose";

interface IPageSEO extends Document {
  // Page Identifier
  pageId: string; // 'home', 'about', 'contact', 'services', 'gallery', or service slug
  pageName: string; // Display name
  
  // SEO Meta Tags
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  
  // OpenGraph Tags
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  
  // Twitter Card Tags
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  
  // Additional Settings
  canonicalUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  
  // Schema.org specific to page
  schemaType?: string; // 'WebPage', 'AboutPage', 'ContactPage', etc.
  
  // Status
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const PageSEOSchema = new Schema<IPageSEO>(
  {
    pageId: {
      type: String,
      required: [true, "Page ID is required"],
      unique: true,
      // Removed enum to allow dynamic service slugs
    },
    pageName: {
      type: String,
      required: [true, "Page name is required"],
    },
    metaTitle: {
      type: String,
      required: [true, "Meta title is required"],
      trim: true,
      maxlength: [100, "Meta title must not exceed 100 characters"],
    },
    metaDescription: {
      type: String,
      required: [true, "Meta description is required"],
      trim: true,
      maxlength: [300, "Meta description must not exceed 300 characters"],
    },
    metaKeywords: {
      type: [String],
      default: [],
    },
    ogTitle: {
      type: String,
      trim: true,
    },
    ogDescription: {
      type: String,
      trim: true,
    },
    ogImage: {
      type: String,
    },
    ogUrl: {
      type: String,
    },
    twitterTitle: {
      type: String,
      trim: true,
    },
    twitterDescription: {
      type: String,
      trim: true,
    },
    twitterImage: {
      type: String,
    },
    canonicalUrl: {
      type: String,
    },
    robotsIndex: {
      type: Boolean,
      default: true,
    },
    robotsFollow: {
      type: Boolean,
      default: true,
    },
    schemaType: {
      type: String,
      default: 'WebPage',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PageSEO = mongoose.models.PageSEO || mongoose.model<IPageSEO>("PageSEO", PageSEOSchema);

export default PageSEO;
export type { IPageSEO };
