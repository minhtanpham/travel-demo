import { useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { NumberSelector } from "./NumberSelector";

const destinations = [
  { value: "paris", label: "Paris, France" },
  { value: "tokyo", label: "Tokyo, Japan" },
  { value: "new-york", label: "New York, USA" },
  { value: "london", label: "London, UK" },
  { value: "barcelona", label: "Barcelona, Spain" },
  { value: "rome", label: "Rome, Italy" },
  { value: "dubai", label: "Dubai, UAE" },
  { value: "bali", label: "Bali, Indonesia" },
  { value: "singapore", label: "Singapore" },
  { value: "bangkok", label: "Bangkok, Thailand" },
  { value: "sydney", label: "Sydney, Australia" },
  { value: "istanbul", label: "Istanbul, Turkey" },
  { value: "amsterdam", label: "Amsterdam, Netherlands" },
  { value: "prague", label: "Prague, Czech Republic" },
  { value: "lisbon", label: "Lisbon, Portugal" },
  { value: "seoul", label: "Seoul, South Korea" },
  { value: "hong-kong", label: "Hong Kong" },
  { value: "venice", label: "Venice, Italy" },
  { value: "santorini", label: "Santorini, Greece" },
  { value: "maldives", label: "Maldives" },
];

type FormData = {
  destination: string;
  startDate: Date | undefined;
  adults: number;
  children: number;
  numberOfDays: number;
  includeRestaurant: boolean;
  includeVehicle: boolean;
  budgetRange: number[];
  selectedServices: string[];
};

interface TravelDetailsStepProps {
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  register: any;
}

export const TravelDetailsStep = ({
  watch,
  setValue,
  register,
}: TravelDetailsStepProps) => {
  const [openDestination, setOpenDestination] = useState(false);
  const formValues = watch();

  const incrementValue = (field: "adults" | "children") => {
    setValue(field, formValues[field] + 1);
  };

  const decrementValue = (field: "adults" | "children") => {
    if (formValues[field] > 0) {
      setValue(field, formValues[field] - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Destination Combobox */}
      <div className="flex flex-col gap-2">
        <Label>Destination</Label>
        <Popover open={openDestination} onOpenChange={setOpenDestination}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openDestination}
              className="justify-between"
            >
              {formValues.destination
                ? destinations.find(
                    (dest) => dest.value === formValues.destination
                  )?.label
                : "Select destination..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search destination..." />
              <CommandList>
                <CommandEmpty>No destination found.</CommandEmpty>
                <CommandGroup>
                  {destinations.map((dest) => (
                    <CommandItem
                      key={dest.value}
                      value={dest.value}
                      onSelect={(currentValue) => {
                        setValue(
                          "destination",
                          currentValue === formValues.destination
                            ? ""
                            : currentValue
                        );
                        setOpenDestination(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formValues.destination === dest.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {dest.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Start Date */}
      <div className="flex flex-col gap-2">
        <Label>Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !formValues.startDate && "text-muted-foreground"
              )}
            >
              {formValues.startDate ? (
                format(formValues.startDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formValues.startDate}
              onSelect={(date) => setValue("startDate", date)}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Adults */}
      <NumberSelector
        label="Number of Adults"
        value={formValues.adults}
        onIncrement={() => incrementValue("adults")}
        onDecrement={() => decrementValue("adults")}
        min={0}
        tooltip="> 16 years"
      />

      {/* Children */}
      <NumberSelector
        label="Number of Children"
        value={formValues.children}
        onIncrement={() => incrementValue("children")}
        onDecrement={() => decrementValue("children")}
        min={0}
        tooltip="0-15 years"
      />

      {/* Number of Days */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="numberOfDays">Number of Days</Label>
        <Input
          id="numberOfDays"
          type="number"
          min="1"
          {...register("numberOfDays", { valueAsNumber: true })}
        />
      </div>

      {/* Restaurant Option */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label>Include Restaurant Reservations</Label>
          <p className="text-sm text-muted-foreground">
            Get recommendations and reservations at local restaurants
          </p>
        </div>
        <Switch
          checked={formValues.includeRestaurant}
          onCheckedChange={(checked) => setValue("includeRestaurant", checked)}
        />
      </div>

      {/* Vehicle Option */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label>Include Vehicle Rental</Label>
          <p className="text-sm text-muted-foreground">
            Rent a vehicle for easy transportation during your trip
          </p>
        </div>
        <Switch
          checked={formValues.includeVehicle}
          onCheckedChange={(checked) => setValue("includeVehicle", checked)}
        />
      </div>
    </div>
  );
};
