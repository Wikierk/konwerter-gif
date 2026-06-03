import { Loader2, CheckCircle } from "lucide-react";

interface ActionSectionProps {
  isConverting: boolean;
  progress: number;
  isSuccess: boolean;
  canGenerate: boolean;
  onGenerate: () => void;
}
const ActionSection: React.FC<ActionSectionProps> = ({
  isConverting,
  progress,
  isSuccess,
  canGenerate,
  onGenerate,
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col space-y-4">
    {isConverting && (
      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm font-medium text-gray-600">
          <span className="flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Przetwarzanie
            wideo...
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
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
        <CheckCircle className="w-5 h-5 mr-2" />
        <span>Konwersja zakończona sukcesem! Plik GIF jest gotowy.</span>
      </div>
    )}

    <button
      onClick={onGenerate}
      disabled={!canGenerate || isConverting}
      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
        !canGenerate || isConverting
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-[#767881] hover:bg-gray-600 text-white shadow-md hover:shadow-lg"
      }`}
    >
      {isConverting ? "Generowanie..." : "Generuj GIF"}
    </button>
  </div>
);
export default ActionSection;
