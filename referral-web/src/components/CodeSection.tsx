"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CodeSectionProps {
  code: string;
  className?: string;
}

export default function CodeSection({ code, className }: CodeSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      // reset after 2s
      const t = setTimeout(() => setCopied(false), 2000);
      // avoid state update after unmount
      return () => clearTimeout(t);
    } catch {
      // ignore; could add an inline error if you want
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label htmlFor="referral-code" className="text-sm mb-6 font-medium text-muted-foreground">
        Your Unique Code
      </Label>

      <div className="relative mt-4">
        <Input
          id="referral-code"
          value={code}
          readOnly
          className="pr-12 text-center font-mono tracking-wider text-muted-foreground md:text-xl sm:text-xl h-12"
        />


        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted cursor-pointer"
          aria-label="Copy referral code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Small inline feedback; remove if you add a toast later */}
      {copied && (
        <p className="text-sm text-emerald-700" role="status" aria-live="polite">
          Code copied!
        </p>
      )}
    </div>
  );
}
