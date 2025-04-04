import { useCallback } from 'react';
import { formatEther } from 'ethers';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractsConfig, BASE_SEPOLIA_CHAIN_ID } from '@/lib/constants/wagmiContractConfig/contracts';

/**
 * This hook provides the functionality to interact with the RewardController contract
 */
export const useRewardController = () => {
    const { address } = useAccount();

    const { data: rewardAmount, refetch: refetchRewardAmount } = useReadContract({
        ...contractsConfig.RewardController,
        functionName: 'calculateReward',
        args: [address],
        chainId: BASE_SEPOLIA_CHAIN_ID,
    });

    const { data: dailyAPR } = useReadContract({
        ...contractsConfig.RewardController,
        functionName: 'dailyAPR',
        chainId: BASE_SEPOLIA_CHAIN_ID,
    });

    const {
        writeContract: writeDistributeReward,
        data: distributeRewardHash,
        isPending: isDistributeRewardPending,
        error: distributeRewardError
    } = useWriteContract();

    const {
        isLoading: isDistributeRewardLoading,
        isSuccess: isDistributeRewardSuccess
    } = useWaitForTransactionReceipt({
        hash: distributeRewardHash,
    });

    const distributeReward = useCallback(() => {
        if (!address) return;

        writeDistributeReward({
            ...contractsConfig.RewardController,
            functionName: 'distributeReward',
            args: [address],
            chainId: BASE_SEPOLIA_CHAIN_ID,
        });
    }, [address, writeDistributeReward]);

    const formattedRewardAmount = rewardAmount && typeof rewardAmount === 'bigint'
        ? formatEther(rewardAmount)
        : '0';

    const formattedAPR = dailyAPR && typeof dailyAPR === 'bigint'
        ? (Number(dailyAPR) / 100).toFixed(2)
        : '0';

    return {
        rewardAmount: formattedRewardAmount,
        dailyAPR: formattedAPR,
        distributeReward,
        isDistributeRewardPending,
        isDistributeRewardLoading,
        isDistributeRewardSuccess,
        distributeRewardError,
        refetchRewardAmount,
    };
}; 