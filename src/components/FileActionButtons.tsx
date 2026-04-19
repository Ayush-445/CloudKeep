"use client";

import { RefreshCw, Trash } from "lucide-react";
import { Button } from "@heroui/react";

interface FileActionButtonsProps {
  activeTab: string;
  trashCount: number;
  folderPath: Array<{ id: string; name: string }>;
  onRefresh: () => void;
  onEmptyTrash: () => void;
}

export default function FileActionButtons({
  activeTab,
  trashCount,
  folderPath,
  onRefresh,
  onEmptyTrash,
}: FileActionButtonsProps) {
  const getTitle = () => {
    if (activeTab === "all") {
      return folderPath.length > 0
        ? folderPath[folderPath.length - 1].name
        : "All Files";
    }
    if (activeTab === "starred") return "Starred Files";
    if (activeTab === "trash") return "Trash";
    return "Files";
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

      {/* 🔹 TITLE */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          {getTitle()}
        </h2>

        {/* Optional breadcrumb */}
        {activeTab === "all" && folderPath.length > 0 && (
          <p className="text-xs text-default-500 mt-1 truncate max-w-[250px]">
            {folderPath.map((f) => f.name).join(" / ")}
          </p>
        )}
      </div>

      {/* 🔹 ACTION BUTTONS */}
      <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-end">

        {/* REFRESH */}
        <Button
          variant="secondary" // ✅ valid
          size="sm"
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>

        {/* EMPTY TRASH */}
        {activeTab === "trash" && trashCount > 0 && (
          <Button
            variant="danger" // ✅ valid
            size="sm"
            onClick={onEmptyTrash}
            className="flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Empty Trash
          </Button>
        )}
      </div>
    </div>
  );
}