"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

interface SEOData {
  _id?: string;
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string[];
  siteUrl: string;
  businessName: string;
  businessNameArabic: string;
  phoneNumber: string;
  email: string;
  address: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  googleAnalyticsId: string;
  googleAdsId: string;
  googleAdsConversionLabel: string;
  googleSiteVerification: string;
  facebookPixelId: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  businessType: string;
  priceRange: string;
  operatingHours: string;
  allowIndexing: boolean;
  allowFollowLinks: boolean;
  footerText: string;
  copyrightText: string;
}

const SEOPage = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [seoData, setSeoData] = useState<SEOData>({
    siteTitle: "",
    siteDescription: "",
    siteKeywords: [],
    siteUrl: "",
    businessName: "",
    businessNameArabic: "",
    phoneNumber: "",
    email: "",
    address: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    googleAnalyticsId: "",
    googleAdsId: "",
    googleAdsConversionLabel: "",
    googleSiteVerification: "",
    facebookPixelId: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    businessType: "LocalBusiness",
    priceRange: "$$",
    operatingHours: "24/7",
    allowIndexing: true,
    allowFollowLinks: true,
    footerText: "",
    copyrightText: "",
  });

  const [keywordInput, setKeywordInput] = useState("");

  // Verify authentication
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        
        if (!data.authenticated) {
          router.push("/admin/login?redirect=/admin/seo");
          return;
        }
        
        setIsAuthenticating(false);
      } catch (error) {
        router.push("/admin/login?redirect=/admin/seo");
      }
    };

    verifyAuth();
  }, [router]);

  // Fetch SEO data
  useEffect(() => {
    if (!isAuthenticating) {
      fetchSEOData();
    }
  }, [isAuthenticating]);

  const fetchSEOData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/seo");
      const data = await response.json();
      
      if (data.success) {
        setSeoData(data.seo);
      }
    } catch (error) {
      console.error("Error fetching SEO data:", error);
      setErrorMessage("Failed to load SEO settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setSeoData(prev => ({ ...prev, [name]: checked }));
    } else {
      setSeoData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      setSeoData(prev => ({
        ...prev,
        siteKeywords: [...prev.siteKeywords, keywordInput.trim()]
      }));
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setSeoData(prev => ({
      ...prev,
      siteKeywords: prev.siteKeywords.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setSaving(true);

    try {
      const response = await fetch("/api/seo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seoData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("SEO settings saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(data.error || "Failed to save SEO settings");
      }
    } catch (error) {
      setErrorMessage("Failed to save SEO settings");
    } finally {
      setSaving(false);
    }
  };

  if (isAuthenticating || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SEO settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "basic", label: "Basic SEO" },
    { id: "contact", label: "Contact Info" },
    { id: "social", label: "Social Media" },
    { id: "tracking", label: "Tracking & Analytics" },
    { id: "advanced", label: "Advanced" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-primaryBlue"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primaryBlue">SEO Settings</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your website's SEO and metadata</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errorMessage}
            </div>
          )}

          <div className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-primaryBlue text-primaryBlue"
                        : "border-transparent text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Basic SEO Tab */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Site Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="siteTitle"
                      value={seoData.siteTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="Ali Air Conditioning & Refrigeration"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">Appears in browser tabs and search results (max 60 chars recommended)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Site Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="siteDescription"
                      value={seoData.siteDescription}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="Professional air conditioning services..."
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">Meta description for search engines (max 160 chars recommended)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Site Keywords
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                        placeholder="Add keyword and press Enter"
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="px-4 py-2 bg-primaryBlue text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {seoData.siteKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Site URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="siteUrl"
                      value={seoData.siteUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="https://www.aliacservicesksa.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="allowIndexing"
                          checked={seoData.allowIndexing}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primaryBlue focus:ring-primaryBlue"
                        />
                        <span className="text-sm font-medium text-gray-700">Allow Search Engine Indexing</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="allowFollowLinks"
                          checked={seoData.allowFollowLinks}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primaryBlue focus:ring-primaryBlue"
                        />
                        <span className="text-sm font-medium text-gray-700">Allow Following Links</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Info Tab */}
              {activeTab === "contact" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Name (English) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={seoData.businessName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Name (Arabic)
                      </label>
                      <input
                        type="text"
                        name="businessNameArabic"
                        value={seoData.businessNameArabic}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={seoData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                        placeholder="+966502575350"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={seoData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                        placeholder="info@aliacservicesksa.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Address
                    </label>
                    <textarea
                      name="address"
                      value={seoData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="Medina, Saudi Arabia"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Type
                      </label>
                      <input
                        type="text"
                        name="businessType"
                        value={seoData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                        placeholder="LocalBusiness"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price Range
                      </label>
                      <select
                        name="priceRange"
                        value={seoData.priceRange}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      >
                        <option value="$">$ (Budget)</option>
                        <option value="$$">$$ (Moderate)</option>
                        <option value="$$$">$$$ (Premium)</option>
                        <option value="$$$$">$$$$ (Luxury)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Operating Hours
                      </label>
                      <input
                        type="text"
                        name="operatingHours"
                        value={seoData.operatingHours}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                        placeholder="24/7"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Tab */}
              {activeTab === "social" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={seoData.facebook}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Twitter/X URL
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={seoData.twitter}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={seoData.instagram}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={seoData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      name="youtube"
                      value={seoData.youtube}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="https://youtube.com/@yourchannel"
                    />
                  </div>
                </div>
              )}

              {/* Tracking & Analytics Tab */}
              {activeTab === "tracking" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      name="googleAnalyticsId"
                      value={seoData.googleAnalyticsId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="G-XXXXXXXXXX"
                    />
                    <p className="text-sm text-gray-500 mt-1">Format: G-XXXXXXXXXX</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Google Ads Conversion ID
                    </label>
                    <input
                      type="text"
                      name="googleAdsId"
                      value={seoData.googleAdsId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="AW-XXXXXXXXX"
                    />
                    <p className="text-sm text-gray-500 mt-1">Format: AW-XXXXXXXXX</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Google Ads Conversion Label
                    </label>
                    <input
                      type="text"
                      name="googleAdsConversionLabel"
                      value={seoData.googleAdsConversionLabel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="AbCdEfGhIjK"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Google Site Verification Code
                    </label>
                    <input
                      type="text"
                      name="googleSiteVerification"
                      value={seoData.googleSiteVerification}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      name="facebookPixelId"
                      value={seoData.facebookPixelId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="XXXXXXXXXXXXXXXX"
                    />
                  </div>
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === "advanced" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Open Graph Title (for social sharing)
                    </label>
                    <input
                      type="text"
                      name="ogTitle"
                      value={seoData.ogTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="Leave empty to use site title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Open Graph Description
                    </label>
                    <textarea
                      name="ogDescription"
                      value={seoData.ogDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="Leave empty to use site description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Open Graph Image URL
                    </label>
                    <input
                      type="url"
                      name="ogImage"
                      value={seoData.ogImage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="https://yoursite.com/og-image.jpg"
                    />
                    <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x630 pixels</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Footer Text
                    </label>
                    <textarea
                      name="footerText"
                      value={seoData.footerText}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="Additional footer information..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Copyright Text
                    </label>
                    <input
                      type="text"
                      name="copyrightText"
                      value={seoData.copyrightText}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="© 2024 Your Company. All rights reserved."
                    />
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/admin/dashboard")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-primaryBlue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save SEO Settings"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SEOPage;
