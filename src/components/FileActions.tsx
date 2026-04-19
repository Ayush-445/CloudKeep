"use client";

import { Star, Trash, X, ArrowUpFromLine, Download } from "lucide-react";
import { Button } from "@heroui/react";
import type { File as FileType } from "@/lib/db/schema";

interface FileActionsProps {
  file: FileType;
  onStar: (id: string) => void;
  onTrash: (id: string) => void;
  onDelete: (file: FileType) => void;
  onDownload: (file: FileType) => void;
}

export default function FileActions({
  file,
  onStar,
  onTrash,
  onDelete,
  onDownload,
}: FileActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-end">

      {/* DOWNLOAD */}
      {!file.isTrash && !file.isFolder && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onDownload(file)}
          className="flex items-center gap-2 px-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      )}

      {/* STAR */}
      {!file.isTrash && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onStar(file.id)}
          className="flex items-center gap-2 px-2"
        >
          <Star
            className={`h-4 w-4 ${
              file.isStarred
                ? "text-yellow-400 fill-yellow-400"
                : "text-default-400"
            }`}
          />
          <span className="hidden sm:inline">
            {file.isStarred ? "Unstar" : "Star"}
          </span>
        </Button>
      )}

      {/* TRASH / RESTORE */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onTrash(file.id)}
        className="flex items-center gap-2 px-2"
      >
        {file.isTrash ? (
          <ArrowUpFromLine className="h-4 w-4 text-green-500" />
        ) : (
          <Trash className="h-4 w-4 text-default-500" />
        )}

        <span className="hidden sm:inline">
          {file.isTrash ? "Restore" : "Delete"}
        </span>
      </Button>

      {/* PERMANENT DELETE */}
      {file.isTrash && (
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(file)}
          className="flex items-center gap-2 px-2"
        >
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Remove</span>
        </Button>
      )}
    </div>
  );
}