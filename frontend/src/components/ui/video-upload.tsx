"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { 
  UploadCloud, 
  FileVideo, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  Play, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  disabled?: boolean;
}

const ALLOWED_EXTENSIONS = [".mp4", ".mov", ".webm"];
const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function VideoUpload({ value, onChange, disabled }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file browser
  const handleChooseClick = () => {
    if (disabled || isUploading) return;
    setError(null);
    fileInputRef.current?.click();
  };

  // Validate selected file
  const validateFile = (file: File): string | null => {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) && !file.type.startsWith("video/")) {
      return `Invalid format (${ext || file.type}). Please select an MP4, MOV, or WEBM video file.`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return `File size (${sizeMB} MB) exceeds the 100MB maximum limit.`;
    }
    return null;
  };

  // Upload file using XMLHttpRequest for real-time progress
  const uploadFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.url) {
            onChange(response.url);
            setSuccessMessage("Video uploaded successfully!");
          } else {
            setError(response.error || "Upload succeeded but no URL was returned.");
          }
        } catch {
          setError("Failed to parse server response.");
        }
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          setError(response.error || `Upload failed with status code ${xhr.status}`);
        } catch {
          setError(`Upload failed with status ${xhr.status}`);
        }
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setError("Network error occurred while uploading video. Please try again.");
    };

    xhr.open("POST", "/api/upload-video", true);
    xhr.send(formData);
  };

  // File Input Change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    // Reset file input so user can pick same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  // Remove video handler
  const handleRemove = () => {
    onChange("");
    setError(null);
    setSuccessMessage(null);
    setProgress(0);
  };

  return (
    <div className="w-full space-y-3">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* STATE 1: Existing or Newly Uploaded Video Preview */}
      {value && !isUploading ? (
        <div className="relative group rounded-xl border border-pink-200 dark:border-pink-900/50 bg-slate-950 overflow-hidden shadow-md transition-all">
          <div className="aspect-video w-full relative bg-black flex items-center justify-center">
            <video
              src={value}
              controls
              className="w-full h-full object-contain max-h-[220px]"
            />
          </div>

          <div className="p-3 bg-slate-900/90 text-white flex items-center justify-between gap-2 text-xs border-t border-slate-800">
            <div className="flex items-center gap-2 truncate">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="truncate text-slate-200 font-medium">{value}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleChooseClick}
                disabled={disabled}
                className="h-8 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                className="h-8 px-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : isUploading ? (
        /* STATE 2: Upload in Progress */
        <div className="p-6 rounded-xl border-2 border-dashed border-pink-400 bg-pink-50/50 dark:bg-pink-950/20 flex flex-col items-center justify-center space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin" />
            <span className="absolute text-xs font-bold text-pink-700 dark:text-pink-300">
              {progress}%
            </span>
          </div>

          <div className="w-full max-w-md space-y-2 text-center">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Uploading video to Cloudinary...</span>
              <span>{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-600 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">Please wait while the video is processed.</p>
          </div>
        </div>
      ) : (
        /* STATE 3: Empty Dropzone / Select Video Button */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleChooseClick}
          className={`p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 ${
            isDragging
              ? "border-pink-500 bg-pink-100/60 dark:bg-pink-950/40 scale-[0.99]"
              : "border-slate-300 dark:border-slate-700 hover:border-pink-400 hover:bg-pink-50/40 dark:hover:bg-pink-950/10 bg-slate-50/50 dark:bg-slate-900/50"
          }`}
        >
          <div className="p-3.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
            <UploadCloud className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Click to choose video or drag & drop file here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Supports MP4, MOV, or WEBM (Max size: 100MB)
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleChooseClick();
            }}
            disabled={disabled}
            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-pink-500 text-slate-800 dark:text-slate-200 text-xs shadow-sm font-medium"
          >
            <FileVideo className="h-4 w-4 mr-1.5 text-pink-600" />
            Choose Video Button
          </Button>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && !isUploading && (
        <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleChooseClick}
            className="h-6 px-2 text-xs text-rose-700 hover:bg-rose-100 dark:text-rose-300 font-semibold"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
