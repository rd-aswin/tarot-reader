import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col p-6 md:p-12 space-y-8">
      <Link href="/" className="flex items-center gap-2 text-[#9E9EB2] hover:text-[#F4EFE6] transition-colors w-max">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest font-[family-name:var(--font-cinzel)]">Return</span>
      </Link>
      <div className="space-y-6 text-[#9E9EB2] text-sm leading-relaxed scrying-glass p-8 rounded-2xl">
        <h1 className="text-2xl text-[#F4EFE6] font-[family-name:var(--font-cormorant)]">Privacy Policy</h1>
        <p><strong>Your Reflections Are Yours.</strong></p>
        <p>Your privacy is deeply respected here. When you save a reading to your Journal, it is stored entirely on your own device. We do not maintain any central databases or save your personal reflections to our servers.</p>
        <p><strong>AI Assistance:</strong> When you ask a question or request a reading synthesis, your question is temporarily sent to an AI service (Google Gemini) to generate your personalized reading. This data is processed securely and is not used to train public AI models.</p>
        <p><strong>Local Journal:</strong> You have complete control over your saved readings and can delete or export them at any time from the Journal page.</p>
      </div>
    </div>
  );
}
