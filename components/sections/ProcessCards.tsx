'use client';

import { motion } from 'framer-motion';
import { Clock, DollarSign, Shield, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ProcessCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ProcessCardsProps {
  cards: ProcessCard[];
}

const iconMap = {
  Clock,
  DollarSign,
  Shield,
  MessageCircle,
};

export default function ProcessCards({ cards }: ProcessCardsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {cards.map((card, index) => {
            const IconComponent = card.icon;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:border-[#FF6B2C] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Icon Container */}
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B2C] to-[#FF8F5C] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {card.description}
                </p>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF6B2C]/10 to-[#FF8F5C]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
