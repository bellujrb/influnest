"use client";

import '@rainbow-me/rainbowkit/styles.css';

import { type ReactNode } from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { http } from 'wagmi';
import { defineChain } from 'viem';
import { CampaignProvider } from "./contexts/CampaignContext";

// Definir a rede Morph Holesky Testnet
const morphHolesky = defineChain({
  id: 2810,
  name: 'Morph Holesky',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-quicknode-holesky.morphl2.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Morph Holesky Explorer',
      url: 'https://explorer-holesky.morphl2.io',
    },
  },
  testnet: true,
});

// Configuração do Wagmi com RainbowKit
const config = getDefaultConfig({
  appName: 'InfluNest',
  projectId: 'YOUR_PROJECT_ID', // Substitua pelo seu Project ID do WalletConnect
  chains: [morphHolesky],
  transports: {
    [morphHolesky.id]: http('https://rpc-quicknode-holesky.morphl2.io'),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <CampaignProvider>
            {props.children}
          </CampaignProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
