// Project translations mapping
export const projectTranslations: Record<string, string> = {
  // ========== PROJECT TITLES ==========
  "AC Installation Project - Residential Complex": "مشروع تركيب المكيفات - مجمع سكني",
  "AC Repair & Maintenance Service": "خدمة إصلاح وصيانة المكيفات",
  "Washing Machine Installation & Repair": "تركيب وإصلاح الغسالات",
  "HVAC System Installation - Commercial Building": "تركيب نظام التدفئة والتهوية وتكييف الهواء - مبنى تجاري",
  
  // ========== PROJECT DESCRIPTIONS ==========
  "Complete AC installation service for a modern residential complex. Our expert technicians installed multiple split AC units with proper ducting and electrical work, ensuring optimal cooling efficiency and energy savings.": "خدمة تركيب مكيفات كاملة لمجمع سكني حديث. قام فنيونا الخبراء بتركيب عدة وحدات مكيفات منفصلة مع أنظمة التهوية والأعمال الكهربائية المناسبة، مما يضمن كفاءة تبريد مثلى وتوفير الطاقة.",
  
  "Professional AC repair and maintenance work completed for commercial building. Our team diagnosed and fixed refrigerant leaks, cleaned filters, and performed complete system check-up to restore optimal performance.": "أعمال إصلاح وصيانة احترافية للمكيفات مكتملة للمبنى التجاري. قام فريقنا بتشخيص وإصلاح تسريبات المبرد، وتنظيف الفلاتر، وإجراء فحص كامل للنظام لاستعادة الأداء الأمثل.",
  
  "Expert washing machine installation and repair services provided to residential clients. Our technicians handled both front-load and top-load machines, ensuring proper water connection, drainage, and electrical setup.": "خدمات تركيب وإصلاح خبيرة للغسالات مقدمة للعملاء السكنيين. تعامل فنيونا مع كل من الغسالات ذات التحميل الأمامي والعلوي، مما يضمن توصيل المياه المناسب والصرف والإعداد الكهربائي.",
  
  "Large-scale HVAC system installation project for commercial office building. Our certified engineers designed and installed a complete heating, ventilation, and air conditioning system with smart controls and energy-efficient components.": "مشروع تركيب نظام تدفئة وتهوية وتكييف هواء واسع النطاق لمبنى مكتب تجاري. صمم مهندسونا المعتمدون وركبوا نظامًا كاملاً للتدفئة والتهوية وتكييف الهواء مع عناصر تحكم ذكية ومكونات موفرة للطاقة.",
  
  // Truncated versions
  "Professional AC repair and maintenance work completed for commercial b…": "أعمال إصلاح وصيانة احترافية للمكيفات مكتملة للمبنى التجاري",
  "Expert washing machine installation and repair services provided to re…": "خدمات تركيب وإصلاح خبيرة للغسالات مقدمة للعملاء السكنيين",
  "Large-scale HVAC system installation project for commercial office bui…": "مشروع تركيب نظام تدفئة وتهوية وتكييف هواء واسع النطاق لمبنى مكتب تجاري",
};

export const translateProject = (text: string, locale: string): string => {
  if (locale === 'ar' && projectTranslations[text]) {
    return projectTranslations[text];
  }
  return text;
};
