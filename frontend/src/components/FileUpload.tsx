import { useRef, useState, type DragEvent } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  uploading?: boolean;
}

const ACCEPTED_EXTENSIONS = '.txt,.md,.pdf';

export default function FileUpload({
  onFileSelect,
  disabled,
  uploading,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file) return;
    onFileSelect(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <div
      className={`file-upload-area ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={(e) => handleFile(e.target.files?.[0])}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      {uploading ? (
        <span className="upload-status">
          <span className="spinner" /> Analyzing document...
        </span>
      ) : (
        <span className="upload-label">
          📎 Drop a file here or click to upload (.txt, .md, .pdf)
        </span>
      )}
    </div>
  );
}
