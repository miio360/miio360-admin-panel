export function PlanCardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <span className="text-2xl text-gray-400">-</span>
      </div>
      <p className="text-foreground/60 font-medium">No hay planes creados</p>
    </div>
  );
}
