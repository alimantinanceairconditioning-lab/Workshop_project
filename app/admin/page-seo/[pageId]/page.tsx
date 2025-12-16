"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { ArrowLeft, Save } from "lucide-react";

interface PageSEOData {
  _id?: string;
  pageId: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  schemaType?: string;
  isActive: boolean;
}

const PageSEOEditor = () => {
  const router = useRouter();
  const params = useParams();
  const pageId = params.pageId as string;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const [seoData, setSeoData] = useState<PageSEOData>({
    pageId: pageId,
    pageName: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogUrl: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    canonicalUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    schemaType: "WebPage",
    isActive: true,
  });

  useEffect(() => {
    fetchPageSEO();
  }, [pageId]);

  const fetchPageSEO = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/page-seo?pageId=${pageId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setSeoData(data.data);
      }
    } catch (error) {
      console.error("Error fetching page SEO:", error);
      setErrorMessage("Failed to load page SEO data");
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
        metaKeywords: [...prev.metaKeywords, keywordInput.trim()]
      }));
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setSeoData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setSaving(true);

    try {
      const response = await fetch("/api/page-seo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seoData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("Page SEO settings saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(data.error || "Failed to save page SEO settings");
      }
    } catch (error) {
      setErrorMessage("Failed to save page SEO settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page SEO settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "basic", label: "Basic Meta Tags" },
    { id: "opengraph", label: "Open Graph" },
    { id: "twitter", label: "Twitter Cards" },
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
                onClick={() => router.push("/admin/page-seo")}
                className="text-gray-600 hover:text-primaryBlue"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primaryBlue">{seoData.pageName} SEO</h1>
                <p className="text-sm text-gray-600 mt-1">Edit SEO settings for this page</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
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
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={seoData.metaTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="Enter meta title"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">Max 60 characters recommended</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="metaDescription"
                      value={seoData.metaDescription}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="Enter meta description"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">Max 160 characters recommended</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Keywords
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
                      {seoData.metaKeywords.map((keyword, index) => (
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
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      name="canonicalUrl"
                      value={seoData.canonicalUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="https://example.com/page"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="robotsIndex"
                          checked={seoData.robotsIndex}
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
                          name="robotsFollow"
                          checked={seoData.robotsFollow}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primaryBlue focus:ring-primaryBlue"
                        />
                        <span className="text-sm font-medium text-gray-700">Allow Following Links</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "opengraph" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      OG Title
                    </label>
                    <input
                      type="text"
                      name="ogTitle"
                      value={seoData.ogTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="Leave empty to use Meta Title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      OG Description
                    </label>
                    <textarea
                      name="ogDescription"
                      value={seoData.ogDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="Leave empty to use Meta Description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      OG Image URL
                    </label>
                    <input
                      type="url"
                      name="ogImage"
                      value={seoData.ogImage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x630 pixels</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      OG URL
                    </label>
                    <input
                      type="url"
                      name="ogUrl"
                      value={seoData.ogUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="https://example.com/page"
                    />
                  </div>
                </div>
              )}

              {activeTab === "twitter" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Twitter Title
                    </label>
                    <input
                      type="text"
                      name="twitterTitle"
                      value={seoData.twitterTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="Leave empty to use Meta Title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Twitter Description
                    </label>
                    <textarea
                      name="twitterDescription"
                      value={seoData.twitterDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="Leave empty to use Meta Description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Twitter Image URL
                    </label>
                    <input
                      type="url"
                      name="twitterImage"
                      value={seoData.twitterImage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x628 pixels</p>
                  </div>
                </div>
              )}

              {activeTab === "advanced" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Schema Type
                    </label>
                    <select
                      name="schemaType"
                      value={seoData.schemaType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none text-gray-900"
                    >
                      <option value="WebPage">WebPage</option>
                      <option value="AboutPage">AboutPage</option>
                      <option value="ContactPage">ContactPage</option>
                      <option value="CollectionPage">CollectionPage</option>
                      <option value="ProfilePage">ProfilePage</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={seoData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primaryBlue focus:ring-primaryBlue"
                      />
                      <span className="text-sm font-medium text-gray-700">Page is Active</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/admin/page-seo")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-primaryBlue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
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

export default PageSEOEditor;
