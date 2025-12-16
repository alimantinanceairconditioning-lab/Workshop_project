import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ali Air Conditioning & Refrigeration | مؤسسة علي للتكييف والتبريد',
    short_name: 'Ali AC & Refrigeration',
    description: 'Professional air conditioning and refrigeration services in Saudi Arabia. خدمات التكييف والتبريد الاحترافية في المملكة العربية السعودية',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1E3A8A',
    icons: [
      {
        src: '/siteLogo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
