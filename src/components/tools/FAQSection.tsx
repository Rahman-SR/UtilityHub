import React from 'react';
import { ToolFAQ } from '@/types/tool';
import { HelpCircle } from 'lucide-react';

export function FAQSection({ faqs }: { faqs?: ToolFAQ[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-12 space-y-6">
      <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100 font-heading font-bold text-xl md:text-2xl">
        <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2>Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
          >
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
              {faq.question}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
