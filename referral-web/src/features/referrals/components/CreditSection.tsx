import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CreditSectionProps } from '../types/types';

const CreditSection: React.FC<CreditSectionProps> = ({ 
  amount, 
  totalReferrals, 
  maxReferrals, 
  creditRedeemed,
  className 
}) => {
  const handleUseCredit = () => {
    // In a real app, this would navigate to checkout or credit usage page
    console.log('Use credit clicked');
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Credit amount card */}
      <Card className="p-6 bg-credit-bg border-none">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Ready to use:
          </div>
          
          <div className="text-4xl font-bold text-credit-text">
            ${amount.toFixed(2)}
          </div>
          
          <Button 
            onClick={handleUseCredit}
            className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium rounded-3xl"
          >
            Use credit
          </Button>
        </div>
      </Card>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="space-y-1 bg-muted p-4">
          <div className="text-sm">
            Total referrals this year
          </div>
          <div className="text-2xl font-bold text-foreground">
            {totalReferrals}/{maxReferrals}
          </div>
        </div>
        
        <div className="space-y-1 bg-muted p-4">
          <div className="text-sm">
            Credit redeemed
          </div>
          <div className="text-2xl font-bold text-foreground">
            ${creditRedeemed}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditSection;