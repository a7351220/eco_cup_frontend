import { useCallback } from 'react';
import { formatEther } from 'ethers';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useNetworkConfig } from '@/lib/utils/networkUtils';

/**
 * This hook provides the functionality to interact with the RewardController contract
 */
export const useRewardController = () => {
    const { address } = useAccount();
    const { contracts, chainId } = useNetworkConfig();

    const { data: rewardAmount, refetch: refetchRewardAmount } = useReadContract({
        ...contracts.RewardController,
        functionName: 'calculateReward',
        args: [address],
        chainId,
    });

    const { data: dailyAPR } = useReadContract({
        ...contracts.RewardController,
        functionName: 'dailyAPR',
        chainId,
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
            ...contracts.RewardController,
            functionName: 'distributeReward',
            args: [address],
            chainId,
        });
    }, [address, writeDistributeReward, contracts.RewardController, chainId]);

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