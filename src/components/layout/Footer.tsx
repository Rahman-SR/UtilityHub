import React from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/config/brand';
import { YoursthingLogoMark } from '../brand/YoursthingLogo';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B101D] dark:bg-[#070B14] text-slate-300 border-t border-slate-800/80 pt-16 pb-12 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Info (Spans 2 columns) */}
          <div className="md:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center space-x-2.5 group cursor-pointer" aria-label="Yoursthing Home">
              <YoursthingLogoMark className="w-10 h-10 shrink-0 group-hover:scale-105 transition-transform duration-200 drop-shadow-xs" />
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-2xl text-white tracking-tight group-hover:text-blue-400 dark:group-hover:text-indigo-400 transition-colors">
                  Yours<span className="relative">th<span className="inline-block relative">i<span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /></span>ng</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide mt-0.5">
                  {BRAND_CONFIG.tagline}
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md font-medium">
              Free, fast, and 100% privacy-first online utilities. Compress images, merge PDFs, generate QR codes, build resumes, and calculate finances directly inside your browser without server uploads.
            </p>

            {/* Privacy Badge */}
            <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-[#121829] border border-slate-800 text-xs sm:text-sm font-bold text-emerald-400 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Server Uploads • 100% Client-Side</span>
            </div>
          </div>

          {/* Quick Category Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-100 font-heading">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm font-bold text-slate-300">
              <li>
                <Link href="/image-tools" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>Image Tools</span>
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>PDF Tools</span>
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>Financial Calculators</span>
                </Link>
              </li>
              <li>
                <Link href="/student-tools" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>Student Tools</span>
                </Link>
              </li>
              <li>
                <Link href="/quick-tools" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>Quick Utilities</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-100 font-heading">
              Popular Tools
            </h4>
            <ul className="space-y-2.5 text-sm font-bold text-slate-300">
              <li>
                <Link href="/tools/image-compressor" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>Image Compressor</span>
                </Link>
              </li>
              <li>
                <Link href="/tools/merge-pdf" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>Merge PDF</span>
                </Link>
              </li>
              <li>
                <Link href="/tools/split-pdf" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>Split PDF</span>
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-code-generator" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>QR Code Generator</span>
                </Link>
              </li>
              <li>
                <Link href="/tools/jpg-to-png" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>JPG to PNG</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-100 font-heading">
              Legal & About
            </h4>
            <ul className="space-y-2.5 text-sm font-bold text-slate-300">
              <li>
                <Link href="/about" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>Contact Support</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-blue-400 dark:hover:text-indigo-400 transition-colors inline-flex items-center space-x-1">
                  <span>Disclaimer</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm font-medium text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved.</p>

          <p className="flex items-center space-x-1.5 text-slate-400">
            <span>Powered by 100% Browser HTML5 & WebAssembly Engine</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
