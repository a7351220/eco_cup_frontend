import { useCallback } from 'react';
import { parseEther, formatEther } from 'ethers';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { useNetworkConfig } from '@/lib/utils/networkUtils';

/**
 * This hook provides the functionality to interact with the StakingPool contract
 */
export const useStakingPool = () => {
    const { address } = useAccount();
    const { contracts, chainId } = useNetworkConfig();

    const { data: stakedAmount, refetch: refetchStakedAmount } = useReadContract({
        ...contracts.StakingPool,
        functionName: 'getStakedAmount',
        args: [address],
        chainId,
    });

    const {
        writeContract: writeStake,
        data: stakeHash,
        isPending: isStakePending,
        error: stakeError
    } = useWriteContract();

    const {
        writeContract: writeWithdraw,
        data: withdrawHash,
        isPending: isWithdrawPending,
        error: withdrawError
    } = useWriteContract();

    const { isLoading: isStakeLoading, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({
        hash: stakeHash,
    });

    const { isLoading: isWithdrawLoading, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
        hash: withdrawHash,
    });

    const stake = useCallback((amount: string) => {
        if (!address) return;

        const amountInWei = parseEther(amount);
        writeStake({
            ...contracts.StakingPool,
            functionName: 'stake',
            chainId,
            value: amountInWei,
        });
    }, [address, writeStake, contracts.StakingPool, chainId]);

    const withdraw = useCallback((amount: string) => {
        if (!address) return;

        const amountInWei = parseEther(amount);
        writeWithdraw({
            ...contracts.StakingPool,
            functionName: 'withdraw',
            args: [amountInWei],
            chainId,
        });
    }, [address, writeWithdraw, contracts.StakingPool, chainId]);

    const formattedStakedAmount = stakedAmount && typeof stakedAmount === 'bigint'
        ? formatEther(stakedAmount)
        : '0';

    return {
        stakedAmount: formattedStakedAmount,
        stake,
        withdraw,
        isStakePending,
        isWithdrawPending,
        isStakeLoading,
        isWithdrawLoading,
        isStakeSuccess,
        isWithdrawSuccess,
        stakeError,
        withdrawError,
        refetchStakedAmount,
    };
}; 