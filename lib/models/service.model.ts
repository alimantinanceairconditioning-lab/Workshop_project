import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

interface IService extends Document {
    name: string;
    nameAr?: string;              // Arabic name (optional)
    slug: string;
    shortDescription: string;     // home page wali short description
    shortDescriptionAr?: string;  // Arabic short description (optional)
    longDescription: string;      // detail page wali lambi description
    longDescriptionAr?: string;   // Arabic long description (optional)
    metaTitle?: string;           // SEO meta title (optional)
    metaDescription?: string;     // SEO meta description (optional)
    features: string[];           // what we fix / kya include hai
    featuresAr?: string[];        // Arabic features (optional)
    faqs: { question: string; answer: string }[];
    faqsAr?: { question: string; answer: string }[]; // Arabic FAQs (optional)
    image: string;
    gallery: string[];            // extra images for detail page
    status: "Active" | "Inactive";
    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },

        nameAr: {
            type: String,
            required: false,
            trim: true,
            maxlength: 100,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
        },

        shortDescription: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 300,
        },

        shortDescriptionAr: {
            type: String,
            required: false,
            trim: true,
            maxlength: 300,
        },

        longDescription: {
            type: String,
            required: true,
            trim: true,
            minlength: 50,
        },

        longDescriptionAr: {
            type: String,
            required: false,
            trim: true,
        },

        metaTitle: {
            type: String,
            required: false,
            trim: true,
            maxlength: 100,
        },

        metaDescription: {
            type: String,
            required: false,
            trim: true,
            maxlength: 300,
        },

        features: [
            {
                type: String,
                trim: true,
            },
        ],

        featuresAr: [
            {
                type: String,
                trim: true,
            },
        ],

        faqs: [
            {
                question: { type: String, required: true, trim: true },
                answer: { type: String, required: true, trim: true },
            },
        ],

        faqsAr: [
            {
                question: { type: String, trim: true },
                answer: { type: String, trim: true },
            },
        ],

        image: {
            type: String,
            default: "",
        },

        gallery: [
            {
                type: String,
            },
        ],

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    { timestamps: true }
);

// ⭐ Auto-generate slug from name
ServiceSchema.pre("validate", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            trim: true,
        });
    }
    next();
});

// Indexes for performance
ServiceSchema.index({ name: 1 });

// Force delete existing model to ensure schema updates are applied
if (mongoose.models.Service) {
    delete mongoose.models.Service;
}

const Service = mongoose.model<IService>("Service", ServiceSchema);

export default Service;
export type { IService };
