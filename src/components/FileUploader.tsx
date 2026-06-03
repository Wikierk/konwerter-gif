import { Upload } from "lucide-react";
import { useRef } from "react";

interface FileUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
}
const FileUploader: React.FC<FileUploaderProps> = ({
  selectedFile,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Wybierz plik wideo
      </h2>
      <div className="flex flex-col space-y-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-[#0B0F19] hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-sm"
        >
          <Upload className="w-5 h-5 mr-2" />
          Wybierz plik wideo...
        </button>
        <div className="bg-gray-100/80 rounded-xl p-3 border border-gray-200 text-gray-500 text-sm">
          {selectedFile ? selectedFile.name : "Nie wybrano pliku"}
        </div>
      </div>
    </div>
  );
};
export default FileUploader;
