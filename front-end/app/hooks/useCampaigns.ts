import { useReadContract, useAccount } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { formatEther, createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import CampaignManagerABI from '../../abi/CampaignManager.json';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '../config/contracts';

// Cliente público para leitura de contratos
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(NETWORK_CONFIG.rpcUrl),
});

export interface Campaign {
  id: string;
  brand: string;
  creator: string;
  totalValue: string;
  deadline: string;
  targetLikes: string;
  targetViews: string;
  currentLikes: string;
  currentViews: string;
  paidAmount: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
  progress: number;
  title: string;
  endDate: string;
}

// Type for campaign details from contract
type CampaignDetails = [
  string, // brand
  string, // creator
  bigint, // totalValue
  bigint, // deadline
  bigint, // targetLikes
  bigint, // targetViews
  bigint, // currentLikes
  bigint, // currentViews
  bigint, // paidAmount
  number  // status
];

export function useCampaigns() {
  const { isConnected } = useAccount();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ler o contador de campanhas
  const { data: campaignCounter } = useReadContract({
    address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER as `0x${string}`,
    abi: CampaignManagerABI.abi,
    functionName: 'campaignCounter',
  });

  // Função para converter status do enum para string
  const getStatusFromEnum = (status: number): Campaign['status'] => {
    switch (status) {
      case 0:
        return 'PENDING';
      case 1:
        return 'ACTIVE';
      case 2:
        return 'COMPLETED';
      case 3:
        return 'EXPIRED';
      case 4:
        return 'CANCELLED';
      default:
        return 'PENDING';
    }
  };

  // Função para calcular o progresso da campanha
  const calculateProgress = (currentLikes: bigint, currentViews: bigint, targetLikes: bigint, targetViews: bigint): number => {
    if (targetLikes === 0n && targetViews === 0n) return 0;
    
    const likesProgress = targetLikes > 0n ? Number(currentLikes * 100n / targetLikes) : 0;
    const viewsProgress = targetViews > 0n ? Number(currentViews * 100n / targetViews) : 0;
    
    // Retorna o maior progresso entre likes e views
    return Math.min(Math.max(likesProgress, viewsProgress), 100);
  };

  // Função para formatar endereço
  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Função para converter timestamp para data
  const formatDate = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toISOString().split('T')[0];
  };

  // Função para buscar detalhes de uma campanha
  const fetchCampaignDetails = useCallback(async (campaignId: number): Promise<Campaign | null> => {
    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER as `0x${string}`,
        abi: CampaignManagerABI.abi,
        functionName: 'getCampaignDetails',
        args: [BigInt(campaignId)],
      });

      if (!data) return null;

      const [
        brand,
        creator,
        totalValue,
        deadline,
        targetLikes,
        targetViews,
        currentLikes,
        currentViews,
        paidAmount,
        status
      ] = data as CampaignDetails;

      const progress = calculateProgress(currentLikes, currentViews, targetLikes, targetViews);
      const statusString = getStatusFromEnum(Number(status));

      return {
        id: campaignId.toString(),
        brand: formatAddress(brand),
        creator: formatAddress(creator),
        totalValue: formatEther(totalValue),
        deadline: deadline.toString(),
        targetLikes: targetLikes.toString(),
        targetViews: targetViews.toString(),
        currentLikes: currentLikes.toString(),
        currentViews: currentViews.toString(),
        paidAmount: formatEther(paidAmount),
        status: statusString,
        progress,
        title: `Campaign #${campaignId}`,
        endDate: formatDate(deadline),
      };
    } catch (err) {
      console.error(`Error fetching campaign ${campaignId}:`, err);
      return null;
    }
  }, []);

  // Função para buscar todas as campanhas
  const fetchAllCampaigns = useCallback(async () => {
    if (!isConnected || !campaignCounter) return;

    setLoading(true);
    setError(null);

    try {
      const totalCampaigns = Number(campaignCounter);
      const campaignPromises: Promise<Campaign | null>[] = [];

      // Buscar todas as campanhas existentes
      for (let i = 0; i < totalCampaigns; i++) {
        campaignPromises.push(fetchCampaignDetails(i));
      }

      const campaignResults = await Promise.all(campaignPromises);
      const validCampaigns = campaignResults.filter((campaign): campaign is Campaign => campaign !== null);

      setCampaigns(validCampaigns);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }, [isConnected, campaignCounter, fetchCampaignDetails]);

  // Buscar campanhas quando o contador mudar ou conectar wallet
  useEffect(() => {
    if (isConnected && campaignCounter) {
      fetchAllCampaigns();
    }
  }, [isConnected, campaignCounter, fetchAllCampaigns]);

  // Função para recarregar campanhas
  const refetch = () => {
    fetchAllCampaigns();
  };

  return {
    campaigns,
    loading,
    error,
    refetch,
    isConnected,
  };
} 