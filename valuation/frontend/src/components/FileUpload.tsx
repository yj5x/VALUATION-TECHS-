import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import toast from "react-hot-toast";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes = ["application/pdf"],
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach((rejection) => {
        if (rejection.errors[0]?.code === "file-too-large") {
          toast.error("حجم الملف كبير جداً. الحد الأقصى 50 ميجابايت");
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          toast.error("نوع الملف غير مدعوم. يرجى رفع ملفات PDF فقط");
        }
      });
    }

    if (acceptedFiles.length > 0) {
      const newFiles = [...selectedFiles, ...acceptedFiles].slice(0, maxFiles);
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  }, [selectedFiles, maxFiles, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize,
    maxFiles: maxFiles - selectedFiles.length,
    multiple: true,
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className="file-upload">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "dragover" : ""}`}
      >
        <input {...getInputProps()} />
        <Upload size={48} className="upload-icon" />
        <p className="upload-text">
          {isDragActive
            ? "اسقط الملفات هنا..."
            : "اسحب وأفلت ملفات PDF هنا أو انقر للاختيار"}
        </p>
        <p className="upload-subtext">
          الحد الأقصى: {maxFiles} ملفات، حجم الملف: 50 ميجابايت
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="selected-files">
          <h4>الملفات المحددة:</h4>
          <div className="file-list">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <File size={16} />
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="remove-btn"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;


