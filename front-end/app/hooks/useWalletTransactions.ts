import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  type: 'incoming' | 'outgoing';
  amount: string;
  date: string;
  icon: 'star' | 'plus' | 'arrow-right';
}

// const client = createPublicClient({
//   chain: base,
//   transport: http(),
// });

export function useWalletTransactions() {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Buscar transações usando a API da Base
        const response = await fetch(`/api/transactions?address=${address}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
        // Fallback para transações mock se a API falhar
        setTransactions([
          {
            id: "1",
            hash: "0x123...abc",
            from: "0x1234...5678",
            to: address,
            value: "0.1",
            timestamp: Date.now() - 86400000, // 1 dia atrás
            type: 'incoming',
            amount: "+0.1",
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            icon: 'star'
          },
          {
            id: "2", 
            hash: "0x456...def",
            from: address,
            to: "0x8765...4321",
            value: "0.05",
            timestamp: Date.now() - 172800000, // 2 dias atrás
            type: 'outgoing',
            amount: "-0.05",
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
            icon: 'plus'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address, isConnected]);

  return {
    transactions,
    isLoading,
    error,
    isConnected
  };
} 