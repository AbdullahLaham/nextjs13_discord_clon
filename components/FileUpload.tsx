import "@uploadthing/react/styles.css";
 
import { UploadDropzone } from "@/lib/uploadthing"
import React from 'react'
import { X } from "lucide-react";
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
  return (
    <div className="">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          // Do something with the response
          onChange(res?.[0]?.url);
          alert("Upload Completed");
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