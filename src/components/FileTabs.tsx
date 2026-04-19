"use client";

import { File, Star, Trash } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { File as FileType } from "@/lib/db/schema";

interface FileTabsProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  files: FileType[];
  starredCount: number;
  trashCount: number;
}

export default function FileTabs({
  activeTab,
  onTabChange,
  files,
  starredCount,
  trashCount,
}: FileTabsProps) {
  return (
    <div className="w-full">

      {/* TAB BUTTONS */}
      <div className="flex gap-4 border-b border-default-200 pb-2 overflow-x-auto">

        {/* ALL */}
        <button
          onClick={() => onTabChange("all")}
          className={`flex items-center gap-2 px-2 pb-2 text-sm font-medium transition ${
            activeTab === "all"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-800"
          }`}
        >
          <File className="h-4 w-4" />
          All Files
          <Badge variant="flat" color="default" size="sm">
            {files.filter((file) => !file.isTrash).length}
          </Badge>
        </button>

        {/* STARRED */}
        <button
          onClick={() => onTabChange("starred")}
          className={`flex items-center gap-2 px-2 pb-2 text-sm font-medium transition ${
            activeTab === "starred"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-800"
          }`}
        >
          <Star className="h-4 w-4" />
          Starred
          <Badge variant="flat" color="warning" size="sm">
            {starredCount}
          </Badge>
        </button>

        {/* TRASH */}
        <button
          onClick={() => onTabChange("trash")}
          className={`flex items-center gap-2 px-2 pb-2 text-sm font-medium transition ${
            activeTab === "trash"
              ? "border-b-2 border-primary text-primary"
              : "text-default-500 hover:text-default-800"
          }`}
        >
          <Trash className="h-4 w-4" />
          Trash
          <Badge variant="solid" color="danger" size="sm">
            {trashCount}
          </Badge>
        </button>

      </div>
    </div>
  );
}