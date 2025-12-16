"use client";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import teamImage from "@/public/images/Team.webp";
import experienceIcon from "@/public/images/experience.webp";
import customerImage from "@/public/images/customer.webp";
import quikImage from "@/public/images/quik.webp";
import transparent from "@/public/images/transparent.webp";
import { StaticImageData } from "next/image";

type FeatureProps = {
  icon: StaticImageData | string;
  titleKey: string;
  descKey: string;
};

const features: FeatureProps[] = [
  {
    icon: experienceIcon,
    titleKey: "about.experiencedTechnicians",
    descKey: "about.experiencedTechniciansDesc",
  },
  {
    icon: customerImage,
    titleKey: "about.customerSatisfaction",
    descKey: "about.customerSatisfactionDesc",
  },
  {
    icon: transparent,
    titleKey: "about.transparentPricing",
    descKey: "about.transparentPricingDesc",
  },
  {
    icon: quikImage,
    titleKey: "about.quickReliableService",
    descKey: "about.quickReliableServiceDesc",
  },
];

// Reusable Feature component
function Feature({ icon, titleKey, descKey }: FeatureProps & { t: (key: string) => string }) {
  const { t } = useLanguage();
  
  return (
    <div className="flex gap-2 md:gap-3 lg:gap-4">
      <div className="shrink-0">
        <Image
          src={typeof icon === "string" ? icon : icon}
          alt={t(titleKey)}
          width={28}
          height={28}
          quality={85}
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-white mb-1 md:mb-2">
          {t(titleKey)}
        </h3>
        <p className="text-gray-100 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
          {t(descKey)}
        </p>
      </div>
    </div>
  );
}

export default function WhyChoose() {
  const { t, locale } = useLanguage();
  const isRTL = locale === 'ar';

  return (
    <section className="bg-accentPurple px-4 sm:px-6 md:px-12 lg:px-20 xl:px-27 py-8 md:py-10 lg:py-12" id="about">
      <div className="w-full flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-16 xl:gap-20 items-stretch">
        <div className="w-full lg:w-2/5 flex">
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-auto lg:min-h-[400px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={teamImage}
              alt="Experienced technicians in blue uniforms"
              fill
              quality={85}
              placeholder="blur"
              className="object-cover"
            />
          </div>
        </div>

        <div className={`w-full lg:w-3/5 flex flex-col justify-center gap-3 md:gap-4 lg:gap-5 ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center lg:text-inherit font-extrabold text-white">
            {t('about.whyChooseUs')}
          </h1>

          <p className="mb-2 md:mb-4 text-center lg:text-inherit text-sm sm:text-base md:text-lg lg:text-xl text-gray-100">
            {t('about.whyChooseDesc')}
          </p>

          <div className="space-y-3 md:space-y-4 lg:space-y-5">
            {features.map((feature, index) => (
              <Feature key={index} {...feature} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
