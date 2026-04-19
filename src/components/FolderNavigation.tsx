"use client";

import { ArrowUpFromLine } from "lucide-react";
import { Button } from "@heroui/react";

interface FolderNavigationProps {
  folderPath: Array<{ id: string; name: string }>;
  navigateUp: () => void;
  navigateToPathFolder: (index: number) => void;
}

export default function FolderNavigation({
  folderPath,
  navigateUp,
  navigateToPathFolder,
}: FolderNavigationProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm overflow-x-auto pb-2">
      <Button
        variant="ghost"
        size="sm"
        isIconOnly
        onClick={navigateUp}
        isDisabled={folderPath.length === 0}
      >
        <ArrowUpFromLine className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigateToPathFolder(-1)}
        className={folderPath.length === 0 ? "font-bold" : ""}
      >
        Home
      </Button>
      {folderPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
            <span className="mx-1 text-default-400">/</span>
            <div title={folder.name}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToPathFolder(index)}
                className={`${
                index === folderPath.length - 1 ? "font-bold" : ""
                } truncate max-w-[150px]`}
            >
            {folder.name}
            </Button>
            </div>
        </div>
      ))}
    </div>
  );
}