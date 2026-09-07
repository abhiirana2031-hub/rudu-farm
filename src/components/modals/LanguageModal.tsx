import React from 'react';
import { X, Globe, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageCode } from '../../types';

export const LanguageModal: React.FC = () => {
  const { isLanguageModalOpen, setIsLanguageModalOpen, language, setLanguage, t } = useApp();

  if (!isLanguageModalOpen) return null;

  const languages: { code: LanguageCode; name: string; nativeName: string; region: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English', region: 'India & Global' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'उत्तर भारत' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'ગુજરાત' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'ਪੰਜਾਬ' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'महाराष्ट्र' },
  ];

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsLanguageModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-emerald-100 flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center">
              <Globe className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold">{t.language}</h2>
              <p className="text-[11px] text-emerald-100/80 font-medium">Select your preferred language</p>
            </div>
          </div>
          <button
            onClick={() => setIsLanguageModalOpen(false)}
            className="w-7 h-7 rounded-full bg-emerald-700 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Language Options */}
        <div className="p-4 space-y-2">
          {languages.map((lang) => {
            const isSelected = language === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-2 border-emerald-700 text-emerald-950 shadow-xs font-bold'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="text-left">
                  <span className="text-sm font-black block text-gray-950">{lang.nativeName}</span>
                  <span className="text-[11px] text-gray-700 font-medium">
                    {lang.name} • {lang.region}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
