export const ViewToggle = ({
  viewMode,
  setViewMode,
}: {
  viewMode: "2d" | "3d";
  setViewMode: (mode: "2d" | "3d") => void;
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-1 p-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20">
      <button
        onClick={() => setViewMode("3d")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          viewMode === "3d"
            ? "bg-white/25 text-white"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        3D
      </button>
      <button
        onClick={() => setViewMode("2d")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          viewMode === "2d"
            ? "bg-white/25 text-white"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        2D
      </button>
    </div>
  );
};
