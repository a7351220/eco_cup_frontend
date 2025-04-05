import '@rainbow-me/rainbowkit/styles.css';
import { http, fallback } from 'wagmi';
import { arbitrum, base, celoAlfajores, mainnet, sepolia, celo, type Chain } from 'wagmi/chains';
import { getDefaultConfig, WalletList } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  coin98Wallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  okxWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  trustWallet,
  uniswapWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

/**
 * Base Sepolia testnet configuration
 * @description Base Sepolia testnet
 */
export const baseSepolia: Chain = {
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
};

/**
 * WalletConnect Project ID
 * @description Required for all dApps using WalletConnect. Get your free projectId at
 * @see https://cloud.walletconnect.com/sign-in
 */
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || '';

/**
 * RPC Configuration
 * @description Default RPC endpoints with fallbacks
 */
const RPC_URLS = {
  MAINNET: [
    mainnet.rpcUrls.default.http[0], // Default RPC
    'https://rpc.ankr.com/eth', // Ankr
    'https://eth.llamarpc.com', // Llama
  ],
  ARBITRUM: [
    arbitrum.rpcUrls.default.http[0], // Default RPC
    'https://rpc.ankr.com/arbitrum', // Ankr
    'https://arbitrum.llamarpc.com', // Llama
  ],
  BASE: [
    base.rpcUrls.default.http[0], // Default RPC
    'https://base-rpc.publicnode.com', // Public Node
    'https://base.llamarpc.com', // Llama
  ],
  BASE_SEPOLIA: [
    'https://sepolia.base.org', // Official Base Sepolia RPC
  ],
  CELO_ALFAJORES: [
    'https://alfajores-forno.celo-testnet.org', // Official Celo Alfajores RPC
  ],
  CELO_MAINNET: [
    'https://forno.celo.org', // Official Celo Mainnet RPC
    'https://rpc.ankr.com/celo', // Ankr
  ],
} as const;

/**
 * Transport Configuration
 * @description Fallback configuration for RPC endpoints
 */
const transports = {
  [mainnet.id]: fallback(RPC_URLS.MAINNET.map((url) => http(url))),
  [arbitrum.id]: fallback(RPC_URLS.ARBITRUM.map((url) => http(url))),
  [base.id]: fallback(RPC_URLS.BASE.map((url) => http(url))),
  [baseSepolia.id]: fallback(RPC_URLS.BASE_SEPOLIA.map((url) => http(url))),
  [celoAlfajores.id]: fallback(RPC_URLS.CELO_ALFAJORES.map((url) => http(url))),
  [celo.id]: fallback(RPC_URLS.CELO_MAINNET.map((url) => http(url))),
};

//const { wallets } = getDefaultWallets();
const wallets: WalletList = [
  //...getDefaultWallets().wallets,
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet,
      rainbowWallet,
      rabbyWallet,
      walletConnectWallet,
    ],
  },
  {
    groupName: 'Other Wallets',
    wallets: [
      injectedWallet,
      okxWallet,
    ],
  },
];

export const wagmiConfig = getDefaultConfig({
  appName: 'CupFi',
  projectId: projectId,
  wallets: wallets,
  chains: [
    celo, // Celo Mainnet (primary)
    celoAlfajores, // Celo Alfajores testnet
    baseSepolia, // Base Sepolia testnet
    mainnet,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  transports,
  ssr: true, // If your dApp uses server side rendering (SSR)
});
