"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { FileText, Globe, ChevronRight } from "lucide-react";

interface PageSEO {
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

const PageSEOManagement = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<PageSEO[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  // Verify authentication
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        
        if (!data.authenticated) {
          router.push("/admin/login?redirect=/admin/page-seo");
          return;
        }
        
        setIsAuthenticating(false);
      } catch (error) {
        router.push("/admin/login?redirect=/admin/page-seo");
      }
    };

    verifyAuth();
  }, [router]);

  // Fetch all page SEO data
  useEffect(() => {
    if (!isAuthenticating) {
      fetchPageSEO();
    }
  }, [isAuthenticating]);

  const fetchPageSEO = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/page-seo");
      const data = await response.json();
      
      if (data.success) {
        setPages(data.data);
        
        // If no pages exist, initialize them
        if (data.data.length === 0) {
          await initializePages();
        }
      }
    } catch (error) {
      console.error("Error fetching page SEO:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializePages = async () => {
    const defaultPages = [
      {
        pageId: 'home',
        pageName: 'Home Page',
        metaTitle: 'Ali Air Conditioning & Refrigeration | مؤسسة علي للتكييف والتبريد',
        metaDescription: 'Professional air conditioning and refrigeration services in Saudi Arabia. Expert AC installation, maintenance, and repair available 24/7.',
        metaKeywords: ['air conditioning', 'AC repair', 'Saudi Arabia'],
        robotsIndex: true,
        robotsFollow: true,
        isActive: true,
        schemaType: 'WebPage'
      },
      {
        pageId: 'about',
        pageName: 'About Page',
        metaTitle: 'About Us - Ali Air Conditioning',
        metaDescription: 'Learn about Ali Air Conditioning & Refrigeration - your trusted partner for AC services in Saudi Arabia.',
        metaKeywords: ['about us', 'company profile', 'AC service company'],
        robotsIndex: true,
        robotsFollow: true,
        isActive: true,
        schemaType: 'AboutPage'
      },
      {
        pageId: 'contact',
        pageName: 'Contact Page',
        metaTitle: 'Contact Us - Ali Air Conditioning',
        metaDescription: 'Get in touch with Ali Air Conditioning. Available 24/7 for all your AC and refrigeration needs.',
        metaKeywords: ['contact', 'get in touch', 'AC service contact'],
        robotsIndex: true,
        robotsFollow: true,
        isActive: true,
        schemaType: 'ContactPage'
      },
      {
        pageId: 'services',
        pageName: 'Services Page',
        metaTitle: 'Our Services - Ali Air Conditioning',
        metaDescription: 'Explore our comprehensive AC and refrigeration services. Expert installation, repair, and maintenance.',
        metaKeywords: ['AC services', 'refrigeration services', 'HVAC'],
        robotsIndex: true,
        robotsFollow: true,
        isActive: true,
        schemaType: 'WebPage'
      },
      {
        pageId: 'gallery',
        pageName: 'Project Gallery',
        metaTitle: 'Project Gallery - Ali Air Conditioning',
        metaDescription: 'View our completed AC and refrigeration projects. See the quality of our work.',
        metaKeywords: ['project gallery', 'portfolio', 'completed projects'],
        robotsIndex: true,
        robotsFollow: true,
        isActive: true,
        schemaType: 'WebPage'
      }
    ];

    for (const page of defaultPages) {
      try {
        await fetch("/api/page-seo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(page),
        });
      } catch (error) {
        console.error("Error initializing page:", error);
      }
    }
    
    fetchPageSEO();
  };

  const handlePageSelect = (pageId: string) => {
    router.push(`/admin/page-seo/${pageId}`);
  };

  if (isAuthenticating || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page SEO settings...</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl md:text-3xl font-bold text-primaryBlue">Page SEO Management</h1>
                <p className="text-sm text-gray-600 mt-1">Manage SEO settings for each page individually</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Select a Page to Manage</h2>
              <p className="text-sm text-gray-600">Click on any page below to edit its SEO settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page) => (
                <button
                  key={page.pageId}
                  onClick={() => handlePageSelect(page.pageId)}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 text-left hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primaryBlue group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primaryBlue rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primaryBlue transition-colors" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{page.pageName}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{page.metaTitle}</p>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${page.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {page.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${page.robotsIndex ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {page.robotsIndex ? 'Indexed' : 'No Index'}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {pages.length === 0 && (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No page SEO settings found</p>
                <button
                  onClick={initializePages}
                  className="px-6 py-2 bg-primaryBlue text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Initialize Default Pages
                </button>
              </div>
            )}
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

export default PageSEOManagement;
