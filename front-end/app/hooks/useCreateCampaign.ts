import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import CampaignManagerABI from '../../abi/CampaignManager.json';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface CreateCampaignParams {
  totalValue: string; // ETH amount as string
  durationDays: string; // Days as string
  targetLikes: string; // Likes as string
  targetViews: string; // Views as string
}

interface CreateCampaignResult {
  success: boolean;
  campaignId?: string;
  error?: string;
  isLoading: boolean;
  isPending: boolean;
  hash?: string;
}

export function useCreateCampaign() {
  const { address, isConnected } = useAccount();
  const [result, setResult] = useState<CreateCampaignResult>({
    success: false,
    isLoading: false,
    isPending: false,
    hash: undefined,
  });

  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
    reset: resetWriteContract,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, error: transactionError, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  const createCampaign = async (params: CreateCampaignParams): Promise<CreateCampaignResult> => {
    if (!isConnected || !address) {
      return {
        success: false,
        error: 'Wallet not connected',
        isLoading: false,
        isPending: false,
        hash: undefined,
      };
    }

    try {
      setResult({
        success: false,
        isLoading: true,
        isPending: false,
      });

      // Validate inputs
      const totalValue = parseFloat(params.totalValue);
      const durationDays = parseInt(params.durationDays);
      const targetLikes = parseInt(params.targetLikes);
      const targetViews = parseInt(params.targetViews);

      if (isNaN(totalValue) || totalValue <= 0) {
        throw new Error('Invalid total value');
      }

      if (isNaN(durationDays) || durationDays <= 0 || durationDays > 365) {
        throw new Error('Invalid duration (must be between 1 and 365 days)');
      }

      if (isNaN(targetLikes) || targetLikes <= 0) {
        throw new Error('Invalid target likes');
      }

      if (isNaN(targetViews) || targetViews <= 0) {
        throw new Error('Invalid target views');
      }

      // Convert ETH to Wei
      const totalValueWei = parseEther(params.totalValue);

      // Call the contract
      writeContract({
        address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER as `0x${string}`,
        abi: CampaignManagerABI.abi,
        functionName: 'createCampaign',
        args: [
          address, // creator (influencer address)
          totalValueWei, // totalValue in Wei
          BigInt(durationDays), // durationDays
          BigInt(targetLikes), // targetLikes
          BigInt(targetViews), // targetViews
        ],
        value: totalValueWei, // Send ETH with the transaction
      });

      // Return immediately with pending state
      return {
        success: false,
        isLoading: true,
        isPending: true,
        hash: hash, // Use the current hash if available
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResult({
        success: false,
        error: errorMessage,
        isLoading: false,
        isPending: false,
      });
      return {
        success: false,
        error: errorMessage,
        isLoading: false,
        isPending: false,
        hash: undefined,
      };
    }
  };

  // Handle transaction status changes
  if (isSuccess && result.isPending) {
    // Try to extract campaign ID from logs
    let campaignId: string | undefined;
    if (receipt?.logs) {
      try {
        // Look for the CreateCampaign event
        const createCampaignEvent = receipt.logs.find(log => {
          // This is a simplified approach - in a real implementation you'd decode the event
          return log.topics[0] === '0x' + 'createCampaign'.padEnd(64, '0');
        });
        
        if (createCampaignEvent) {
          // Extract campaign ID from the event data
          // This is a simplified approach - you'd need to properly decode the event
          campaignId = '1'; // Placeholder - would be extracted from event data
        }
      } catch (error) {
        console.error('Error extracting campaign ID:', error);
      }
    }
    
    setResult({
      success: true,
      campaignId,
      isLoading: false,
      isPending: false,
      hash: hash,
    });
  }

  // Handle user rejection (wallet popup closed/cancelled)
  if (writeError && result.isPending) {
    let errorMessage = writeError.message;
    
    // Check for specific rejection errors
    if (writeError.message.includes('User rejected') || 
        writeError.message.includes('User denied') ||
        writeError.message.includes('User cancelled') ||
        writeError.message.includes('Base Tx Signature: User denied')) {
      errorMessage = 'Transaction was cancelled by user';
    }
    
    setResult({
      success: false,
      error: errorMessage,
      isLoading: false,
      isPending: false,
    });
  }

  if (transactionError && result.isPending) {
    setResult({
      success: false,
      error: transactionError.message,
      isLoading: false,
      isPending: false,
    });
  }

  const resetState = () => {
    setResult({
      success: false,
      isLoading: false,
      isPending: false,
      hash: undefined,
    });
    resetWriteContract();
  };

  return {
    createCampaign,
    resetState,
    result: {
      ...result,
      isLoading: result.isLoading || isConfirming,
      isPending: result.isPending || isPending,
      hash,
    },
    hash,
    isConnected,
  };
} 