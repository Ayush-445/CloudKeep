// "use client";

// import { useState } from "react";
// import { Camera, Save } from "lucide-react";

// interface UserProfileProps {
//   userName: string;
//   email?: string;
//   imageUrl?: string;
// }

// export default function UserProfile({
//   userName,
//   email,
//   imageUrl,
// }: UserProfileProps) {
//   const [name, setName] = useState(userName);
//   const [preview, setPreview] = useState<string | null>(imageUrl || null);
//   const [loading, setLoading] = useState(false);

//   // 🔹 Mock storage data (replace with API later)
//   const storageUsed = 2.4; // GB
//   const storageTotal = 10; // GB
//   const percentage = (storageUsed / storageTotal) * 100;

//   // 🔹 Avatar Upload
//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const url = URL.createObjectURL(file);
//     setPreview(url);

//     // TODO: upload to ImageKit
//   };

//   // 🔹 Save profile
//   const handleSave = async () => {
//     setLoading(true);

//     // TODO: API call
//     await new Promise((res) => setTimeout(res, 1000));

//     setLoading(false);
//     alert("Profile updated!");
//   };

//   return (
//     <div className="space-y-6">

//       {/* HEADER */}
//       <div>
//         <h2 className="text-2xl font-semibold">Profile</h2>
//         <p className="text-sm text-gray-400">
//           Manage your account settings
//         </p>
//       </div>

//       {/* PROFILE CARD */}
//       <div className="bg-[#0b1f3a]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">

//         {/* AVATAR */}
//         <div className="flex items-center gap-6">
//           <div className="relative">
//             <div className="h-20 w-20 rounded-full overflow-hidden bg-blue-500/20 flex items-center justify-center text-2xl font-semibold">
//               {preview ? (
//                 <img
//                   src={preview}
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 userName[0]
//               )}
//             </div>

//             <label className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full cursor-pointer">
//               <Camera className="h-3 w-3 text-white" />
//               <input
//                 type="file"
//                 className="hidden"
//                 onChange={handleAvatarChange}
//               />
//             </label>
//           </div>

//           <div>
//             <p className="font-medium">{name}</p>
//             <p className="text-sm text-gray-400">{email}</p>
//           </div>
//         </div>

//         {/* EDIT FORM */}
//         <div className="space-y-4">

//           <div>
//             <label className="text-sm text-gray-400">Name</label>
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-blue-500"
//             />
//           </div>

//           <button
//             onClick={handleSave}
//             className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white transition"
//           >
//             <Save className="h-4 w-4" />
//             {loading ? "Saving..." : "Save Changes"}
//           </button>

//         </div>
//       </div>

//       {/* STORAGE */}
//       <div className="bg-[#0b1f3a]/70 border border-white/10 rounded-2xl p-6">
//         <h3 className="font-semibold mb-4">Storage</h3>

//         <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
//           <div
//             className="h-full bg-blue-500 transition-all"
//             style={{ width: `${percentage}%` }}
//           />
//         </div>

//         <p className="text-sm text-gray-400 mt-2">
//           {storageUsed} GB of {storageTotal} GB used
//         </p>
//       </div>

//       {/* ACTIVITY */}
//       <div className="bg-[#0b1f3a]/70 border border-white/10 rounded-2xl p-6">
//         <h3 className="font-semibold mb-4">Recent Activity</h3>

//         <div className="space-y-3 text-sm text-gray-300">
//           <p>📁 Uploaded "resume.pdf"</p>
//           <p>⭐ Starred "design.png"</p>
//           <p>🗑️ Deleted "old_file.zip"</p>
//         </div>
//       </div>

//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { Camera, Save } from "lucide-react";

interface UserProfileProps {
  userName: string;
  email?: string;
  imageUrl?: string;
}

export default function UserProfile({
  userName,
  email,
  imageUrl,
}: UserProfileProps) {
  const [name, setName] = useState(userName);
  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const [loading, setLoading] = useState(false);

  const [storageUsed, setStorageUsed] = useState(0);
  const storageTotal = 10;

  // ================= STORAGE API =================
  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const res = await fetch("/api/storage");
        const data = await res.json();
        setStorageUsed(data.used || 0);
      } catch {
        setStorageUsed(2.4); // fallback
      }
    };

    fetchStorage();
  }, []);

  const percentage = (storageUsed / storageTotal) * 100;

  // ================= IMAGEKIT UPLOAD =================
  const uploadToImageKit = async (file: File) => {
    const auth = await fetch("/api/imagekit-auth").then((r) => r.json());

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

    const res = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    return await res.json();
  };

  // ================= AVATAR CHANGE =================
  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview instantly
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const uploaded = await uploadToImageKit(file);

      // store final url for save
      setPreview(uploaded.url);
      localStorage.setItem("avatarUrl", uploaded.url);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // ================= SAVE PROFILE =================
  const handleSave = async () => {
    setLoading(true);

    try {
      const avatarUrl = localStorage.getItem("avatarUrl");

      await fetch("/api/profile/update", {
        method: "POST",
        body: JSON.stringify({
          name,
          imageUrl: avatarUrl,
        }),
      });

      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="text-sm text-blue-200/70">
          Manage your account settings
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-[#0b1f3a]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">

        {/* AVATAR */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-blue-500/20 flex items-center justify-center text-2xl font-semibold">
              {preview ? (
                <img
                  src={preview}
                  className="h-full w-full object-cover"
                />
              ) : (
                userName[0]
              )}
            </div>

            <label className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full cursor-pointer">
              <Camera className="h-3 w-3 text-white" />
              <input
                type="file"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-400">{email}</p>
          </div>
        </div>

        {/* EDIT */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white transition"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* STORAGE */}
      <div className="bg-[#0b1f3a]/70 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Storage</h3>

        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-sm text-gray-400 mt-2">
          {storageUsed.toFixed(2)} MB of {storageTotal*1024} MB used
        </p>
      </div>

      {/* ACTIVITY */}
      <div className="bg-[#0b1f3a]/70 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>

        <div className="space-y-3 text-sm text-gray-300">
          <p>📁 Uploaded files</p>
          <p>⭐ Starred items</p>
          <p>🗑️ Deleted files</p>
        </div>
      </div>
    </div>
  );
}