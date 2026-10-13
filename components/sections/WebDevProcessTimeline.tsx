'use client';

import { motion } from 'framer-motion';

interface TimelineStep {
  number: string;
  title: string;
  description: string;
  highlighted?: boolean;
}

interface ProcessTimelineProps {
  title: string;
  subtitle?: string;
  steps: TimelineStep[];
}

export default function WebDevProcessTimeline({
  title,
  subtitle,
  steps,
}: ProcessTimelineProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-lg max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Timeline Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={stepVariants}
              className={`relative flex items-start gap-4 md:gap-6 p-6 md:p-8 rounded-2xl transition-all duration-300 ${
                step.highlighted
                  ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl scale-105'
                  : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg'
              }`}
            >
              {/* Step Number */}
              <div
                className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-xl md:text-2xl ${
                  step.highlighted
                    ? 'bg-gradient-to-br from-[#FF6B2C] to-[#FF8F5C] text-white shadow-lg'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                }`}
              >
                {step.number}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <h3
                  className={`text-xl md:text-2xl font-bold mb-2 ${
                    step.highlighted ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm md:text-base leading-relaxed ${
                    step.highlighted ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {step.description}
                </p>
              </div>

              {/* Connector Line (except last item) */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-10 md:left-11 top-full w-0.5 h-6 ${
                    step.highlighted || steps[index + 1]?.highlighted
                      ? 'bg-gradient-to-b from-[#FF6B2C] to-[#FF8F5C]'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
