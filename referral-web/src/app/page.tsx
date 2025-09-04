import ReferralsClient from "@/features/referrals/components";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ReferralsClient />
    </Suspense>
  );
}
