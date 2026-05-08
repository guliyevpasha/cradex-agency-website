'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Search, Video, Linkedin, Plus, Minus } from 'lucide-react'

interface AdService {
  id: string
  name: string
  price: number
  icon: React.ReactNode
  description: string
  includes: string[]
  additionalServices: AdditionalService[]
}

interface AdditionalService {
  id: string
  name: string
  price: number
  type: 'fixed' | 'slider' | 'monthly'
  min?: number
  max?: number
}

const AD_SERVICES: AdService[] = [
  {
    id: 'meta',
    name: 'Meta Reklamları (Facebook & Instagram)',
    price: 350,
    icon: <Facebook className="w-6 h-6" />,
    description: 'Facebook və Instagram reklamları',
    includes: [
      'Meta Business Manager qurulması',
      'Reklam hesabının yaradılması',
      'Pixel bağlantısı',
      '1 reklam kampaniyası',
      'Auditoriya hədəflənməsi',
      '3 reklam kreativi (video və ya şəkil)',
      'Reklam mətnlərinin yazılması',
      'Gündəlik optimizasiya',
      'Aylıq hesabat'
    ],
    additionalServices: [
      { id: 'meta_campaign', name: 'Əlavə reklam kampaniyası', price: 80, type: 'slider', min: 1, max: 10 },
      { id: 'meta_creative', name: 'Əlavə reklam kreativi', price: 25, type: 'slider', min: 1, max: 10 },
      { id: 'meta_reels', name: 'Reels montajı', price: 40, type: 'slider', min: 1, max: 10 },
      { id: 'meta_motion', name: 'Motion dizayn reklamı', price: 70, type: 'slider', min: 1, max: 10 },
      { id: 'meta_text', name: 'Reklam üçün mətn yazılması', price: 30, type: 'slider', min: 1, max: 10 },
      { id: 'meta_pixel', name: 'Meta Pixel qurulması', price: 120, type: 'fixed' },
      { id: 'meta_api', name: 'Conversion API inteqrasiyası', price: 180, type: 'fixed' },
      { id: 'meta_dm', name: 'DM cavablandırma xidməti', price: 250, type: 'monthly' },
      { id: 'meta_influencer', name: 'Influencer əməkdaşlıqlarının idarəsi', price: 150, type: 'fixed' },
      { id: 'meta_ab', name: 'A/B test optimizasiyası', price: 100, type: 'fixed' }
    ]
  },
  {
    id: 'google',
    name: 'Google Reklamları',
    price: 450,
    icon: <Search className="w-6 h-6" />,
    description: 'Google Ads və Search reklamları',
    includes: [
      'Google Ads hesabının qurulması',
      'Search reklam kampaniyası',
      'Açar söz araşdırması',
      'Mənfi açar söz optimizasiyası',
      '2 reklam qrupu',
      'Reklam mətnlərinin hazırlanması',
      'Conversion tracking',
      'Aylıq optimizasiya və hesabat'
    ],
    additionalServices: [
      { id: 'google_banner', name: 'Display reklam bannerləri', price: 40, type: 'slider', min: 1, max: 10 },
      { id: 'google_tag', name: 'Google Tag Manager qurulması', price: 120, type: 'fixed' },
      { id: 'google_conversion', name: 'Conversion tracking', price: 150, type: 'fixed' },
      { id: 'google_analytics', name: 'Google Analytics 4 inteqrasiyası', price: 180, type: 'fixed' },
      { id: 'google_youtube', name: 'YouTube reklam setup', price: 250, type: 'fixed' },
      { id: 'google_remarketing', name: 'Remarketing kampaniyası', price: 140, type: 'fixed' },
      { id: 'google_keywords', name: 'Açar söz araşdırması (geniş)', price: 100, type: 'fixed' },
      { id: 'google_landing', name: 'Landing page analizi', price: 150, type: 'fixed' },
      { id: 'google_seo', name: 'SEO audit', price: 300, type: 'fixed' }
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok Reklamları',
    price: 400,
    icon: <Video className="w-6 h-6" />,
    description: 'TikTok Ads və video reklamları',
    includes: [
      'TikTok Ads hesabının qurulması',
      'Pixel inteqrasiyası',
      '1 reklam kampaniyası',
      'Auditoriya analizi',
      '3 video kreativ',
      'Reklam optimizasiyası',
      'Aylıq hesabat'
    ],
    additionalServices: [
      { id: 'tiktok_video', name: 'TikTok video montajı', price: 50, type: 'slider', min: 1, max: 10 },
      { id: 'tiktok_ugc', name: 'UGC kontent ssenarisi', price: 80, type: 'slider', min: 1, max: 10 },
      { id: 'tiktok_viral', name: 'Viral kontent planlaması', price: 120, type: 'fixed' },
      { id: 'tiktok_pixel', name: 'TikTok Pixel qurulması', price: 120, type: 'fixed' },
      { id: 'tiktok_creator', name: 'Creator/influencer tapılması', price: 150, type: 'fixed' },
      { id: 'tiktok_trend', name: 'Trend araşdırması', price: 70, type: 'fixed' },
      { id: 'tiktok_shop', name: 'TikTok shop inteqrasiyası', price: 250, type: 'fixed' }
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Reklamları',
    price: 500,
    icon: <Linkedin className="w-6 h-6" />,
    description: 'LinkedIn B2B reklamları',
    includes: [
      'LinkedIn Campaign Manager qurulması',
      'B2B auditoriya hədəflənməsi',
      'Potensial Müştəri Toplama Kampaniyası',
      'Sponsorlu post reklamları',
      'Reklam mətnlərinin hazırlanması',
      'Aylıq optimizasiya',
      'Hesabat təqdimatı'
    ],
    additionalServices: [
      { id: 'linkedin_optimization', name: 'LinkedIn şirkət səhifəsinin optimizasiyası', price: 180, type: 'fixed' },
      { id: 'linkedin_b2b', name: 'B2B Potensial Müştəri Strategiyası', price: 250, type: 'fixed' },
      { id: 'linkedin_text', name: 'Korporativ mətn', price: 50, type: 'fixed' },
      { id: 'linkedin_employer', name: 'Şirkətin İşəgötürən İmic Strategiyası', price: 400, type: 'fixed' },
      { id: 'linkedin_form', name: 'Potensial Müştəri Formasının Qurulması', price: 120, type: 'fixed' },
      { id: 'linkedin_ceo', name: 'CEO Şəxsi Brend İdarəçiliyi', price: 500, type: 'monthly' },
      { id: 'linkedin_content', name: 'LinkedIn kontent planı', price: 200, type: 'fixed' }
    ]
  }
]

export default function DigitalAdsCalculator() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [additionalSelections, setAdditionalSelections] = useState<Record<string, number>>({})

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const updateAdditionalService = (serviceId: string, value: number) => {
    setAdditionalSelections(prev => ({
      ...prev,
      [serviceId]: value
    }))
  }

  const calculateTotal = () => {
    let total = 0
    let monthlyTotal = 0

    // Əsas xidmətlər
    selectedServices.forEach(serviceId => {
      const service = AD_SERVICES.find(s => s.id === serviceId)
      if (service) {
        monthlyTotal += service.price
      }
    })

    // Əlavə xidmətlər
    Object.entries(additionalSelections).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        AD_SERVICES.forEach(service => {
          const additionalService = service.additionalServices.find(as => as.id === serviceId)
          if (additionalService) {
            if (additionalService.type === 'monthly') {
              monthlyTotal += additionalService.price * quantity
            } else {
              total += additionalService.price * quantity
            }
          }
        })
      }
    })

    return { oneTime: total, monthly: monthlyTotal }
  }

  const totals = calculateTotal()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Rəqəmsal Reklam Kalkulyatoru
        </h2>
        <p className="text-gray-600">
          Rəqəmsal reklam xidmətlərinizin qiymətini hesablayın
        </p>
      </div>

      <div className="grid gap-6">
        {AD_SERVICES.map((service) => (
          <motion.div
            key={service.id}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedServices.includes(service.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => toggleService(service.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">{service.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {service.price}₼
                </div>
                <div className="text-sm text-gray-500">aylıq</div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Xidmətə daxildir:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-600">
                {service.includes.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {selectedServices.includes(service.id) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t pt-4 mt-4"
              >
                <h4 className="font-medium text-gray-900 mb-3">Əlavə Xidmətlər:</h4>
                <div className="space-y-3">
                  {service.additionalServices.map((additionalService) => (
                    <div key={additionalService.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">
                          {additionalService.name}
                        </span>
                        <div className="text-sm text-gray-600">
                          {additionalService.price}₼
                          {additionalService.type === 'monthly' && ' / aylıq'}
                          {additionalService.type === 'slider' && ' / ədəd'}
                        </div>
                      </div>
                      
                      {additionalService.type === 'slider' ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const current = additionalSelections[additionalService.id] || 0
                              if (current > 0) {
                                updateAdditionalService(additionalService.id, current - 1)
                              }
                            }}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {additionalSelections[additionalService.id] || 0}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const current = additionalSelections[additionalService.id] || 0
                              if (current < (additionalService.max || 10)) {
                                updateAdditionalService(additionalService.id, current + 1)
                              }
                            }}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={additionalSelections[additionalService.id] > 0}
                            onChange={(e) => {
                              e.stopPropagation()
                              updateAdditionalService(additionalService.id, e.target.checked ? 1 : 0)
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {(selectedServices.length > 0 || Object.values(additionalSelections).some(v => v > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold mb-4">Qiymət Hesabatı</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {totals.oneTime > 0 && (
              <div>
                <div className="text-sm opacity-90">Birdəfəlik ödəniş</div>
                <div className="text-2xl font-bold">{totals.oneTime}₼</div>
              </div>
            )}
            {totals.monthly > 0 && (
              <div>
                <div className="text-sm opacity-90">Aylıq ödəniş</div>
                <div className="text-2xl font-bold">{totals.monthly}₼</div>
              </div>
            )}
          </div>
          {totals.oneTime > 0 && totals.monthly > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="text-sm opacity-90">İllik ümumi məbləğ (12 ay)</div>
              <div className="text-3xl font-bold">
                {totals.oneTime + (totals.monthly * 12)}₼
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}