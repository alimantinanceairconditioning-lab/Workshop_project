"use client";
import { useLanguage } from '@/lib/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="relative">
      <button
        onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Switch language"
      >
        <Globe size={18} />
        <span className="text-sm font-medium">
          {locale === 'en' ? 'AR' : 'EN'}
        </span>
      </button>
    </div>
  );
}
