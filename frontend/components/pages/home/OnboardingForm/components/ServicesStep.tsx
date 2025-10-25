import { useState, useMemo, useEffect } from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/price";

import type { BudgetData } from "@/services";

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
  const minBudget = budgetOptions[0]?.totalBudget || 0;
  const maxBudget = budgetOptions[1]?.totalBudget || 0;

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Update selected index when budget data changes
  useEffect(() => {
    if (budgetOptions.length > 0) {
      setSelectedIndex(0);
    }
  }, [budgetOptions]);

  // Get the currently selected budget data
  const selectedBudgetData = budgetOptions[selectedIndex];
  const selectedBudget = selectedBudgetData?.totalBudget || 0;

  // Calculate per traveler cost
  const perTravelerCost = useMemo(() => {
    return travelers > 0 ? selectedBudget / travelers : 0;
  }, [selectedBudget, travelers]);

  // Handle slider value change - maps slider position to budget option index
  const handleBudgetChange = (value: number[]) => {
    setSelectedIndex(value[0]);
  };
  return (
    <div className="flex flex-col gap-6">
      {/* Budget Slider */}
      {budgetData && minBudget > 0 && maxBudget > 0 && (
        <div className="flex flex-col gap-6">
          <Label className="text-lg">Select Your Budget</Label>

          {/* Selected Budget Display */}
          <div className="flex flex-col items-center gap-2 p-6 rounded-lg border bg-card">
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(selectedBudget)}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(perTravelerCost)} / traveler
            </div>
            <div className="text-xs text-muted-foreground">
              {travelers} {travelers === 1 ? "traveler" : "travelers"},{" "}
              {numberOfDays} {numberOfDays === 1 ? "day" : "days"}
            </div>
          </div>

          {/* Budget Slider */}
          <div className="space-y-4 px-2">
            <Slider
              min={0}
              max={budgetOptions.length - 1}
              step={1}
              value={[selectedIndex]}
              onValueChange={handleBudgetChange}
              className="w-full"
            />

            {/* Min and Max Labels */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium">Minimum Budget</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(minBudget)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium">Maximum Budget</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(maxBudget)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
