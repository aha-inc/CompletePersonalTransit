"use client";
import { useRouter } from "next/navigation";
import { OnboardingWizard } from "@/components/profile/OnboardingWizard";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white flex items-start justify-center pt-12 pb-16 px-4">
      <div className="w-full max-w-md space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Let&apos;s personalize your experience</h1>
          <p className="text-sm text-gray-500 mt-1">
            Takes about 2 minutes. You can change anything later.
          </p>
        </header>

        <OnboardingWizard onComplete={() => router.push("/trip")} />
      </div>
    </main>
  );
}
