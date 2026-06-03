import { Play } from "lucide-react";

interface PreviewSectionProps {
  videoUrl: string | null;
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}
const PreviewSection: React.FC<PreviewSectionProps> = ({
  videoUrl,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-lg font-semibold mb-4 text-gray-800">
      Podgląd i ustawienia czasu
    </h2>

    <div className="w-full bg-black rounded-xl aspect-video mb-6 flex items-center justify-center overflow-hidden">
      {videoUrl ? (
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="text-gray-500 flex flex-col items-center">
          <Play className="w-16 h-16 mb-2 opacity-50" />
          <span className="text-sm">
            Wybierz plik wideo, aby zobaczyć podgląd
          </span>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Czas startu (HH:MM:SS)
        </label>
        <input
          type="text"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          placeholder="00:00:00"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Czas końca (HH:MM:SS)
        </label>
        <input
          type="text"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          placeholder="00:00:05"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50"
        />
      </div>
    </div>
  </div>
);
export default PreviewSection;
