"use client";
import React, { useState } from "react";
import { FaTimes, FaTools, FaFileAlt, FaToggleOn, FaToggleOff, FaImage, FaUpload, FaPlus, FaTrash } from "react-icons/fa";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (formData: FormData) => void;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    nameAr: "",
    shortDescription: "",
    shortDescriptionAr: "",
    longDescription: "",
    longDescriptionAr: "",
    metaTitle: "",
    metaDescription: "",
    features: [] as string[],
    featuresAr: [] as string[],
    faqs: [] as { question: string; answer: string }[],
    faqsAr: [] as { question: string; answer: string }[],
    status: "Active",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    nameAr: "",
    shortDescription: "",
    shortDescriptionAr: "",
    longDescription: "",
    longDescriptionAr: "",
    metaTitle: "",
    metaDescription: "",
    features: "",
    featuresAr: "",
    faqs: "",
    faqsAr: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateField("name", formData.name);
    const nameArError = validateField("nameAr", formData.nameAr);
    const shortDescError = validateField("shortDescription", formData.shortDescription);
    const shortDescArError = validateField("shortDescriptionAr", formData.shortDescriptionAr);
    const longDescError = validateField("longDescription", formData.longDescription);
    const longDescArError = validateField("longDescriptionAr", formData.longDescriptionAr);
    const metaTitleError = validateField("metaTitle", formData.metaTitle);
    const metaDescError = validateField("metaDescription", formData.metaDescription);
    const featuresError = formData.features.filter(f => f.trim()).length === 0 ? "At least one feature is required" : "";
    const featuresArError = formData.featuresAr.filter(f => f.trim()).length === 0 ? "At least one Arabic feature is required" : "";
    const faqsError = formData.faqs.length === 0 ? "At least one FAQ is required" : "";
    const faqsArError = formData.faqsAr.length === 0 ? "At least one Arabic FAQ is required" : "";
    
    if (nameError || nameArError || shortDescError || shortDescArError || longDescError || longDescArError || metaTitleError || metaDescError || featuresError || featuresArError || faqsError || faqsArError) {
      setErrors({
        name: nameError,
        nameAr: nameArError,
        shortDescription: shortDescError,
        shortDescriptionAr: shortDescArError,
        longDescription: longDescError,
        longDescriptionAr: longDescArError,
        metaTitle: metaTitleError,
        metaDescription: metaDescError,
        features: featuresError,
        featuresAr: featuresArError,
        faqs: faqsError,
        faqsAr: faqsArError,
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Create FormData object
      const data = new FormData();
      data.append("name", formData.name);
      data.append("nameAr", formData.nameAr);
      data.append("shortDescription", formData.shortDescription);
      data.append("shortDescriptionAr", formData.shortDescriptionAr);
      data.append("longDescription", formData.longDescription);
      data.append("longDescriptionAr", formData.longDescriptionAr);
      data.append("metaTitle", formData.metaTitle);
      data.append("metaDescription", formData.metaDescription);
      data.append("features", JSON.stringify(formData.features.filter(f => f.trim())));
      data.append("featuresAr", JSON.stringify(formData.featuresAr.filter(f => f.trim())));
      data.append("faqs", JSON.stringify(formData.faqs));
      data.append("faqsAr", JSON.stringify(formData.faqsAr));
      data.append("status", formData.status);
      
      if (imageFile) {
        data.append("image", imageFile);
      }

      // Call parent handler
      await onAdd(data);

      // Reset form
      setFormData({ 
        name: "", 
        nameAr: "",
        shortDescription: "", 
        shortDescriptionAr: "",
        longDescription: "",
        longDescriptionAr: "",
        metaTitle: "",
        metaDescription: "",
        features: [], 
        featuresAr: [],
        faqs: [], 
        faqsAr: [],
        status: "Active" 
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      // Error handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    
    if (name === "name") {
      if (value.length === 0) {
        error = "Service name (English) is required";
      } else if (value.length < 3) {
        error = `Service name must be at least 3 characters (${value.length}/3)`;
      } else if (value.length > 100) {
        error = `Service name must not exceed 100 characters (${value.length}/100)`;
      }
    }
    
    if (name === "nameAr") {
      if (value.length === 0) {
        error = "Service name (Arabic) is required";
      } else if (value.length < 3) {
        error = `Arabic name must be at least 3 characters (${value.length}/3)`;
      } else if (value.length > 100) {
        error = `Arabic name must not exceed 100 characters (${value.length}/100)`;
      }
    }
    
    if (name === "shortDescription") {
      if (value.length === 0) {
        error = "Short description (English) is required";
      } else if (value.length < 10) {
        error = `Short description must be at least 10 characters (${value.length}/10)`;
      } else if (value.length > 300) {
        error = `Short description must not exceed 300 characters (${value.length}/300)`;
      }
    }
    
    if (name === "shortDescriptionAr") {
      if (value.length === 0) {
        error = "Short description (Arabic) is required";
      } else if (value.length < 10) {
        error = `Arabic short description must be at least 10 characters (${value.length}/10)`;
      } else if (value.length > 300) {
        error = `Arabic short description must not exceed 300 characters (${value.length}/300)`;
      }
    }
    
    if (name === "longDescription") {
      if (value.length === 0) {
        error = "Long description (English) is required";
      } else if (value.length < 50) {
        error = `Long description must be at least 50 characters (${value.length}/50)`;
      }
    }
    
    if (name === "longDescriptionAr") {
      if (value.length === 0) {
        error = "Long description (Arabic) is required";
      } else if (value.length < 50) {
        error = `Arabic long description must be at least 50 characters (${value.length}/50)`;
      }
    }
    
    if (name === "metaTitle") {
      if (value.length > 0 && value.length < 10) {
        error = `Meta title should be at least 10 characters (${value.length}/10)`;
      } else if (value.length > 100) {
        error = `Meta title must not exceed 100 characters (${value.length}/100)`;
      }
    }
    
    if (name === "metaDescription") {
      if (value.length > 0 && value.length < 20) {
        error = `Meta description should be at least 20 characters (${value.length}/20)`;
      } else if (value.length > 300) {
        error = `Meta description must not exceed 300 characters (${value.length}/300)`;
      }
    }
    
    if (name === "features") {
      if (value.trim().length === 0) {
        error = "At least one feature is required";
      }
    }
    
    if (name === "featuresAr") {
      if (value.trim().length === 0) {
        error = "At least one Arabic feature is required";
      }
    }
    
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const features = value.split(",").map(f => f.trim()).filter(f => f);
    setFormData({
      ...formData,
      features,
    });
    
    const error = validateField("features", value);
    setErrors({
      ...errors,
      features: error,
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures,
    });
    
    const featuresError = newFeatures.filter(f => f.trim()).length === 0 ? "At least one feature is required" : "";
    setErrors({
      ...errors,
      features: featuresError,
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures,
    });
    
    const featuresError = newFeatures.length === 0 ? "At least one feature is required" : "";
    setErrors({
      ...errors,
      features: featuresError,
    });
  };

  // Arabic Features Handlers
  const addFeatureAr = () => {
    setFormData({
      ...formData,
      featuresAr: [...formData.featuresAr, ""],
    });
  };

  const updateFeatureAr = (index: number, value: string) => {
    const newFeatures = [...formData.featuresAr];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      featuresAr: newFeatures,
    });
    
    const featuresArError = newFeatures.filter(f => f.trim()).length === 0 ? "At least one Arabic feature is required" : "";
    setErrors({
      ...errors,
      featuresAr: featuresArError,
    });
  };

  const removeFeatureAr = (index: number) => {
    const newFeatures = formData.featuresAr.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      featuresAr: newFeatures,
    });
    
    const featuresArError = newFeatures.length === 0 ? "At least one Arabic feature is required" : "";
    setErrors({
      ...errors,
      featuresAr: featuresArError,
    });
  };

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: "", answer: "" }],
    });
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData({
      ...formData,
      faqs: newFaqs,
    });
    
    const faqsError = newFaqs.some(faq => !faq.question.trim() || !faq.answer.trim()) ? "All FAQ fields are required" : "";
    setErrors({
      ...errors,
      faqs: faqsError,
    });
  };

  const removeFaq = (index: number) => {
    const newFaqs = formData.faqs.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      faqs: newFaqs,
    });
    
    const faqsError = newFaqs.length === 0 ? "At least one FAQ is required" : newFaqs.some(faq => !faq.question.trim() || !faq.answer.trim()) ? "All FAQ fields are required" : "";
    setErrors({
      ...errors,
      faqs: faqsError,
    });
  };

  // Arabic FAQs Handlers
  const addFaqAr = () => {
    setFormData({
      ...formData,
      faqsAr: [...formData.faqsAr, { question: "", answer: "" }],
    });
  };

  const updateFaqAr = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...formData.faqsAr];
    newFaqs[index][field] = value;
    setFormData({
      ...formData,
      faqsAr: newFaqs,
    });
    
    const faqsArError = newFaqs.some(faq => !faq.question.trim() || !faq.answer.trim()) ? "All Arabic FAQ fields are required" : "";
    setErrors({
      ...errors,
      faqsAr: faqsArError,
    });
  };

  const removeFaqAr = (index: number) => {
    const newFaqs = formData.faqsAr.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      faqsAr: newFaqs,
    });
    
    const faqsArError = newFaqs.length === 0 ? "At least one Arabic FAQ is required" : newFaqs.some(faq => !faq.question.trim() || !faq.answer.trim()) ? "All Arabic FAQ fields are required" : "";
    setErrors({
      ...errors,
      faqsAr: faqsArError,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 transform transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-primaryBlue to-heroBlue text-white p-6 rounded-t-2xl shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accentYellow p-3 rounded-lg">
                <FaTools className="text-primaryBlue text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New Service</h2>
                <p className="text-sm opacity-90">Fill in the service details below</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-accentYellow transition p-2"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {/* Service Name */}
            <div>
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaTools className="text-heroBlue" />
                Service Name (English)
                <span className="text-xs text-gray-500 font-normal ml-auto">
                  {formData.name.length}/100
                </span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-heroBlue/20 outline-none transition text-gray-800 ${
                  errors.name ? "border-red-500" : "border-gray-300 focus:border-heroBlue"
                }`}
                placeholder="e.g., Air Conditioning Installation"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.name}
                </p>
              )}
            </div>

            {/* Service Name Arabic */}
            <div>
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaTools className="text-heroBlue" />
                Service Name (Arabic - اسم الخدمة)
                <span className="text-xs text-gray-500 font-normal ml-auto">
                  {formData.nameAr.length}/100
                </span>
              </label>
              <input
                type="text"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleChange}
                maxLength={100}
                dir="rtl"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-heroBlue/20 outline-none transition text-gray-800 ${
                  errors.nameAr ? "border-red-500" : "border-gray-300 focus:border-heroBlue"
                }`}
                placeholder="مثال: تركيب أجهزة التكييف"
              />
              {errors.nameAr && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.nameAr}
                </p>
              )}
            </div>

            {/* Short Description */}
            <div>
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaFileAlt className="text-heroBlue" />
                Short Description (English)
                <span className="text-xs text-gray-500 font-normal ml-auto">
                  {formData.shortDescription.length}/300
                </span>
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={3}
                maxLength={300}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-heroBlue/20 outline-none transition resize-none text-gray-800 ${
                  errors.shortDescription ? "border-red-500" : "border-gray-300 focus:border-heroBlue"
                }`}
                placeholder="Brief description for home page (10-300 characters)"
              />
              {errors.shortDescription && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.shortDescription}
                </p>
              )}
            </div>

            {/* Short Description Arabic */}
            <div>
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaFileAlt className="text-heroBlue" />
                Short Description (Arabic - الوصف المختصر)
                <span className="text-xs text-gray-500 font-normal ml-auto">
                  {formData.shortDescriptionAr.length}/300
                </span>
              </label>
              <textarea
                name="shortDescriptionAr"
                value={formData.shortDescriptionAr}
                onChange={handleChange}
                rows={3}
                maxLength={300}
                dir="rtl"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-heroBlue/20 outline-none transition resize-none text-gray-800 ${
                  errors.shortDescriptionAr ? "border-red-500" : "border-gray-300 focus:border-heroBlue"
                }`}
                placeholder="وصف مختصر للصفحة الرئيسية (10-300 حرف)"
              />
              {errors.shortDescriptionAr && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.shortDescriptionAr}
                </p>
              )}
            </div>

            {/* Long Description */}
            <div>
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaFileAlt className="text-heroBlue" />
                Long Description (English)
                <span className="text-xs text-gray-500 font-normal ml-auto">
                  {formData.longDescription.length} characters (min 50)
                </span>
              </label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-heroBlue/20 outline-none transition resize-none text-gray-800 ${
                  errors.longDescription ? "border-red-500" : "border-gray-300 focus:border-heroBlue"
                }`}
                placeholder="Detailed description for service page (minimum 50 characters)"
              />
              {errors.longDescription && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.longDescription}
                </p>
              )}
            </div>

            {/* Long Description Arabic */}
            <div>
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaFileAlt className="text-heroBlue" />
                Long Description (Arabic - الوصف التفصيلي)
                <span className="text-xs text-gray-500 font-normal ml-auto">
                  {formData.longDescriptionAr.length} حرف (الحد الأدنى 50)
                </span>
              </label>
              <textarea
                name="longDescriptionAr"
                value={formData.longDescriptionAr}
                onChange={handleChange}
                rows={5}
                dir="rtl"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-heroBlue/20 outline-none transition resize-none text-gray-800 ${
                  errors.longDescriptionAr ? "border-red-500" : "border-gray-300 focus:border-heroBlue"
                }`}
                placeholder="وصف تفصيلي لصفحة الخدمة (الحد الأدنى 50 حرفاً)"
              />
              {errors.longDescriptionAr && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.longDescriptionAr}
                </p>
              )}
            </div>

            {/* Meta Title (Optional SEO Field) */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaFileAlt className="text-heroBlue" />
                Meta Title <span className="text-xs text-gray-500 font-normal">(Optional for SEO)</span>
                <span className="text-xs text-gray-500 font-normal ml-auto">
                  {formData.metaTitle.length}/100
                </span>
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                maxLength={100}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-heroBlue/20 outline-none transition text-gray-800 ${
                  errors.metaTitle ? "border-red-500" : "border-gray-300 focus:border-heroBlue"
                }`}
                placeholder="Custom SEO title for search results (leave empty to auto-generate)"
              />
              {errors.metaTitle && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.metaTitle}
                </p>
              )}
              <p className="text-xs text-gray-600 mt-1">
                💡 Recommended: 50-60 characters. If empty, service name will be used.
              </p>
            </div>

            {/* Meta Description (Optional SEO Field) */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaFileAlt className="text-heroBlue" />
                Meta Description <span className="text-xs text-gray-500 font-normal">(Optional for SEO)</span>
                <span className="text-xs text-gray-500 font-normal ml-auto">
                  {formData.metaDescription.length}/300
                </span>
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={3}
                maxLength={300}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-heroBlue/20 outline-none transition resize-none text-gray-800 ${
                  errors.metaDescription ? "border-red-500" : "border-gray-300 focus:border-heroBlue"
                }`}
                placeholder="Custom SEO description for search results (leave empty to auto-generate)"
              />
              {errors.metaDescription && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.metaDescription}
                </p>
              )}
              <p className="text-xs text-gray-600 mt-1">
                💡 Recommended: 150-160 characters. If empty, short description will be used.
              </p>
            </div>

            {/* Features */}
            <div>
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaTools className="text-heroBlue" />
                Features (English)
              </label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder={`Feature ${index + 1}`}
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBlue/20 focus:border-heroBlue outline-none transition text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <FaPlus /> Add Feature
              </button>
              {errors.features && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.features}
                </p>
              )}
            </div>

            {/* Features Arabic */}
            <div>
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaTools className="text-heroBlue" />
                Features (Arabic - الميزات)
              </label>
              {formData.featuresAr.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder={`ميزة ${index + 1}`}
                    value={feature}
                    onChange={(e) => updateFeatureAr(index, e.target.value)}
                    dir="rtl"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-heroBlue/20 focus:border-heroBlue outline-none transition text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeatureAr(index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeatureAr}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <FaPlus /> إضافة ميزة
              </button>
              {errors.featuresAr && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.featuresAr}
                </p>
              )}
            </div>

            {/* Service Image */}
            <div>
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaImage className="text-heroBlue" />
                Service Image
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-heroBlue transition cursor-pointer">
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="bg-gray-100 p-4 rounded-full">
                      <FaUpload className="text-3xl text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Click to upload image</p>
                      <p className="text-gray-500 text-sm mt-1">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>

            {/* FAQs */}
            <div>
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaFileAlt className="text-heroBlue" />
                FAQs (English)
              </label>
              {formData.faqs.map((faq, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">FAQ {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => updateFaq(index, "question", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-black focus:ring-2 focus:ring-heroBlue/20 outline-none"
                  />
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, "answer", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:ring-2 focus:ring-heroBlue/20 outline-none resize-none"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addFaq}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <FaPlus /> Add FAQ
              </button>
              {errors.faqs && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.faqs}
                </p>
              )}
            </div>

            {/* FAQs Arabic */}
            <div>
              <label className="flex text-gray-700 font-semibold mb-2 items-center gap-2">
                <FaFileAlt className="text-heroBlue" />
                FAQs (Arabic - الأسئلة الشائعة)
              </label>
              {formData.faqsAr.map((faq, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">سؤال {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFaqAr(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="السؤال"
                    value={faq.question}
                    onChange={(e) => updateFaqAr(index, "question", e.target.value)}
                    dir="rtl"
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-black focus:ring-2 focus:ring-heroBlue/20 outline-none"
                  />
                  <textarea
                    placeholder="الإجابة"
                    value={faq.answer}
                    onChange={(e) => updateFaqAr(index, "answer", e.target.value)}
                    rows={2}
                    dir="rtl"
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:ring-2 focus:ring-heroBlue/20 outline-none resize-none"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addFaqAr}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <FaPlus /> إضافة سؤال
              </button>
              {errors.faqsAr && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.faqsAr}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="flex text-gray-700 font-semibold mb-3 items-center gap-2">
                {formData.status === "Active" ? (
                  <FaToggleOn className="text-green-500 text-xl" />
                ) : (
                  <FaToggleOff className="text-gray-400 text-xl" />
                )}
                Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={formData.status === "Active"}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-500"
                  />
                  <span className="text-gray-700 font-medium">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={formData.status === "Inactive"}
                    onChange={handleChange}
                    className="w-4 h-4 text-gray-400"
                  />
                  <span className="text-gray-700 font-medium">Inactive</span>
                </label>
              </div>
            </div>
          </div>
          

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex gap-4 p-6 pt-4 border-t bg-gray-50 shrink-0 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-accentYellow text-primaryBlue font-bold rounded-lg hover:bg-primaryBlue hover:text-accentYellow transition shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primaryBlue"></div>
                  <span>Adding...</span>
                </>
              ) : (
                "Add Service"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
