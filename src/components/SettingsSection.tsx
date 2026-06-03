interface SettingsSectionProps {
  fps: string;
  resolution: string;
  onFpsChange: (fps: string) => void;
  onResolutionChange: (res: string) => void;
}
const SettingsSection: React.FC<SettingsSectionProps> = ({
  fps,
  resolution,
  onFpsChange,
  onResolutionChange,
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-lg font-semibold mb-4 text-gray-800">
      Ustawienia konwersji
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          FPS
        </label>
        <select
          value={fps}
          onChange={(e) => onFpsChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
        >
          <option value="10">10 FPS (Bardzo lekki)</option>
          <option value="15">15 FPS (Standard)</option>
          <option value="24">24 FPS (Filmowy)</option>
          <option value="30">30 FPS (Płynny)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Rozdzielczość
        </label>
        <select
          value={resolution}
          onChange={(e) => onResolutionChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
        >
          <option value="Oryginalna">Oryginalna (Z wideo)</option>
          <option value="480p">Mała (480px)</option>
          <option value="720p">Średnia (720px)</option>
        </select>
      </div>
    </div>
  </div>
);
export default SettingsSection;
