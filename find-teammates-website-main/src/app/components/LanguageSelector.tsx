import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, Check } from 'lucide-react';
import { useLanguage, languages, type LanguageCode } from '../contexts/LanguageContext';

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === currentLanguage);

  const handleLanguageSelect = (langCode: LanguageCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Language Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
      >
        <Languages className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLang?.flag} {currentLang?.nativeName}
        </span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Select Language
                </h3>
                <p className="text-xs text-blue-100 mt-1">Choose your preferred language</p>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {/* Indian Languages Section */}
                <div className="p-2">
                  <div className="px-2 py-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Indian Languages</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {languages.filter(l => ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'kn', 'ml', 'bn', 'pa', 'ur', 'or'].includes(l.code)).map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ scale: 1.02, backgroundColor: '#F3F4F6' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${
                          currentLanguage === lang.code
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : 'border-2 border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {lang.nativeName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{lang.name}</p>
                        </div>
                        {currentLanguage === lang.code && (
                          <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2" />

                {/* International Languages Section */}
                <div className="p-2">
                  <div className="px-2 py-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase">International Languages</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {languages.filter(l => ['es', 'fr', 'de', 'ja', 'zh', 'ko', 'ar', 'pt'].includes(l.code)).map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ scale: 1.02, backgroundColor: '#F3F4F6' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${
                          currentLanguage === lang.code
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : 'border-2 border-transparent hover:bg-gray-50'
                        }`}
                        dir={lang.direction}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {lang.nativeName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{lang.name}</p>
                        </div>
                        {currentLanguage === lang.code && (
                          <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
                <p className="text-xs text-gray-600 text-center">
                  🌍 {languages.length} languages supported
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
