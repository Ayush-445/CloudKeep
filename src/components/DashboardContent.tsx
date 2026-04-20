"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Grid, List } from "lucide-react";

import FileGrid from "@/components/FileGrid";
import FileListView from "@/components/FileListView";
import DropZone from "@/components/DropZone";
import FileTabs from "@/components/FileTabs";
import FileActionButtons from "@/components/FileActionButtons";
import FolderNavigation from "@/components/FolderNavigation";
import FileUploadForm from "@/components/FileUploadForm";
import UserProfile from "@/components/UserProfile";
import FileEmptyState from "./FileEmptyState";

interface DashboardContentProps {
  userId: string;
  userName: string;
  user: any;
}

export default function DashboardContent({
  userId,
  userName,
  user,
}: DashboardContentProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const [files, setFiles] = useState<any[]>([]);

  // 🔹 Sync tab with URL
  useEffect(() => {
    if (tabParam === "profile") {
      setActiveTab("profile");
    } else {
      setActiveTab("all");
    }
  }, [tabParam]);

  // 🔹 Fetch files
  const fetchFiles = async () => {
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) url += `&parentId=${currentFolder}`;

      const res = await fetch(url);
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error("Invalid files response:", data);
        setFiles([]); // prevent crash
        return;
      }
      setFiles(data);
    } catch (err) {
      console.error("Error fetching files", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [userId, refreshTrigger, currentFolder]);

  // 🔹 Filter files
  const filteredFiles = Array.isArray(files)?files.filter((file) => {
    if (activeTab === "starred") return file.isStarred && !file.isTrash;
    if (activeTab === "trash") return file.isTrash;
    return !file.isTrash;
  }):[];

  const starredCount = files.filter(
    (f) => f.isStarred && !f.isTrash
  ).length;

  const trashCount = files.filter((f) => f.isTrash).length;

  // 🔹 Actions
  const handleFileUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleItemClick = (file: any) => {
    if (file.isFolder) {
      setCurrentFolder(file.id);
      setFolderPath((prev) => {
        const index = prev.findIndex((f) => f.id === file.id);
        if (index !== -1) {
          return prev.slice(0, index + 1);
        }
        return [...prev, { id: file.id, name: file.name }];
      });
    }
  };

  const handleStarFile = async (id: string) => {
    await fetch(`/api/files/${id}/star`, {
    method: "PATCH",
    });

    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, isStarred: !f.isStarred } : f
      )
    );
  };

  const handleTrashFile = async (id: string) => {
    await fetch(`/api/files/${id}/trash`, {
      method: "PATCH",
    });

    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, isTrash: !f.isTrash } : f
      )
    );
  };

  const handleDeleteFile = async (file: any) => {
    await fetch(`/api/files/${file.id}/delete`, {
      method: "DELETE",
    });

    setFiles((prev) => prev.filter((f) => f.id !== file.id));
  };

  const handleDownloadFile = (file: any) => {
    window.open(file.fileUrl, "_blank");
  };

  return (
    <div className="bg-[#0b1f3a]/60 space-y-8 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            Hi{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {user?.split(" ")[0] || "there"}
            </span>{" "}
            👋
          </h2>

          <p className="text-sm text-blue-200/70 mt-1">
            Your personal cloud workspace
          </p>
        </div>

        {/* VIEW TOGGLE */}
        {activeTab !== "profile" && (
          <div className="flex gap-2 bg-blue-900/40 p-1 rounded-xl border border-blue-800/40">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition ${
                view === "grid"
                  ? "bg-blue-500 text-white"
                  : "text-blue-300 hover:bg-blue-800/40"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>

            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition ${
                view === "list"
                  ? "bg-blue-500 text-white"
                  : "text-blue-300 hover:bg-blue-800/40"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* PROFILE PAGE */}
      {activeTab === "profile" ? (
        <UserProfile
          userName={userName}
          email={user?.emailAddress}
          imageUrl={user?.imageUrl}
        />
      ) : (
        <>
          {/* UPLOAD ZONE */}
          <div className="bg-[#0b1f3a]/60 backdrop-blur-xl border border-blue-800/30 rounded-2xl p-6 shadow-lg">
            <DropZone onDrop={(files) => console.log(files)} />

            <div className="mt-4">
              <FileUploadForm
                userId={userId}
                onUploadSuccess={handleFileUploadSuccess}
                currentFolder={currentFolder}
              />
            </div>
          </div>

          {/* TABS */}
          <FileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            files={files}
            starredCount={starredCount}
            trashCount={trashCount}
          />

          {/* FOLDER NAV */}
          {activeTab === "all" && (
            <FolderNavigation
              folderPath={folderPath}
              navigateUp={() => {
                setFolderPath((prev) => {
                  const newPath = prev.slice(0, -1);
                  setCurrentFolder(newPath[newPath.length - 1]?.id || null);
                  return newPath;
                });
              }}
              navigateToPathFolder={(index) => {
                if (index === -1) {
                  setFolderPath([]);
                  setCurrentFolder(null);
                  return;
                }
                setFolderPath((prev) => {
                  const newPath = prev.slice(0, index + 1);
                  setCurrentFolder(newPath[newPath.length - 1]?.id || null);
                  return newPath;
                });
              }}
            />
          )}

          {/* ACTION BAR */}
          <FileActionButtons
            activeTab={activeTab}
            trashCount={trashCount}
            folderPath={folderPath}
            onRefresh={fetchFiles}
            onEmptyTrash={() => console.log("empty trash")}
          />

          {/* FILE DISPLAY */}
          <div className="bg-[#0b1f3a]/60 border border-blue-800/30 rounded-2xl p-5 backdrop-blur-xl shadow-lg">
            {filteredFiles.length === 0 ? (
              <FileEmptyState activeTab={activeTab} />
            ) : view === "grid" ? (
              <FileGrid 
              files={filteredFiles} 
              onClick={handleItemClick} 
              onStar={handleStarFile}
              onTrash={handleTrashFile}
              onDelete={handleDeleteFile}
              onDownload={handleDownloadFile}
              />
            ) : (
              <FileListView 
              files={filteredFiles} 
              onClick={handleItemClick}
              onStar={handleStarFile}
              onTrash={handleTrashFile}
              onDelete={handleDeleteFile}
              onDownload={handleDownloadFile} 
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}