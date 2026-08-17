import React from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getToolBySlug, TOOLS } from '@/data/tools';
import { constructMetadata, generateToolJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { ToolPageShell } from '@/components/layout/ToolPageShell';

// Code-split all tool workspace components dynamically to prevent loading unneeded engines
const ImageCompressorWorkspace = dynamic(() =>
  import('@/components/tools/ImageCompressorWorkspace').then((m) => m.ImageCompressorWorkspace)
);
const ImageResizerWorkspace = dynamic(() =>
  import('@/components/tools/ImageResizerWorkspace').then((m) => m.ImageResizerWorkspace)
);
const JpgToPngWorkspace = dynamic(() =>
  import('@/components/tools/JpgToPngWorkspace').then((m) => m.JpgToPngWorkspace)
);
const PngToJpgWorkspace = dynamic(() =>
  import('@/components/tools/PngToJpgWorkspace').then((m) => m.PngToJpgWorkspace)
);
const ImageToPdfWorkspace = dynamic(() =>
  import('@/components/tools/ImageToPdfWorkspace').then((m) => m.ImageToPdfWorkspace)
);
const QrGeneratorWorkspace = dynamic(() =>
  import('@/components/tools/QrGeneratorWorkspace').then((m) => m.QrGeneratorWorkspace)
);
const CompressPdfWorkspace = dynamic(() =>
  import('@/components/tools/CompressPdfWorkspace').then((m) => m.CompressPdfWorkspace)
);
const MergePdfWorkspace = dynamic(() =>
  import('@/components/tools/MergePdfWorkspace').then((m) => m.MergePdfWorkspace)
);
const SplitPdfWorkspace = dynamic(() =>
  import('@/components/tools/SplitPdfWorkspace').then((m) => m.SplitPdfWorkspace)
);
const JpgToPdfWorkspace = dynamic(() =>
  import('@/components/tools/JpgToPdfWorkspace').then((m) => m.JpgToPdfWorkspace)
);
const GstCalculatorWorkspace = dynamic(() =>
  import('@/components/tools/GstCalculatorWorkspace').then((m) => m.GstCalculatorWorkspace)
);
const EmiCalculatorWorkspace = dynamic(() =>
  import('@/components/tools/EmiCalculatorWorkspace').then((m) => m.EmiCalculatorWorkspace)
);
const SipCalculatorWorkspace = dynamic(() =>
  import('@/components/tools/SipCalculatorWorkspace').then((m) => m.SipCalculatorWorkspace)
);
const PercentageCalculatorWorkspace = dynamic(() =>
  import('@/components/tools/PercentageCalculatorWorkspace').then((m) => m.PercentageCalculatorWorkspace)
);
const CgpaCalculatorWorkspace = dynamic(() =>
  import('@/components/tools/CgpaCalculatorWorkspace').then((m) => m.CgpaCalculatorWorkspace)
);
const AttendanceCalculatorWorkspace = dynamic(() =>
  import('@/components/tools/AttendanceCalculatorWorkspace').then((m) => m.AttendanceCalculatorWorkspace)
);
const AgeCalculatorWorkspace = dynamic(() =>
  import('@/components/tools/AgeCalculatorWorkspace').then((m) => m.AgeCalculatorWorkspace)
);
const ResumeBuilderWorkspace = dynamic(() =>
  import('@/components/tools/ResumeBuilderWorkspace').then((m) => m.ResumeBuilderWorkspace)
);

// Generic Fallback Shells
import { FileToolWorkspace } from '@/components/tools/FileToolWorkspace';
import { CalculatorWorkspace } from '@/components/tools/CalculatorWorkspace';
import { GeneratorWorkspace } from '@/components/tools/GeneratorWorkspace';

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

  const jsonLd = generateToolJsonLd(tool);

  // Router dispatcher matching code-split workspace chunks
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
      case 'compress-pdf':
        return <CompressPdfWorkspace tool={tool} />;
      case 'merge-pdf':
        return <MergePdfWorkspace tool={tool} />;
      case 'split-pdf':
        return <SplitPdfWorkspace tool={tool} />;
      case 'jpg-to-pdf':
        return <JpgToPdfWorkspace tool={tool} />;
      case 'gst-calculator':
        return <GstCalculatorWorkspace tool={tool} />;
      case 'emi-calculator':
        return <EmiCalculatorWorkspace tool={tool} />;
      case 'sip-calculator':
        return <SipCalculatorWorkspace tool={tool} />;
      case 'percentage-calculator':
        return <PercentageCalculatorWorkspace tool={tool} />;
      case 'cgpa-calculator':
        return <CgpaCalculatorWorkspace tool={tool} />;
      case 'attendance-calculator':
        return <AttendanceCalculatorWorkspace tool={tool} />;
      case 'age-calculator':
        return <AgeCalculatorWorkspace tool={tool} />;
      case 'resume-builder':
        return <ResumeBuilderWorkspace tool={tool} />;
      default:
        if (tool.family === 'file') return <FileToolWorkspace tool={tool} />;
        if (tool.family === 'calculator') return <CalculatorWorkspace tool={tool} />;
        return <GeneratorWorkspace tool={tool} />;
    }
  };

  const isResumeBuilder = tool.slug === 'resume-builder';

  return (
    <ToolPageShell tool={tool} maxWidthClassName={isResumeBuilder ? 'max-w-[1440px]' : 'max-w-6xl'}>
      <JsonLd data={jsonLd} />
      {renderWorkspace()}
    </ToolPageShell>
  );
}
