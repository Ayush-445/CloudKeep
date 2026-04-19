// "use client";

// import FileIcon from "./FileIcon";
// import FileActions from "./FileActions";
// import { formatDistanceToNow } from "date-fns";

// export default function FileListView({ files, onClick, ...actions }: any) {
//   return (
//     <div className="space-y-1">

//       {files.map((file: any) => (
//         <div
//           key={file.id}
//           onClick={() => onClick(file)}
//           className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-white/10 cursor-pointer"
//         >
//           <div className="flex items-center gap-3">
//             <FileIcon file={file} />
//             <span>{file.name}</span>
//           </div>

//           <div className="text-xs text-gray-400">
//             {formatDistanceToNow(new Date(file.createdAt))}
//           </div>

//           <FileActions file={file} {...actions} />
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import FileIcon from "./FileIcon";
import FileActions from "./FileActions";
import { formatDistanceToNow } from "date-fns";
import type { File as FileType } from "@/lib/db/schema";

interface FileListViewProps {
  files: FileType[];
  onClick: (file: FileType) => void;

  onStar: (id: string) => void;
  onTrash: (id: string) => void;
  onDelete: (file: FileType) => void;
  onDownload: (file: FileType) => void;
}

export default function FileListView({
  files,
  onClick,
  onStar,
  onTrash,
  onDelete,
  onDownload,
}: FileListViewProps) {
  return (
    <div className="space-y-1">
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => onClick(file)}
          className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-white/10 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <FileIcon file={file} />
            <span>{file.name}</span>
          </div>

          <div className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(file.createdAt))}
          </div>

          {/* ✅ PASS PROPS EXPLICITLY */}
          <FileActions
            file={file}
            onStar={onStar}
            onTrash={onTrash}
            onDelete={onDelete}
            onDownload={onDownload}
          />
        </div>
      ))}
    </div>
  );
}