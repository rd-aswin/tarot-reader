import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col p-6 md:p-12 space-y-8">
      <Link href="/" className="flex items-center gap-2 text-[#9E9EB2] hover:text-[#F4EFE6] transition-colors w-max">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest font-[family-name:var(--font-cinzel)]">Return</span>
      </Link>
      <div className="space-y-6 text-[#9E9EB2] text-sm leading-relaxed scrying-glass p-8 rounded-2xl">
        <h1 className="text-2xl text-[#F4EFE6] font-[family-name:var(--font-cormorant)]">Terms of Service</h1>
        <p><strong>For Entertainment Purposes Only.</strong></p>
        <p>The contents of this software are strictly for entertainment, educational, and personal self-reflection purposes only. It is not a replacement for professional medical, legal, or financial advice.</p>
        <p><strong>Age Requirement:</strong> You must be 18 years of age or older to use this service.</p>
        <p><strong>No Guarantees:</strong> We make no guarantees or representations regarding the accuracy, reliability, or completeness of the interpretations provided. Use of this application is entirely at your own risk.</p>
      </div>
    </div>
  );
}
