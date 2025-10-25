import { useState, useRef, useEffect } from "react";
import { formatCurrency } from "@/lib/price";
import type { BudgetData } from "@/services";

interface BudgetSliderProps {
  budgetOptions: BudgetData[];
  selectedIndex: number;
  onValueChange: (index: number) => void;
  travelers: number;
  numberOfDays: number;
}

export const BudgetSlider = ({
  budgetOptions,
  selectedIndex,
  onValueChange,
  travelers,
  numberOfDays,
}: BudgetSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!budgetOptions || budgetOptions.length === 0) {
    return null;
  }

  const selectedBudget = budgetOptions[selectedIndex];
  const minBudget = budgetOptions[0]?.totalBudget || 0;
  const maxBudget = budgetOptions[budgetOptions.length - 1]?.totalBudget || 0;
  const perTravelerCost = travelers > 0 ? selectedBudget?.totalBudget / travelers : 0;

  // Calculate position percentage
  const positionPercent = budgetOptions.length > 1
    ? (selectedIndex / (budgetOptions.length - 1)) * 100
    : 0;

  // Get tier label based on number of options
  const getTierLabel = (index: number) => {
    if (budgetOptions.length === 2) {
      return index === 0 ? "$$" : "$$$$";
    } else if (budgetOptions.length === 3) {
      return ["$$", "$$$", "$$$$"][index];
    } else if (budgetOptions.length === 4) {
      return ["$$", "$$$", "$$$", "$$$$"][index];
    } else {
      // For more options, distribute $ symbols
      const ratio = index / (budgetOptions.length - 1);
      if (ratio <= 0.33) return "$$";
      if (ratio <= 0.66) return "$$$";
      return "$$$$";
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));

    // Find closest step
    const step = (100 / (budgetOptions.length - 1));
    const closestIndex = Math.round(percent / step);
    onValueChange(Math.max(0, Math.min(budgetOptions.length - 1, closestIndex)));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;
    handleClick(e);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Tooltip */}
      <div className="relative h-24">
        <div
          className="absolute top-0 transform -translate-x-1/2 transition-all duration-200"
          style={{ left: `${positionPercent}%` }}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-2 min-w-[200px]">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(selectedBudget?.totalBudget || 0)}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              {formatCurrency(perTravelerCost)} / traveler
            </div>
            <div className="text-xs text-gray-500">
              {travelers} traveler{travelers !== 1 ? 's' : ''}, {numberOfDays} day{numberOfDays !== 1 ? 's' : ''}
            </div>
          </div>
          {/* Tooltip arrow */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-3 w-0 h-0 border-l-[9px] border-r-[9px] border-t-[9px] border-l-transparent border-r-transparent border-t-gray-200 -z-10"></div>
        </div>
      </div>

      {/* Slider Track */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleClick}
          onMouseMove={handleMouseMove}
        >
          {/* Progress bar */}
          <div
            className="absolute h-full bg-primary rounded-full transition-all duration-200"
            style={{ width: `${positionPercent}%` }}
          />

          {/* Stage markers */}
          {budgetOptions.map((_, index) => {
            const percent = budgetOptions.length > 1
              ? (index / (budgetOptions.length - 1)) * 100
              : 0;

            return (
              <div
                key={index}
                className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${percent}%` }}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    index === selectedIndex
                      ? 'bg-primary border-primary scale-125'
                      : index < selectedIndex
                      ? 'bg-primary border-primary'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            );
          })}

          {/* Draggable thumb */}
          <div
            className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10"
            style={{ left: `${positionPercent}%` }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <div className={`w-6 h-6 rounded-full bg-primary border-4 border-white shadow-lg transition-transform ${
              isDragging ? 'scale-110' : 'hover:scale-110'
            }`} />
          </div>
        </div>

        {/* Tier labels ($$, $$$, $$$$) */}
        <div className="relative mt-3">
          {budgetOptions.map((_, index) => {
            const percent = budgetOptions.length > 1
              ? (index / (budgetOptions.length - 1)) * 100
              : 0;

            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${percent}%` }}
              >
                <div className="text-sm font-medium text-gray-500">
                  {getTierLabel(index)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Min and Max price labels */}
        <div className="flex justify-between mt-8 text-sm text-gray-600">
          <div>USD {formatCurrency(minBudget).replace('$', '')}</div>
          <div>USD {formatCurrency(maxBudget).replace('$', '')}</div>
        </div>
      </div>
    </div>
  );
};
