// Endereços dos contratos no Base Sepolia
export const CONTRACT_ADDRESSES = {
  CAMPAIGN_MANAGER: '0xE7c3e1C1F678cDfE8651556F28c396A38CC88E8D',
  PAYMENT_VAULT: '0xB457f5908dE044843C90aA1771D999dA8A9Bf3fD',
  ORACLE_CONNECTOR: '0x101De02821A2b148c49cd39d2182dB216C74DC5F',
  USDC: '0x0B971C4e62AB0eC19CaF3eBb0527e8A528fcAdD6',
} as const;

// Configuração da rede Base Sepolia
export const NETWORK_CONFIG = {
  chainId: 84532,
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
} as const; 