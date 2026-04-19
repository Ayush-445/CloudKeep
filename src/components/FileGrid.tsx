"use client";

import FileIcon from "./FileIcon";
import FileActions from "./FileActions";

export default function FileGrid({
  files,
  onClick,
  ...actions
}: any) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

      {files.map((file: any) => (
        <div
          key={file.id}
          onClick={() => onClick(file)}
          className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 cursor-pointer transition"
        >
          <div className="flex justify-between items-start">
            <FileIcon file={file} />
            <FileActions 
              file={file} 
              onStar={actions.onStar}
              onTrash={actions.onTrash}
              onDelete={actions.onDelete}
              onDownload={actions.onDownload}
              />
          </div>

          <p className="text-sm mt-3 truncate">{file.name}</p>
        </div>
      ))}

    </div>
  );
}