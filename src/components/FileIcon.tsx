"use client";

import { Folder, FileText, Video } from "lucide-react";
import type { File as FileType } from "@/lib/db/schema";

interface FileIconProps {
  file: FileType;
}

export default function FileIcon({ file }: FileIconProps) {
  const container =
    "h-12 w-12 flex items-center justify-center rounded-lg bg-default-100 dark:bg-white/5 overflow-hidden";

  if (file.isFolder) {
    return (
      <div className={container}>
        <Folder className="h-6 w-6 text-blue-500" />
      </div>
    );
  }

  const fileType = file.type?.split("/")[0] || "";

  if (fileType === "image" && file.fileUrl) {
    return (
      <div className={container}>
        <img
          src={file.fileUrl}
          alt={file.name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (fileType === "video") {
    return (
      <div className={container}>
        <Video className="h-6 w-6 text-purple-500" />
      </div>
    );
  }

  if (file.type?.includes("pdf")) {
    return (
      <div className={container}>
        <FileText className="h-6 w-6 text-red-500" />
      </div>
    );
  }

  return (
    <div className={container}>
      <FileText className="h-6 w-6 text-default-400" />
    </div>
  );
}