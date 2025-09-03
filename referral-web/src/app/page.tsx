import ReferralsClient from "@/components/ReferralDashboard";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ReferralsClient />
    </Suspense>
  );
}
