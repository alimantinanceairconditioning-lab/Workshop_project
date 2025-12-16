"use client";
import ContactPage from '@/components/home-sections/Contact'
import ContactBanner from '@/components/home-sections/ContactBanner'
import Hero from '@/components/home-sections/Hero'
import Project from '@/components/home-sections/Project'
import Services from '@/components/home-sections/Services'
import WhyChoose from '@/components/home-sections/WhyChoose'
import React from 'react'
import whatsapp_icon from "@/public/images/whatsapp.png"
import Image from 'next/image'

const HomePage = () => {

  return (
    <div>
      <Hero/>
      <Services/>
      <WhyChoose/>
      <Project/>
      {/* <ContactBanner/> */}
      {/* <ContactPage/> */}
      <a 
        href="https://wa.me/9660502575350" 
        target="_blank" 
        rel="noopener noreferrer" 
        className='fixed bottom-5 right-5 z-50'
        aria-label="Contact us on WhatsApp"
      >
        <div className='w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300'>
          <Image 
            src={whatsapp_icon} 
            alt="Contact us on WhatsApp for AC and refrigeration services" 
            className='w-13 h-13'  
            width={52} 
            height={52} 
            priority 
          />
        </div>
      </a>
    </div>
  )
}

export default HomePage