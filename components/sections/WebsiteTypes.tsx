'use client';

import { motion } from 'framer-motion';
import { Building2, ShoppingCart, Target, Globe, Briefcase } from 'lucide-react';

interface WebsiteType {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface WebsiteTypesProps {
  title: string;
  subtitle: string;
  types: WebsiteType[];
}

const iconMap = {
  Building2,
  ShoppingCart,
  Target,
  Globe,
  Briefcase,
};

export default function WebsiteTypes({ title, subtitle, types }: WebsiteTypesProps) {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#0A1628] to-[#111E35]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 text-sm font-semibold rounded-full mb-4">
            SAYT NÖVLƏRİ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            {title}
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Website Types Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {types.map((type, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2"
            >
              {/* Number Badge */}
              <div className="absolute top-6 right-6 w-10 h-10 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {type.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {type.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed">
                {type.description}
              </p>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
