"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchProjects,
  addProject,
  updateProject,
  deleteProject,
} from "@/lib/store/slices/projectsSlice";
import { Trash2, Plus, X, ImagePlus } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/admin/Sidebar";

const AdminProjectsPage = () => {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    images: [] as string[],
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    images: "",
  });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const validateField = (name: string, value: string | string[]) => {
    let error = "";
    
    if (name === "title") {
      const titleValue = value as string;
      if (titleValue.length === 0) {
        error = "Project title (English) is required";
      } else if (titleValue.length < 3) {
        error = `Title must be at least 3 characters (${titleValue.length}/3)`;
      } else if (titleValue.length > 200) {
        error = `Title must not exceed 200 characters (${titleValue.length}/200)`;
      }
    }
    
    if (name === "titleAr") {
      const titleValue = value as string;
      // Only validate if Arabic title is provided
      if (titleValue && titleValue.length > 0) {
        if (titleValue.length < 3) {
          error = `Arabic title must be at least 3 characters (${titleValue.length}/3)`;
        } else if (titleValue.length > 200) {
          error = `Arabic title must not exceed 200 characters (${titleValue.length}/200)`;
        }
      }
    }
    
    if (name === "description") {
      const descValue = value as string;
      if (descValue.length === 0) {
        error = "Description (English) is required";
      } else if (descValue.length < 10) {
        error = `Description must be at least 10 characters (${descValue.length}/10)`;
      }
    }
    
    if (name === "descriptionAr") {
      const descValue = value as string;
      // Only validate if Arabic description is provided
      if (descValue && descValue.length > 0) {
        if (descValue.length < 10) {
          error = `Arabic description must be at least 10 characters (${descValue.length}/10)`;
        }
      }
    }
    
    if (name === "images") {
      const imagesValue = value as string[];
      if (imagesValue.length === 0) {
        error = "At least one image is required";
      }
    }
    
    return error;
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", file);
        formDataToSend.append("folder", "projects");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataToSend,
        });

        const data = await response.json();

        if (data.success) {
          uploadedUrls.push(data.url);
        } else {
          alert(`Failed to upload ${file.name}: ${data.error || 'Unknown error'}`);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      
      // Clear images error when images are uploaded
      if (uploadedUrls.length > 0) {
        setErrors((prev) => ({ ...prev, images: "" }));
      }
    } catch (error) {
      alert("Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const titleError = validateField("title", formData.title);
    const titleArError = validateField("titleAr", formData.titleAr);
    const descError = validateField("description", formData.description);
    const descArError = validateField("descriptionAr", formData.descriptionAr);
    const imagesError = validateField("images", formData.images);
    
    // Only block submission if English fields or images have errors
    // Arabic fields are optional
    if (titleError || descError || imagesError) {
      setErrors({
        title: titleError,
        titleAr: titleArError,
        description: descError,
        descriptionAr: descArError,
        images: imagesError,
      });
      return;
    }

    try {
      let result;
      if (editingId) {
        result = await dispatch(
          updateProject({
            id: editingId,
            updates: formData,
          })
        );
      } else {
        result = await dispatch(addProject(formData));
      }

      // Check if the action was successful
      if (addProject.fulfilled.match(result) || updateProject.fulfilled.match(result)) {
        alert(editingId ? "Project updated successfully!" : "Project added successfully!");
        setShowModal(false);
        setFormData({ title: "", titleAr: "", description: "", descriptionAr: "", images: [] });
        setEditingId(null);
        // Refresh the projects list
        dispatch(fetchProjects());
      } else {
        // Action was rejected
        alert(`Failed to ${editingId ? "update" : "add"} project. Please try again.`);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await dispatch(deleteProject(id));
    }
  };

  const handleEdit = (project: any) => {
    setFormData({
      title: project.title,
      titleAr: project.titleAr || "",
      description: project.description,
      descriptionAr: project.descriptionAr || "",
      images: project.images,
    });
    setEditingId(project._id);
    setShowModal(true);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({ title: "", titleAr: "", description: "", descriptionAr: "", images: [] });
    setEditingId(null);
    setShowModal(false);
    setErrors({ title: "", titleAr: "", description: "", descriptionAr: "", images: "" });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-primaryBlue">Manage Projects</h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="hidden lg:block text-3xl font-bold text-primaryBlue">Manage Projects</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-heroBlue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Project
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-80"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No projects yet.</p>
          <p className="text-gray-400 text-sm mt-2">Click "Add New Project" to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <div
              key={project._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 bg-gray-200">
                {project.images[0] && (
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={85}
                    className="object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {project.images.length} {project.images.length === 1 ? "image" : "images"}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id, project.title)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 text-black bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primaryBlue">
                  {editingId ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Project Title (English) *</span>
                    <span className="text-xs text-gray-500 font-normal">
                      {formData.title.length}/200
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    maxLength={200}
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter project title (min 3 characters)"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>عنوان المشروع (العربي) - Optional</span>
                    <span className="text-xs text-gray-500 font-normal">
                      {formData.titleAr.length}/200 حرف
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={(e) => handleFormChange("titleAr", e.target.value)}
                    maxLength={200}
                    dir="rtl"
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.titleAr ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="أدخل عنوان المشروع (اختياري)"
                  />
                  {errors.titleAr && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.titleAr}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Description (English) *</span>
                    <span className="text-xs text-gray-500 font-normal">
                      {formData.description.length} characters
                    </span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter project description (min 10 characters)"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Description (Arabic - الوصف) - Optional</span>
                    <span className="text-xs text-gray-500 font-normal">
                      {formData.descriptionAr.length} حرف
                    </span>
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => handleFormChange("descriptionAr", e.target.value)}
                    dir="rtl"
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] ${
                      errors.descriptionAr ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="أدخل وصف المشروع (اختياري)"
                  />
                  {errors.descriptionAr && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.descriptionAr}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Images * (Upload one or more images)
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 ${
                    errors.images ? "border-red-500" : "border-gray-300"
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="project-images"
                      disabled={uploadingImages}
                    />
                    <label
                      htmlFor="project-images"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <ImagePlus size={48} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {uploadingImages ? "Uploading..." : "Click to upload images"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, WEBP up to 10MB each
                      </p>
                    </label>

                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {formData.images.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="relative h-24 rounded-lg overflow-hidden">
                              <Image
                                src={url}
                                alt={`Upload ${index + 1}`}
                                fill
                                sizes="150px"
                                quality={85}
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.images && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.images}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingImages}
                    className="flex-1 bg-heroBlue text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {editingId ? "Update Project" : "Add Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
        </div>
      </main>
    </div>
  );
};

export default AdminProjectsPage;
