"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { TravelDetailsStep } from "./components/TravelDetailsStep";
import { ServicesStep } from "./components/ServicesStep";

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

export const OnboardingForm = () => {
  const [step, setStep] = useState(1);

  const { register, watch, setValue, handleSubmit } = useForm<FormData>({
    defaultValues: {
      destination: "",
      startDate: undefined,
      adults: 1,
      children: 0,
      numberOfDays: 1,
      includeRestaurant: false,
      includeVehicle: false,
      budgetRange: [500, 5000],
      selectedServices: [],
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // TODO: Call API function here
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Welcome to the Travel App</h1>
        <p className="text-muted-foreground">
          Step {step} of 2: {step === 1 ? "Travel Details" : "Available Services"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {step === 1 && (
          <TravelDetailsStep watch={watch} setValue={setValue} register={register} />
        )}

        {step === 2 && <ServicesStep />}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          {step < 2 ? (
            <Button type="button" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button type="submit">Complete</Button>
          )}
        </div>
      </form>
    </div>
  );
};
