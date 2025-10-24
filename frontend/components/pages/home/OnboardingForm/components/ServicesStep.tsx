import { Label } from "@/components/ui/label";

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

export const ServicesStep = () => {
  return (
    <div className="flex flex-col gap-6">
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
