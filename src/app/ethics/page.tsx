import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EthicsPage() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col p-6 md:p-12 space-y-8">
      <Link href="/" className="flex items-center gap-2 text-[#9E9EB2] hover:text-[#F4EFE6] transition-colors w-max">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest font-[family-name:var(--font-cinzel)]">Return</span>
      </Link>
      <div className="space-y-6 text-[#9E9EB2] text-sm leading-relaxed scrying-glass p-8 rounded-2xl">
        <h1 className="text-2xl text-[#F4EFE6] font-[family-name:var(--font-cormorant)]">Code of Ethics</h1>
        <p>This Digital Sanctuary abides by the highest ethical standards of tarot reading. We believe in empowering the querent, maintaining confidentiality, and respecting the boundaries of our practice.</p>
        <h2 className="text-[#D4AF37] font-semibold mt-4">The Four Red Lines</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>No Medical Diagnosis:</strong> We do not provide health, psychiatric, or medical advice.</li>
          <li><strong>No Legal Advice:</strong> We do not offer counsel on judicial or legal matters.</li>
          <li><strong>No Financial Speculation:</strong> We do not predict market trends, gambling outcomes, or provide financial advice.</li>
          <li><strong>No Third-Party Spying:</strong> We do not read on the private lives, thoughts, or feelings of individuals not present for the reading.</li>
        </ul>
        <h2 className="text-[#D4AF37] font-semibold mt-4">Client Agency</h2>
        <p>The future is not fixed. Tarot is a mirror for your subconscious and a tool for reflection, not a deterministic forecast. Your choices dictate your path.</p>
      </div>
    </div>
  );
}
