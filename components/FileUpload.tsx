import "@uploadthing/react/styles.css";
 
import { UploadDropzone } from "@/lib/uploadthing"
import React from 'react'
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
    onChange: (url?: string) => void,
    value: string,
    endpoint: "messageFile" | "serverImage",
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange, value, endpoint }) => {
    const fileType = value.split(".").pop();
    if (value && fileType !== 'pdf') {
        return (
        <div className="flex items-center justify-center w-full">
            <div className="h-[10rem] w-[10rem] relative ">
                <Image fill src={value} alt={'Upload'} className="rounded-full object-cover" /> 
                <button type="button" onClick={() => onChange("")} className="bg-rose-500 text-white p-1 rounded-full flex items-center justify-center absolute top-0 right-0 shadow-sm"><X className="h-4 w-4" /></button>
            </div>
        </div>
        )
    }
    if (value && fileType === 'pdf') {
      return (
        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 ">
          <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
          <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">{value}</a>
          <button type="button" onClick={() => onChange("")} className="bg-rose-500 text-white p-1 rounded-full flex items-center justify-center absolute -top-2 -right-2 shadow-sm"><X className="h-4 w-4" /></button>
        </div>
      )
    }
  return (
    <div className="">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          // Do something with the response
          onChange(res?.[0]?.url);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          console.log(`ERROR! ${error.message}`);
        }}
      /> 

    </div>
  )
}

export default FileUpload