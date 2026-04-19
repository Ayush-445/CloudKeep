"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

import type { File as FileType } from "@/lib/db/schema";

import ConfirmationModal from "@/components/ui/ConfirmationModal";
import FileEmptyState from "@/components/FileEmptyState";
import FileIcon from "@/components/FileIcon";
import FileActions from "@/components/FileActions";
import FileLoadingState from "@/components/FileLoadingState";
import FileTabs from "@/components/FileTabs";
import FolderNavigation from "@/components/FolderNavigation";
import FileActionButtons from "@/components/FileActionButtons";

interface FileListProps {
  userId: string;
  refreshTrigger?: number;
  onFolderChange?: (folderId: string | null) => void;
}

export default function FileList({
  userId,
  refreshTrigger = 0,
  onFolderChange,
}: FileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emptyTrashModalOpen, setEmptyTrashModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  // ================= FETCH =================
  const fetchFiles = async () => {
    setLoading(true);
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) url += `&parentId=${currentFolder}`;

      const res = await axios.get(url);
      setFiles(res.data);
    } catch {
      console.error("Error loading files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [userId, refreshTrigger, currentFolder]);

  // ================= FILTER =================
  const filteredFiles = useMemo(() => {
    if (activeTab === "starred")
      return files.filter((f) => f.isStarred && !f.isTrash);
    if (activeTab === "trash") return files.filter((f) => f.isTrash);
    return files.filter((f) => !f.isTrash);
  }, [files, activeTab]);

  const trashCount = files.filter((f) => f.isTrash).length;
  const starredCount = files.filter(
    (f) => f.isStarred && !f.isTrash
  ).length;

  // ================= ACTIONS =================
  const onStar = async (id: string) => {
    await axios.patch(`/api/files/${id}/star`);
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, isStarred: !f.isStarred } : f
      )
    );
  };

  const onTrash = async (id: string) => {
    await axios.patch(`/api/files/${id}/trash`);
    fetchFiles();
  };

  const onDelete = async (id: string) => {
    await axios.delete(`/api/files/${id}/delete`);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setDeleteModalOpen(false);
  };

  const handleEmptyTrash = async () => {
    await axios.delete(`/api/files/empty-trash`);
    setFiles((prev) => prev.filter((f) => !f.isTrash));
    setEmptyTrashModalOpen(false);
  };

  const onDownload = async (file: FileType) => {
    const res = await fetch(file.fileUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();

    URL.revokeObjectURL(url);
  };

  // ================= NAVIGATION =================
  const handleItemClick = (file: FileType) => {
    if (file.isFolder) {
      setCurrentFolder(file.id);
      setFolderPath((prev) => [...prev, { id: file.id, name: file.name }]);
      onFolderChange?.(file.id);
    }
  };

  if (loading) return <FileLoadingState />;

  return (
    <div className="space-y-6">

      {/* Tabs */}
      <FileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        files={files}
        starredCount={starredCount}
        trashCount={trashCount}
      />

      {/* Folder Navigation */}
      {activeTab === "all" && (
        <FolderNavigation
          folderPath={folderPath}
          navigateUp={() => setCurrentFolder(null)}
          navigateToPathFolder={() => setCurrentFolder(null)}
        />
      )}

      {/* Actions */}
      <FileActionButtons
        activeTab={activeTab}
        trashCount={trashCount}
        folderPath={folderPath}
        onRefresh={fetchFiles}
        onEmptyTrash={() => setEmptyTrashModalOpen(true)}
      />

      {/* EMPTY STATE */}
      {filteredFiles.length === 0 ? (
        <FileEmptyState activeTab={activeTab} />
      ) : (
        <Card className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border rounded-2xl overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-5 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-default-500 border-b border-default-200 dark:border-default-800">
            <span>Name</span>
            <span>Type</span>
            <span>Size</span>
            <span>Added</span>
            <span className="text-right">Actions</span>
          </div>

          {/* FILE ROWS */}
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => handleItemClick(file)}
              className="grid grid-cols-5 px-5 py-3 items-center text-sm border-b border-default-100 dark:border-default-800 hover:bg-default-100 transition cursor-pointer"
            >
              {/* NAME */}
              <div className="flex items-center gap-3">
                <FileIcon file={file} />
                <span className="truncate max-w-[200px] font-medium">
                  {file.name}
                </span>
              </div>

              {/* TYPE */}
              <div className="text-default-500">
                {file.isFolder ? "Folder" : file.type}
              </div>

              {/* SIZE */}
              <div className="text-default-500">
                {file.isFolder
                  ? "-"
                  : `${(file.size / 1024).toFixed(1)} KB`}
              </div>

              {/* DATE */}
              <div className="text-default-500">
                {formatDistanceToNow(new Date(file.createdAt))}
              </div>

              {/* ACTIONS */}
              <div
                className="flex justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <FileActions
                  file={file}
                  onStar={onStar}
                  onTrash={onTrash}
                  onDelete={(f: any) => {
                    setSelectedFile(f);
                    setDeleteModalOpen(true);
                  }}
                  onDownload={onDownload}
                />
              </div>
            </div>
          ))}

        </Card>
      )}

      {/* MODALS */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete File"
        description="This action cannot be undone"
        onConfirm={() => selectedFile && onDelete(selectedFile.id)}
        isDangerous
      />

      <ConfirmationModal
        isOpen={emptyTrashModalOpen}
        onOpenChange={setEmptyTrashModalOpen}
        title="Empty Trash"
        description="Delete all files permanently"
        onConfirm={handleEmptyTrash}
        isDangerous
      />
    </div>
  );
}
