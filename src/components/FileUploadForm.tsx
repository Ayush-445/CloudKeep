// "use client";

// import { useState, useRef } from "react";
// import { Button, Input } from "@heroui/react";
// import {
//   Upload,
//   X,
//   FileUp,
//   AlertTriangle,
//   FolderPlus,
// } from "lucide-react";
// import axios from "axios";

// interface FileUploadFormProps {
//   userId: string;
//   onUploadSuccess?: () => void;
//   currentFolder?: string | null;
// }

// export default function FileUploadForm({
//   userId,
//   onUploadSuccess,
//   currentFolder = null,
// }: FileUploadFormProps) {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [folderModalOpen, setFolderModalOpen] = useState(false);
//   const [folderName, setFolderName] = useState("");
//   const [creatingFolder, setCreatingFolder] = useState(false);

//   // ✅ Allowed file types
//   const allowedTypes = [
//     "image/",
//     "video/",
//     "application/pdf",
//   ];

//   // ================= FILE CHANGE =================
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const selectedFile = e.target.files[0];

//       // ✅ TYPE VALIDATION
//       const isValidType = allowedTypes.some((type) =>
//         selectedFile.type.startsWith(type)
//       );

//       if (!isValidType) {
//         setError("Only images, videos, and PDFs are allowed");
//         return;
//       }

//       // ✅ SIZE VALIDATION
//       if (selectedFile.size > 5 * 1024 * 1024) {
//         setError("File size exceeds 5MB limit");
//         return;
//       }

//       setFile(selectedFile);
//       setError(null);
//     }
//   };

//   // ================= DRAG =================
//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();

//     if (e.dataTransfer.files?.[0]) {
//       const droppedFile = e.dataTransfer.files[0];

//       const isValidType = allowedTypes.some((type) =>
//         droppedFile.type.startsWith(type)
//       );

//       if (!isValidType) {
//         setError("Only images, videos, and PDFs are allowed");
//         return;
//       }

//       if (droppedFile.size > 5 * 1024 * 1024) {
//         setError("File size exceeds 5MB limit");
//         return;
//       }

//       setFile(droppedFile);
//       setError(null);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const clearFile = () => {
//     setFile(null);
//     setError(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // ================= UPLOAD =================
//   const handleUpload = async () => {
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("userId", userId);
//     if (currentFolder) formData.append("parentId", currentFolder);

//     setUploading(true);
//     setProgress(0);

//     try {
//       await axios.post("/api/files/upload", formData, {
//         onUploadProgress: (event) => {
//           if (event.total) {
//             const percent = Math.round(
//               (event.loaded * 100) / event.total
//             );
//             setProgress(percent);
//           }
//         },
//       });

//       clearFile();
//       onUploadSuccess?.();
//     } catch {
//       setError("Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // ================= CREATE FOLDER =================
//   const handleCreateFolder = async () => {
//     if (!folderName.trim()) return;

//     setCreatingFolder(true);

//     try {
//       await axios.post("/api/folders/create", {
//         name: folderName,
//         userId,
//         parentId: currentFolder,
//       });

//       setFolderName("");
//       setFolderModalOpen(false);
//       onUploadSuccess?.();
//     } finally {
//       setCreatingFolder(false);
//     }
//   };

//   return (
//     <div className="space-y-4">

//       {/* ACTION BUTTONS */}
//       <div className="flex gap-2">
//         <Button onClick={() => setFolderModalOpen(true)}>
//           <FolderPlus className="h-4 w-4 mr-2" />
//           New Folder
//         </Button>

//         <Button onClick={() => fileInputRef.current?.click()}>
//           <FileUp className="h-4 w-4 mr-2" />
//           Add File
//         </Button>
//       </div>

//       {/* DROP AREA */}
//       <div
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         className="border-2 border-dashed rounded-lg p-6 text-center"
//       >
//         {!file ? (
//           <>
//             <FileUp className="h-10 w-10 mx-auto text-primary" />
//             <p className="text-sm mt-2">
//               Drag & drop images, videos, or PDFs
//             </p>

//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//               className="hidden"
//               accept="image/*,video/*,application/pdf"
//             />
//           </>
//         ) : (
//           <div className="space-y-3">

//             <div className="flex justify-between items-center">
//               <div className="text-left">
//                 <p className="truncate font-medium">{file.name}</p>
//                 <p className="text-xs text-default-500">{file.type}</p>
//               </div>

//               <Button size="sm" onClick={clearFile}>
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>

//             {error && (
//               <div className="text-red-500 text-sm flex gap-2">
//                 <AlertTriangle className="h-4 w-4" />
//                 {error}
//               </div>
//             )}

