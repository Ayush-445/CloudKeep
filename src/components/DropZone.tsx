"use client";

import { useCallback } from "react";
import { UploadCloud } from "lucide-react";

export default function DropZone({ onDrop }: { onDrop: (files: File[]) => void }) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(Array.from(e.dataTransfer.files));
  }, [onDrop]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-white/20 rounded-xl p-10 text-center hover:border-blue-400 transition"
    >
      <UploadCloud className="mx-auto mb-2 h-8 w-8 text-gray-400" />
      <p className="text-sm text-gray-400">
        Drag & drop files here
      </p>
    </div>
  );
}