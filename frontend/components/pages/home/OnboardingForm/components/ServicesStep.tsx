import { useState, useEffect } from "react";

import { Label } from "@/components/ui/label";

import type { BudgetData } from "@/services";
import { BudgetSlider } from "./BudgetSlider";

interface ServicesStepProps {
  budgetData: BudgetData[] | null;
  travelers: number;
  numberOfDays: number;
}

export const ServicesStep = ({
  budgetData,
  travelers,
  numberOfDays,
}: ServicesStepProps) => {
  // Get budget options from API response
  const budgetOptions = budgetData || [];

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Update selected index when budget data changes
  useEffect(() => {
    if (budgetOptions.length > 0) {
      setSelectedIndex(0);
    }
  }, [budgetOptions]);

  // Handle slider value change
  const handleBudgetChange = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Budget Slider */}
      {budgetData && budgetOptions.length > 0 && (
        <div className="flex flex-col gap-6">
          <Label className="text-lg">Select Your Budget</Label>

          <BudgetSlider
            budgetOptions={budgetOptions}
            selectedIndex={selectedIndex}
            onValueChange={handleBudgetChange}
            travelers={travelers}
            numberOfDays={numberOfDays}
          />
        </div>
      )}
    </div>
  );
};
