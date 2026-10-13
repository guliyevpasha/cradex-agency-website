'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Check, X, Loader2 } from 'lucide-react';

interface DomainResult {
  extension: string;
  available: boolean;
  checking: boolean;
}

export default function DomainChecker() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<DomainResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const extensions = ['.com', '.az', '.net', '.org', '.io', '.co'];

  const checkDomain = async () => {
    if (!domain.trim()) return;

    setIsSearching(true);
    const cleanDomain = domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

    // Initialize results with checking state
    const initialResults = extensions.map(ext => ({
      extension: ext,
      available: false,
      checking: true,
    }));
    setResults(initialResults);

    // Check each extension
    const checkedResults = await Promise.all(
      extensions.map(async (ext) => {
        try {
          const response = await fetch(`/api/check-domain?domain=${cleanDomain}${ext}`);
          const data = await response.json();
          
          return {
            extension: ext,
            available: data.available,
            checking: false,
          };
        } catch (error) {
          // Fallback to WHOIS API
          try {
            const whoisResponse = await fetch(
              `https://domain-checker7.p.rapidapi.com/whois?domain=${cleanDomain}${ext}`,
              {
                method: 'GET',
                headers: {
                  'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
                  'X-RapidAPI-Host': 'domain-checker7.p.rapidapi.com',
                },
              }
            );
            const whoisData = await whoisResponse.json();
            
            return {
              extension: ext,
              available: !whoisData.registered,
              checking: false,
            };
          } catch {
            return {
              extension: ext,
              available: false,
              checking: false,
            };
          }
        }
      })
    );

    setResults(checkedResults);
    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkDomain();
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#111E35] to-[#0A1628]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 text-sm font-semibold rounded-full mb-4">
              DOMAIN YOXLAMA
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Domain mövcudluğunu{' '}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                yoxlayın
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              İstədiyiniz domain adını daxil edin və hansı uzantıların mövcud olduğunu canlı olaraq öyrənin
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="məsələn: sizinfirma"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-lg focus:border-blue-500 focus:outline-none text-lg text-white placeholder-gray-400"
                  disabled={isSearching}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !domain.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Yoxlanılır...
                  </>
                ) : (
                  'Yoxla'
                )}
              </button>
            </div>
          </motion.form>

          {/* Results */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {results.map((result, index) => (
                <motion.div
                  key={result.extension}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 rounded-xl border-2 ${
                    result.checking
                      ? 'border-gray-200 bg-gray-50'
                      : result.available
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-gray-900">
                      {domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}
                      {result.extension}
                    </span>
                    {result.checking ? (
                      <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                    ) : result.available ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <X className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      result.checking
                        ? 'text-gray-500'
                        : result.available
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}
                  >
                    {result.checking
                      ? 'Yoxlanılır...'
                      : result.available
                      ? 'Bu domain mövcuddur!'
                      : 'Bu domain artıq alınmışdır'}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Info Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p className="text-sm text-blue-800 text-center">
              💡 Nəticələr real-time API vasitəsilə yoxlanılır. Mövcud domainləri əldə etmək üçün bizimlə əlaqə saxlayın.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
