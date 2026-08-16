import React from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/config/brand';
import { ShieldCheck, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B101D] text-slate-400 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-gradient-to-br dark:from-blue-600 dark:to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                {BRAND_CONFIG.name}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Free, fast, and privacy-first online tools. Compress images, merge PDFs, generate QR codes, and calculate finances 100% locally inside your browser.
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#121829] border border-slate-800 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero server uploads. Your data is private.</span>
            </div>
          </div>

          {/* Quick Category Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Categories</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/image-tools" className="hover:text-indigo-400 transition-colors">
                  Image Tools
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools" className="hover:text-indigo-400 transition-colors">
                  PDF Tools
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="hover:text-indigo-400 transition-colors">
                  Financial Calculators
                </Link>
              </li>
              <li>
                <Link href="/student-tools" className="hover:text-indigo-400 transition-colors">
                  Student Tools
                </Link>
              </li>
              <li>
                <Link href="/quick-tools" className="hover:text-indigo-400 transition-colors">
                  Quick Utilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Popular Tools</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/tools/image-compressor" className="hover:text-indigo-400 transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/merge-pdf" className="hover:text-indigo-400 transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/split-pdf" className="hover:text-indigo-400 transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-code-generator" className="hover:text-indigo-400 transition-colors">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/jpg-to-png" className="hover:text-indigo-400 transition-colors">
                  JPG to PNG
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Legal & About</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-indigo-400 transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved.</p>

          <p className="flex items-center space-x-1">
            <span>Built with privacy & browser-first engine</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
