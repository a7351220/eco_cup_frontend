import { useCallback } from 'react';
import { parseEther, formatEther } from 'ethers';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { contractsConfig, BASE_SEPOLIA_CHAIN_ID } from '@/lib/constants/wagmiContractConfig/contracts';

/**
 * This hook provides the functionality to interact with the StakingPool contract
 */
export const useStakingPool = () => {
    const { address } = useAccount();
    const { data: stakedAmount, refetch: refetchStakedAmount } = useReadContract({
        ...contractsConfig.StakingPool,
        functionName: 'getStakedAmount',
        args: [address],
        chainId: BASE_SEPOLIA_CHAIN_ID,
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
            ...contractsConfig.StakingPool,
            functionName: 'stake',
            chainId: BASE_SEPOLIA_CHAIN_ID,
            value: amountInWei,
        });
    }, [address, writeStake]);

    const withdraw = useCallback((amount: string) => {
        if (!address) return;

        const amountInWei = parseEther(amount);
        writeWithdraw({
            ...contractsConfig.StakingPool,
            functionName: 'withdraw',
            args: [amountInWei],
            chainId: BASE_SEPOLIA_CHAIN_ID,
        });
    }, [address, writeWithdraw]);

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