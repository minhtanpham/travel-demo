import Image from "next/image";

import { OnboardingForm } from "./OnboardingForm";

export const OnboardingLayout = () => {
  return (
    <div className="flex h-screen p-6">
      <div className="flex-1 h-full w-full relative rounded-xl overflow-hidden">
        <Image
          src="https://plus.unsplash.com/premium_photo-1677343210638-5d3ce6ddbf85?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=776"
          alt="Onboarding Form"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <OnboardingForm />
      </div>
    </div>
  );
};
