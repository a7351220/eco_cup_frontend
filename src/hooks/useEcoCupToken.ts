import { formatEther } from 'ethers';
import { useAccount, useReadContract } from 'wagmi';
import { useNetworkConfig } from '@/lib/utils/networkUtils';

/**
 * This hook provides the balance of the EcoCupToken contract
 */
export const useEcoCupToken = () => {
    const { address } = useAccount();
    const { contracts, chainId } = useNetworkConfig();

    const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
        ...contracts.EcoCupToken,
        functionName: 'balanceOf',
        args: [address],
        chainId,
    });

    const formattedBalance = tokenBalance && typeof tokenBalance === 'bigint'
        ? formatEther(tokenBalance)
        : '0';

    return {
        tokenBalance: formattedBalance,
        refetchBalance,
    };
}; 