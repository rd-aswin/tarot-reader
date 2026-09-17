"use client";

import React, { useEffect, useState } from "react";
import { db, StoredReading } from "@/lib/db";
import { Feather, Download, Upload, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JournalPage() {
  const [readings, setReadings] = useState<StoredReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    try {
      const data = await db.readings.orderBy("createdAt").reverse().toArray();
      setReadings(data);
    } catch (err) {
      console.error("Failed to load readings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (id !== undefined && confirm("Are you sure you want to delete this private record?")) {
      await db.readings.delete(id);
      loadReadings();
    }
  };

  const handleExport = async () => {
    const data = await db.readings.toArray();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tarot-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedData)) {
          // Remove ids to avoid conflicts if auto-increment is used
          const safeData = importedData.map(r => {
            const { id, ...rest } = r;
            return rest;
          });
          await db.readings.bulkPut(safeData);
          loadReadings();
          alert("Journal successfully imported.");
        }
      } catch (err) {
        alert("Failed to parse the backup file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-start p-4 md:p-8">
      <header className="w-full flex items-center justify-between py-4 border-b border-[rgba(212,175,55,0.15)] mb-8">
        <Link href="/" className="flex items-center gap-2 text-[#9E9EB2] hover:text-[#F4EFE6] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest font-[family-name:var(--font-cinzel)]">Return to Sanctuary</span>
        </Link>
        <div className="flex gap-4">
          <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(212,175,55,0.2)] hover:border-[#D4AF37]/50 bg-[#14141B] text-xs text-[#9E9EB2] hover:text-[#F4EFE6]">
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(212,175,55,0.2)] hover:border-[#D4AF37]/50 bg-[#14141B] text-xs text-[#9E9EB2] hover:text-[#F4EFE6]">
            <Download className="w-3.5 h-3.5" />
            <span>Save Backup</span>
          </button>
        </div>
      </header>

      <div className="w-full space-y-8 animate-in fade-in duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-medium tracking-wide text-[#F4EFE6] font-[family-name:var(--font-cormorant)]">
            Private Reflection Journal
          </h1>
          <p className="text-sm text-[#9E9EB2] max-w-lg mx-auto">
            Your readings are entirely private and saved only on this device.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-[#D4AF37] text-sm py-12 animate-pulse">Opening your journal...</div>
        ) : readings.length === 0 ? (
          <div className="text-center text-[#68687D] text-sm py-12">
            Your journal is currently empty.
          </div>
        ) : (
          <div className="space-y-6">
            {readings.map((reading) => (
              <div key={reading.uuid} className="w-full scrying-glass p-6 rounded-xl border border-[rgba(212,175,55,0.1)] relative">
                <button onClick={() => handleDelete(reading.id)} className="absolute top-4 right-4 text-[#68687D] hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="mb-4 space-y-1">
                  <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest">{new Date(reading.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <h3 className="text-lg text-[#F4EFE6] font-[family-name:var(--font-cormorant)] italic">&ldquo;{reading.question}&rdquo;</h3>
                  <span className="text-xs text-[#9E9EB2]">Spread: {reading.spreadType}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {reading.cards.map((c: any, i: number) => (
                    <div key={i} className="text-[11px] bg-[#14141B] border border-[#D4AF37]/20 px-2 py-1 rounded text-[#9E9EB2]">
                      <span className="text-[#D4AF37] mr-1">{c.position}:</span>
                      {c.name} {c.isReversed ? "(Rev)" : ""}
                    </div>
                  ))}
                </div>

                {reading.reflectionNotes && (
                  <div className="pl-4 border-l-2 border-[#D4AF37]/30 text-sm text-[#F4EFE6]/80 italic whitespace-pre-wrap">
                    {reading.reflectionNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
