import { useState, useEffect } from "react";
import ActionSection from "./components/ActionSection";
import FileUploader from "./components/FileUploader";
import Header from "./components/Header";
import PreviewSection from "./components/PreviewSection";
import SettingsSection from "./components/SettingsSection";

export default function App() {
  // Stany
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>("00:00:00");
  const [endTime, setEndTime] = useState<string>("00:00:05");
  const [fps, setFps] = useState<string>("15");
  const [resolution, setResolution] = useState<string>("Oryginalna");
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Czyszczenie pamięci po usunięciu komponentu
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  // Logika obsługi pliku
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setIsSuccess(false);
    setProgress(0);
  };

  // Logika generowania (Symulacja pod FFmpeg)
  const handleGenerate = () => {
    if (!selectedFile) return;
    setIsConverting(true);
    setProgress(0);
    setIsSuccess(false);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsConverting(false);
          setIsSuccess(true);
        }, 500);
      } else {
        setProgress(currentProgress);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 flex justify-center font-sans">
      <div className="w-full max-w-3xl space-y-6">
        <Header />

        <FileUploader
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
        />

        <PreviewSection
          videoUrl={videoUrl}
          startTime={startTime}
          endTime={endTime}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
        />

        <SettingsSection
          fps={fps}
          resolution={resolution}
          onFpsChange={setFps}
          onResolutionChange={setResolution}
        />

        <ActionSection
          isConverting={isConverting}
          progress={progress}
          isSuccess={isSuccess}
          canGenerate={selectedFile !== null}
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  );
}
