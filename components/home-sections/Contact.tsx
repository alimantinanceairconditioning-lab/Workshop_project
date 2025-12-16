"use client";

import { useState, useEffect } from "react";
import { FaPhone } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import Button from "../ui/Button";
import FormField from "../ui/FormField";

interface Service {
  _id: string;
  name: string;
  status: string;
}

type FormErrors = {
  firstName?: string;
  lastName?: string;
  services?: string;
  phone?: string;
  message?: string;
};

export default function ContactPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    services: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/service', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const data = await response.json();
        if (data.success) {
          // Filter only active services
          const activeServices = data.services.filter((s: Service) => s.status === 'Active');
          setServices(activeServices);
        }
      } catch (error) {
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Services validation
    if (!formData.services.trim()) {
      newErrors.services = "Please specify the service you need";
    }

    // Phone validation (Saudi Arabia format)
    const phoneRegex = /^(05|5)[0-9]{8}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Please enter a valid Saudi phone number (05XXXXXXXX)";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear success message when user starts editing
    if (submitSuccess) {
      setSubmitSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          serviceType: formData.services.trim(),
          phoneNumber: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Reset form on success
        setFormData({
          firstName: "",
          lastName: "",
          services: "",
          phone: "",
          message: "",
        });

        setSubmitSuccess(true);
        
        // Clear success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setSubmitError("Failed to send message. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white" id="contact">
      <div className="h-2 bg-purple-600"></div>

      <section className="py-4 md:py-10 lg:py-16 px-4 sm:px-6 lg:px-20 xl:px-27 ">
        <div className="max-w-8xl ">
          <div className="text-center mb-8 md:mb-12 lg:mb-20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-2 text-balance">
              Contact
            </h1>
            <p className="font-medium text-pretty px-4 sm:text-lg md:text-xl text-blue-900">
              Call or WhatsApp us for immediate service, or use the form below
              to request a quote.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="shrink-0 text-lg md:text-xl text-primaryBlue">
                  <FaPhone />
                </div>
                <div className="flex items-center">
                  <a
                    href="tel:0502575350"
                    className="text-lg md:text-xl font-normal text-heroBlue transition-colors"
                  >
                    0502575350
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="shrink-0 text-xl md:text-2xl text-primaryBlue mt-1">
                  <FaLocationDot />
                </div>
                <div>
                  <p className="font-normal sm:text-lg md:text-xl text-purple-600">
                    Medina, Al Madinah al-Munawwarah Region, Saudi Arabia
                  </p>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden shadow-md h-64 md:h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3631.6502341080923!2d39.62165847535823!3d24.462917478190946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjTCsDI3JzQ2LjUiTiAzOcKwMzcnMjcuMiJF!5e0!3m2!1sen!2s!4v1762527204175!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
                {/* Success Message */}
                {submitSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> Your message has been sent successfully. We'll get back to you soon!</span>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    error={errors.firstName}
                  />
                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    error={errors.lastName}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Services Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="services"
                      value={formData.services}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none transition-all text-gray-900 ${
                        errors.services ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loadingServices}
                    >
                      <option value="">
                        {loadingServices ? 'Loading services...' : 'Select a service'}
                      </option>
                      {services.map((service) => (
                        <option key={service._id} value={service.name}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                    {errors.services && (
                      <p className="mt-1 text-sm text-red-500">{errors.services}</p>
                    )}
                  </div>

                  <FormField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="05XXXXXXXX"
                    type="tel"
                    error={errors.phone}
                  />
                </div>

                <FormField
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements..."
                  isTextArea
                  rows={6}
                  error={errors.message}
                />

                <div className="flex items-center justify-center">
                  <Button 
                    type="submit" 
                    className="py-2 px-6 md:py-2 md:px-6 text-sm md:text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
