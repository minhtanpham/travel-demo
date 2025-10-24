import { Label } from "@/components/ui/label";
import type { BudgetData } from "@/services";

const services = [
  { id: "hotel", label: "Hotel Accommodation", icon: "🏨" },
  { id: "flight", label: "Flight Tickets", icon: "✈️" },
  { id: "car-rental", label: "Car Rental", icon: "🚗" },
  { id: "tour-guide", label: "Tour Guide", icon: "🗺️" },
  { id: "activities", label: "Activities & Excursions", icon: "🎯" },
  { id: "insurance", label: "Travel Insurance", icon: "🛡️" },
  { id: "restaurant", label: "Restaurant Reservations", icon: "🍽️" },
  { id: "spa", label: "Spa & Wellness", icon: "💆" },
  { id: "cruise", label: "Cruise Packages", icon: "🚢" },
  { id: "photography", label: "Photography Services", icon: "📸" },
  { id: "wifi", label: "Portable WiFi", icon: "📶" },
  { id: "translation", label: "Translation Services", icon: "🗣️" },
];

interface ServicesStepProps {
  budgetData: BudgetData[] | null;
}

export const ServicesStep = ({ budgetData }: ServicesStepProps) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Budget Display */}
      {budgetData && (
        <div className="flex flex-col gap-4">
          <Label className="text-lg">Budget Estimation</Label>
          <div className="grid grid-cols-2 gap-4">
            {budgetData.map((budget) => (
              <div
                key={budget.type}
                className="p-6 rounded-lg border bg-card space-y-3"
              >
                <h3 className="font-semibold text-lg capitalize">
                  {budget.type} Budget
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold">
                      ${budget.totalBudget.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Per Person:</span>
                    <span className="font-semibold">
                      ${budget.avgBudgetPerPerson.toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-2 border-t space-y-1">
                    <div className="text-sm text-muted-foreground">Breakdown:</div>
                    {budget.breakdown.stay > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Stay:</span>
                        <span>${budget.breakdown.stay.toFixed(2)}</span>
                      </div>
                    )}
                    {budget.breakdown.restaurant > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Restaurant:</span>
                        <span>${budget.breakdown.restaurant.toFixed(2)}</span>
                      </div>
                    )}
                    {budget.breakdown.vehicle > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Vehicle:</span>
                        <span>${budget.breakdown.vehicle.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Display */}
      <div className="flex flex-col gap-4">
        <Label className="text-lg">Available Services</Label>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center gap-3 p-4 rounded-lg border bg-card"
            >
              <span className="text-2xl">{service.icon}</span>
              <span className="text-sm font-medium">{service.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
