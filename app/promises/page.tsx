import VideoCard from "./VideoCard";

export default function PromisesPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-800">
          Library + Object-Cover Demo
        </h1>
        <VideoCard title="გირჩის დაპირება #1" videoId="sfOxCDr4ZoI" />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Using react-lite-youtube-embed with object-cover iframe class
          </p>
        </div>
      </div>
    </div>
  );
}
