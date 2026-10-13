'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';

interface PricingTier {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  cta: string;
  ctaHref: string;
}

interface PricingPackagesProps {
  title: string;
  subtitle: string;
  monthlyLabel: string;
  yearlyLabel: string;
  saveLabel: string;
  perMonthLabel: string;
  corporateTitle: string;
  corporateDescription: string;
  corporateButton: string;
  tiers: PricingTier[];
}

export default function PricingPackages({
  title,
  subtitle,
  monthlyLabel,
  yearlyLabel,
  saveLabel,
  perMonthLabel,
  corporateTitle,
  corporateDescription,
  corporateButton,
  tiers,
}: PricingPackagesProps) {
  const [isYearly, setIsYearly] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Monthly/Yearly Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span
            className={`text-sm font-medium transition-colors ${
              !isYearly ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            {monthlyLabel}
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-14 h-7 bg-gradient-to-r from-[#FF6B2C] to-[#FF8F5C] rounded-full transition-all duration-300 hover:shadow-lg"
            aria-label="Toggle pricing period"
          >
            <motion.div
              className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
              animate={{ x: isYearly ? 28 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors ${
              isYearly ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            {yearlyLabel}
          </span>
          {isYearly && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full"
            >
              {saveLabel}
            </motion.span>
          )}
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8"
        >
          {tiers.map((tier, index) => {
            const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
            const displayPrice = isYearly
              ? Math.round(tier.yearlyPrice / 12)
              : tier.monthlyPrice;

            return (
              <motion.div
                key={tier.name}
                variants={cardVariants}
                className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  tier.popular
                    ? 'border-[#FF6B2C] shadow-xl scale-105'
                    : 'border-gray-200 shadow-lg'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6B2C] to-[#FF8F5C] text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                    Ən çox seçilən
                  </div>
                )}

                {/* Tier Name */}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-bold text-gray-900">
                      {displayPrice}
                    </span>
                    <span className="text-xl font-semibold text-gray-600">
                      AZN
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{perMonthLabel}</p>
                  {isYearly && (
                    <p className="text-xs text-gray-400 mt-1">
                      {price} AZN / il
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  href={tier.ctaHref}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 mb-6 group ${
                    tier.popular
                      ? 'bg-gradient-to-r from-[#FF6B2C] to-[#FF8F5C] text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                {/* Features List */}
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Corporate Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-[#FF6B2C]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{corporateTitle}</h3>
                <p className="text-gray-300 text-sm md:text-base max-w-xl">
                  {corporateDescription}
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl whitespace-nowrap group flex items-center gap-2"
            >
              {corporateButton}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
