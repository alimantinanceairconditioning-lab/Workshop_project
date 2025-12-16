import mongoose, { Document, Schema } from "mongoose";

interface IProject extends Document {
    title: string;
    titleAr?: string;          // Arabic title (optional)
    description: string;
    descriptionAr?: string;    // Arabic description (optional)
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: [true, "Project title is required"],
            trim: true,
            minlength: [3, "Project title must be at least 3 characters"],
            maxlength: [200, "Project title must not exceed 200 characters"],
        },
        titleAr: {
            type: String,
            required: false,
            trim: true,
            maxlength: [200, "Arabic title must not exceed 200 characters"],
        },
        description: {
            type: String,
            required: [true, "Project description is required"],
            trim: true,
            minlength: [10, "Description must be at least 10 characters"],
        },
        descriptionAr: {
            type: String,
            required: false,
            trim: true,
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: function (v: string[]) {
                    return v.length >= 1;
                },
                message: "At least one image is required for a project",
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
ProjectSchema.index({ title: 1 });
ProjectSchema.index({ createdAt: -1 });

// Prevent model recompilation in development (Next.js hot reload)
const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
export type { IProject };
