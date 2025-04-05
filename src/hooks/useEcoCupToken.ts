import { formatEther } from 'ethers';
import { useAccount, useReadContract } from 'wagmi';
import { contractsConfig, CELO_ALFAJORES_CHAIN_ID } from '@/lib/constants/wagmiContractConfig/contracts';

/**
 * This hook provides the balance of the EcoCupToken contract
 */
export const useEcoCupToken = () => {
    const { address } = useAccount();
    const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
        ...contractsConfig.EcoCupToken,
        functionName: 'balanceOf',
        args: [address],
        chainId: CELO_ALFAJORES_CHAIN_ID,
    });

    const formattedBalance = tokenBalance && typeof tokenBalance === 'bigint'
        ? formatEther(tokenBalance)
        : '0';

    return {
        tokenBalance: formattedBalance,
        refetchBalance,
    };
}; 