//             {uploading && (
//               <div className="text-sm text-primary">
//                 Uploading... {progress}%
//               </div>
//             )}

//             <Button
//               onClick={handleUpload}
//               isDisabled={!!error || uploading}
//               className="w-full"
//             >
//               <Upload className="h-4 w-4 mr-2" />
//               {uploading ? "Uploading..." : "Upload File"}
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* TIPS */}
//       <div className="bg-default-100/5 p-4 rounded-lg">
//         <h4 className="text-sm font-medium mb-2">Supported</h4>
//         <ul className="text-xs text-default-600 space-y-1">
//           <li>• Images (JPG, PNG, GIF, WebP)</li>
//           <li>• Videos (MP4, WebM)</li>
//           <li>• PDF files</li>
//           <li>• Max size: 5MB</li>
//         </ul>
//       </div>

//       {/* MODAL */}
//       {folderModalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white dark:bg-black p-6 rounded-lg w-full max-w-sm space-y-4">

//             <h2 className="text-lg font-semibold">New Folder</h2>

//             <Input
//               value={folderName}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setFolderName(e.target.value)
//               }
//               placeholder="Folder name"
//             />

//             <div className="flex justify-end gap-2">
//               <Button onClick={() => setFolderModalOpen(false)}>
//                 Cancel
//               </Button>

//               <Button
//                 onClick={handleCreateFolder}
//                 isDisabled={!folderName.trim() || creatingFolder}
//               >
//                 {creatingFolder ? "Creating..." : "Create"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import axios from "axios";
import { UploadCloud, File, X } from "lucide-react";

interface FileUploadFormProps {
  userId: string;
  currentFolder?: string | null;
  onUploadSuccess?: () => void;
}

export default function FileUploadForm({
  userId,
  currentFolder,
  onUploadSuccess,
}: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  // ================= CREATE FOLDER =================
  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    setCreatingFolder(true);

    try {
      await axios.post("/api/folders/create", {
        name: folderName,
        parentId: currentFolder,
      });

      setFolderName("");
      onUploadSuccess?.();
    } catch (err) {
      console.error("Folder creation failed", err);
    } finally {
      setCreatingFolder(false);
    }
  };

  // ================= IMAGEKIT UPLOAD =================
  const uploadToImageKit = async (file: File) => {
    const auth = await fetch("/api/imagekit-auth").then((res) =>
      res.json()
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("signature", auth.signature);
    formData.append("expire", auth.expire);
    formData.append("token", auth.token);
    formData.append(
      "publicKey",
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
    );

    // optional tagging (useful later)
    formData.append("tags", `user:${userId}`);

    const res = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    return await res.json();
  };



  // ================= HANDLE UPLOAD =================
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(10);
    setError(null);

    try {
      // STEP 1: upload to ImageKit
      const uploaded = await uploadToImageKit(file);

      setProgress(70);

      // STEP 2: save metadata in DB
      await axios.post("/api/upload", {
        name: file.name,
        url: uploaded.url,
        size: file.size,
        type: file.type,
        parentId: currentFolder,
      });

      setProgress(100);

      // reset
      setFile(null);
      onUploadSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };



  // ================= DRAG DROP =================
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* CREATE FOLDER */}
      <div className="flex gap-2">
        <input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Folder name"
          className="px-3 py-2 rounded-lg bg-[#0b1f3a] border border-blue-700 text-sm"
        />

        <button
          onClick={handleCreateFolder}
          disabled={creatingFolder}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm"
        >
          {creatingFolder ? "Creating..." : "New Folder"}
        </button>
      </div>

      {/* DROP ZONE */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-blue-700/40 rounded-2xl p-6 text-center bg-[#0b1f3a]/50 backdrop-blur-xl hover:border-blue-500 transition"
      >
        <UploadCloud className="mx-auto h-8 w-8 text-blue-400 mb-2" />
        <p className="text-sm text-blue-200">
          Drag & drop file here or click to upload
        </p>

        <input
          type="file"
          className="hidden"
          id="fileInput"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <label
          htmlFor="fileInput"
          className="inline-block mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer text-sm"
        >
          Choose File
        </label>
      </div>

      {/* FILE PREVIEW */}
      {file && (
        <div className="flex items-center justify-between bg-[#0b1f3a]/60 border border-blue-800/30 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4 text-blue-300" />
            <span className="text-sm truncate max-w-[200px]">
              {file.name}
            </span>
          </div>

          <button
            onClick={() => setFile(null)}
            className="text-red-400 hover:text-red-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* PROGRESS */}
      {uploading && (
        <div className="w-full bg-blue-900/40 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* UPLOAD BUTTON */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`w-full py-2 rounded-lg font-medium transition ${
          uploading
            ? "bg-blue-400"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
}