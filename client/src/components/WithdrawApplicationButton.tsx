import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToastContext } from "@/components/ui/toast-provider";
import ApplicationService from "@/services/application.service";

interface WithdrawApplicationButtonProps {
  applicationId: string;
  onWithdraw: () => void;
  disabled?: boolean;
}

const WithdrawApplicationButton: React.FC<WithdrawApplicationButtonProps> = ({
  applicationId,
  onWithdraw,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToastContext();

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      const applicationService = ApplicationService.getInstance();
      await applicationService.withdrawApplication(applicationId);
      
      toast({
        title: "Success",
        description: "Application withdrawn successfully",
      });
      
      onWithdraw();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to withdraw application",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleWithdraw}
      disabled={disabled || isLoading}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      {isLoading ? "Withdrawing..." : "Withdraw Application"}
    </Button>
  );
};

export default WithdrawApplicationButton; 