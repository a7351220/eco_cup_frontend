import { useChainId } from 'wagmi';
import {
    contractsConfig,
    mainnetContractsConfig,
    CELO_ALFAJORES_CHAIN_ID,
    CELO_MAINNET_CHAIN_ID
} from '@/lib/constants/wagmiContractConfig/contracts';

/**
 * Get the appropriate contract configuration and chain ID based on the current network
 * @returns An object with the appropriate contracts config and chain ID
 */
export const useNetworkConfig = () => {
    const chainId = useChainId();

    // Use mainnet config if connected to Celo mainnet, otherwise use testnet config
    const isMainnet = chainId === CELO_MAINNET_CHAIN_ID;

    return {
        contracts: isMainnet ? mainnetContractsConfig : contractsConfig,
        chainId: isMainnet ? CELO_MAINNET_CHAIN_ID : CELO_ALFAJORES_CHAIN_ID,
        isMainnet
    };
}; 