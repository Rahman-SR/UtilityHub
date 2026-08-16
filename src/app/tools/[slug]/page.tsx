import React from 'react';
import { notFound } from 'next/navigation';
import { getToolBySlug, TOOLS } from '@/data/tools';
import { CATEGORIES } from '@/data/categories';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

// Phase 2.2 Image & QR Workspaces
import { ImageCompressorWorkspace } from '@/components/tools/ImageCompressorWorkspace';
import { ImageResizerWorkspace } from '@/components/tools/ImageResizerWorkspace';
import { JpgToPngWorkspace } from '@/components/tools/JpgToPngWorkspace';
import { PngToJpgWorkspace } from '@/components/tools/PngToJpgWorkspace';
import { ImageToPdfWorkspace } from '@/components/tools/ImageToPdfWorkspace';
import { QrGeneratorWorkspace } from '@/components/tools/QrGeneratorWorkspace';

// Phase 2.3 PDF Workspaces
import { MergePdfWorkspace } from '@/components/tools/MergePdfWorkspace';
import { SplitPdfWorkspace } from '@/components/tools/SplitPdfWorkspace';
import { JpgToPdfWorkspace } from '@/components/tools/JpgToPdfWorkspace';

// Generic Fallback Shells
import { FileToolWorkspace } from '@/components/tools/FileToolWorkspace';
import { CalculatorWorkspace } from '@/components/tools/CalculatorWorkspace';
import { GeneratorWorkspace } from '@/components/tools/GeneratorWorkspace';

import { FAQSection } from '@/components/tools/FAQSection';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { AdPlaceholder } from '@/components/ads/AdPlaceholder';
import { constructMetadata, generateToolJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { ShieldCheck } from 'lucide-react';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);
  if (!tool) return {};

  return constructMetadata({
    title: `${tool.name} — Free Online Tool`,
    description: tool.description,
    canonicalUrl: `https://dailyutilityhub.com/tools/${tool.slug}`,
  });
}

export default async function ToolPage({ params }: ToolPageProps) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);

  if (!tool) {
    notFound();
  }

  const category = CATEGORIES[tool.category];
  const jsonLd = generateToolJsonLd(tool);

  // Router dispatcher matching Phase 2.2 & 2.3 functional workspaces
  const renderWorkspace = () => {
    switch (tool.slug) {
      case 'image-compressor':
        return <ImageCompressorWorkspace tool={tool} />;
      case 'image-resizer':
        return <ImageResizerWorkspace tool={tool} />;
      case 'jpg-to-png':
        return <JpgToPngWorkspace tool={tool} />;
      case 'png-to-jpg':
        return <PngToJpgWorkspace tool={tool} />;
      case 'image-to-pdf':
        return <ImageToPdfWorkspace tool={tool} />;
      case 'qr-code-generator':
        return <QrGeneratorWorkspace tool={tool} />;
      case 'merge-pdf':
        return <MergePdfWorkspace tool={tool} />;
      case 'split-pdf':
        return <SplitPdfWorkspace tool={tool} />;
      case 'jpg-to-pdf':
        return <JpgToPdfWorkspace tool={tool} />;
      default:
        // Fallback to generic family workspaces for remaining tools
        if (tool.family === 'file') return <FileToolWorkspace tool={tool} />;
        if (tool.family === 'calculator') return <CalculatorWorkspace tool={tool} />;
        return <GeneratorWorkspace tool={tool} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <JsonLd data={jsonLd} />

      <Breadcrumbs
        items={[
          { label: category ? category.name : 'Tools', href: category ? `/${category.slug}` : '/tools' },
          { label: tool.name },
        ]}
      />

      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            {category ? category.name : tool.category}
          </span>
          {tool.localProcessing && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Browser Local Processing</span>
            </span>
          )}
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-slate-100 tracking-tight">
          {tool.name}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {tool.longDescription || tool.description}
        </p>
      </div>

      {/* Main Tool Workspace */}
      <section className="pt-2">{renderWorkspace()}</section>

      {/* Ad Slot */}
      <AdPlaceholder />

      {/* How To Use Steps */}
      {tool.howToSteps && tool.howToSteps.length > 0 && (
        <section className="max-w-4xl mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-slate-100">
            How to use {tool.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tool.howToSteps.map((step, idx) => (
              <div key={idx} className="space-y-2 relative">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  {idx + 1}
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FAQSection faqs={tool.faqs} />

      {/* Related Tools */}
      <RelatedTools currentTool={tool} />
    </div>
  );
}
