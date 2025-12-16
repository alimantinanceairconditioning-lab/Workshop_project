import React from 'react'
import Button from '../ui/Button'
import { Phone } from 'lucide-react'

const ContactBanner = () => {
  return (
    <section className='flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 px-4 sm:px-6 md:px-12 lg:px-27 py-4 md:py-10 lg:py-18 bg-accentPurple'>
      <div className='flex flex-col gap-2 text-center md:text-left'>
        <h1 className='text-lg sm:text-xl md:text-xl font-bold'>
          Need It Fixed Fast? Our Expert Team Is Ready 24/7!
        </h1>
        <h1 className='text-lg sm:text-xl md:text-lg font-bold'>
          هل تحتاج إلى إصلاح سريع؟ فريق خبرائنا جاهز لخدمتك على مدار الساعة!
        </h1>
      </div>
      <div className='shrink-0'>
        <a href="tel:0502575350">
          <Button
            type="button"
            icon={<Phone className="text-primaryBlue md:text-white" size={16} />}
            hoverIcon={<Phone className="text-accentYellow " size={16} />}
            className="px-4 py-2 md:px-6 md:py-3 text-sm text-base"
          >
            Call Now
          </Button>
        </a>
      </div>
    </section>
  )
}

export default ContactBanner