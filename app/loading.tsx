export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated logo or spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/20 rounded-full animate-ping mx-auto"></div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900 animate-pulse">
            ნორჩი იტვირთება...
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            მომზადებულია იდეოლოგიური გამოწვევები თქვენთვის
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-64 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
