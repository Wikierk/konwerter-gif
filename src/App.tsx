import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { Loader2, CheckCircle, Download } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import FileUploader from "./components/FileUploader";
import Header from "./components/Header";
import PreviewSection from "./components/PreviewSection";
import SettingsSection from "./components/SettingsSection";

const toLabel = (t: string): string => {
  const [h, m, s] = t.split(":").map(Number);
  const total = h * 3600 + m * 60 + s;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}m${String(total % 60).padStart(2, "0")}s`;
};

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>("00:00:00");
  const [endTime, setEndTime] = useState<string>("00:00:05");
  const [fps, setFps] = useState<string>("15");
  const [resolution, setResolution] = useState<string>("-1");
  const [gifFilename, setGifFilename] = useState("animacja.gif");

  const [isLoaded, setIsLoaded] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  const ffmpegRef = useRef(new FFmpeg());
  const passRef = useRef<number>(0);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      const ffmpeg = ffmpegRef.current;

      ffmpeg.on("progress", ({ progress }) => {
        let percent = Math.round(progress * 100);
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        if (Number.isNaN(percent)) percent = 0;

        const offset = passRef.current === 2 ? 50 : 0;
        setProgress(Math.min(100, offset + Math.round(percent / 2)));
      });

      try {
        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            "text/javascript",
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm",
          ),
        });
        setIsLoaded(true);
      } catch (error) {
        console.error(
          "Błąd ładowania FFmpeg. Upewnij się, że serwer używa nagłówków COOP i COEP.",
          error,
        );
      }
    };

    loadFFmpeg();

    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (gifUrl) URL.revokeObjectURL(gifUrl);
    };
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setIsSuccess(false);
    setProgress(0);
    setGifUrl(null);
  };

  const handleGenerate = async () => {
    if (!selectedFile || !isLoaded) return;

    setIsConverting(true);
    setProgress(0);
    setIsSuccess(false);

    const ffmpeg = ffmpegRef.current;

    try {
      for (const name of ["input.mp4", "palette.png", "output.gif"]) {
        try {
          await ffmpeg.deleteFile(name);
        } catch {}
      }

      await ffmpeg.writeFile("input.mp4", await fetchFile(selectedFile));

      const numericRes = parseInt(resolution, 10);
      const scaleFilter =
        numericRes > 0 ? `,scale=${numericRes}:-1:flags=lanczos` : "";
      console.log(
        `[Debug] resolution="${resolution}" → scaleFilter="${scaleFilter}"`,
      );

      passRef.current = 1;
      await ffmpeg.exec([
        "-y",
        "-ss",
        startTime,
        "-to",
        endTime,
        "-i",
        "input.mp4",
        "-vf",
        `fps=${fps}${scaleFilter},palettegen`,
        "palette.png",
      ]);

      setProgress(50);

      passRef.current = 2;
      await ffmpeg.exec([
        "-y",
        "-ss",
        startTime,
        "-to",
        endTime,
        "-i",
        "input.mp4",
        "-i",
        "palette.png",
        "-filter_complex",
        `[0:v]fps=${fps}${scaleFilter}[x];[x][1:v]paletteuse`,
        "output.gif",
      ]);

      passRef.current = 0;

      const data = await ffmpeg.readFile("output.gif");
      const safeData = (data as Uint8Array).slice(0);

      const url = URL.createObjectURL(
        new Blob([safeData], { type: "image/gif" }),
      );
      setGifUrl(url);
      setIsSuccess(true);

      const link = document.createElement("a");
      link.href = url;
      const filename = `animacja_${toLabel(startTime)}-${toLabel(endTime)}.gif`;
      setGifFilename(filename);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Błąd podczas konwersji:", error);
      alert(
        `Błąd konwersji: ${error instanceof Error ? error.message : "Sprawdź formaty czasu."}`,
      );
    } finally {
      passRef.current = 0;
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 flex justify-center font-sans">
      <div className="w-full max-w-3xl space-y-6">
        <Header />

        {!isLoaded && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl flex items-center justify-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Trwa ładowanie silnika FFmpeg (WebAssembly)...
          </div>
        )}

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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col space-y-4">
          {isConverting && (
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Przetwarzanie klatek wideo...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Konwersja zakończona! Plik jest pobierany.</span>
              </div>
              {gifUrl && (
                <a
                  href={gifUrl}
                  download={gifFilename}
                  className="text-sm font-semibold underline flex items-center hover:text-green-800"
                >
                  <Download className="w-4 h-4 mr-1" /> Pobierz ponownie
                </a>
              )}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!selectedFile || isConverting || !isLoaded}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
              !selectedFile || isConverting || !isLoaded
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#767881] hover:bg-gray-600 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isConverting ? "Trwa generowanie GIF..." : "Generuj plik GIF"}
          </button>
        </div>
      </div>
    </div>
  );
}
