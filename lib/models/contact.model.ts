import mongoose, { Document, Schema } from "mongoose";

interface IContact extends Document {
    firstName: string;
    lastName: string;
    serviceType: string;
    phoneNumber: string;
    message: string;
    status: "Pending" | "In Progress" | "Completed" | "Cancelled";
    createdAt: Date;
    updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: [2, "First name must be at least 2 characters"],
            maxlength: [50, "First name must not exceed 50 characters"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minlength: [2, "Last name must be at least 2 characters"],
            maxlength: [50, "Last name must not exceed 50 characters"],
        },
        serviceType: {
            type: String,
            required: [true, "Service type is required"],
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            validate: {
                validator: function(v: string) {
                    // Validates international phone numbers
                    return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(v);
                },
                message: "Please enter a valid phone number",
            },
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            minlength: [10, "Message must be at least 10 characters"],
            maxlength: [1000, "Message must not exceed 1000 characters"],
        },
        status: {
            type: String,
            enum: {
                values: ["Pending", "In Progress", "Completed", "Cancelled"],
                message: "Status must be Pending, In Progress, Completed, or Cancelled",
            },
            default: "Pending",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for full name
ContactSchema.virtual("fullName").get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Indexes for better query performance
ContactSchema.index({ firstName: 1, lastName: 1 });
ContactSchema.index({ serviceType: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ phoneNumber: 1 });

// Prevent model recompilation in development (Next.js hot reload)
const Contact = mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
export type { IContact };
