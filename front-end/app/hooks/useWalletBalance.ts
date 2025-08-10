import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { useState, useEffect } from "react";

export function useWalletBalance() {
  const { address, isConnected } = useAccount();
  const [usdValue, setUsdValue] = useState<number | null>(null);
  
  const { data: balanceData, isLoading, error } = useBalance({
    address,
  });

  const balance = balanceData ? parseFloat(formatEther(balanceData.value)) : 0;
  const formattedBalance = balance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });

  // Fetch USD value when balance changes
  useEffect(() => {
    if (isConnected) {
      // Using a simple estimation for ETH price (you can replace with real API)
      const estimatedUsdValue = balance * 2500; // Rough estimate
      setUsdValue(estimatedUsdValue);
    } else {
      setUsdValue(null);
    }
  }, [balance, isConnected]);

  return {
    balance,
    formattedBalance,
    usdValue,
    isLoading,
    error,
    isConnected
  };
} 