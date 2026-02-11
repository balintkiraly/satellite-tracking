export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <div className="w-full rounded-lg backdrop-blur-lg p-8 shadow-lg bg-gray-800/20">
        <div className="max-w-6xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold text-gray-200">
            Welcome to Satellite Tracker
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Track satellites in real-time and visualize their orbits around
            Earth.
          </p>
          <a
            href="/dashboard"
            className="inline-block rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            View Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
