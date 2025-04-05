import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { useEffect, useState } from 'react';
import { useNetworkConfig } from '@/lib/utils/networkUtils';

/**
 * This hook provides the functionality to interact with the VerificationRegistry contract
 */
export const useVerificationRegistry = () => {
    const { address } = useAccount();
    const { contracts, chainId } = useNetworkConfig();
    const [localVerificationCount, setLocalVerificationCount] = useState<number>(0);

    const { data: verificationCount, refetch: refetchVerificationCount } = useReadContract({
        abi: contracts.VerificationRegistry.abi,
        address: contracts.VerificationRegistry.address as `0x${string}`,
        functionName: 'getVerificationCount',
        args: [address],
        chainId,
    });

    const { data: canClaimReward, refetch: refetchCanClaimReward } = useReadContract({
        abi: contracts.VerificationRegistry.abi,
        address: contracts.VerificationRegistry.address as `0x${string}`,
        functionName: 'canClaimReward',
        args: [address],
        chainId,
    });

    const { data: userVerifications, refetch: refetchUserVerifications } = useReadContract({
        abi: contracts.VerificationRegistry.abi,
        address: contracts.VerificationRegistry.address as `0x${string}`,
        functionName: 'userVerifications',
        args: [address],
        chainId,
    });

    useEffect(() => {
        if (userVerifications && Array.isArray(userVerifications)) {
            const processedData = processUserVerifications();
            setLocalVerificationCount(processedData.count);
        }
    }, [userVerifications]);

    useWatchContractEvent({
        address: contracts.VerificationRegistry.address as `0x${string}`,
        abi: contracts.VerificationRegistry.abi,
        eventName: 'VerificationRecorded',
        onLogs: (logs) => {
            const userEvents = logs.filter(log => {
                try {
                    // @ts-ignore: auto type inference may be wrong, but we know the event structure
                    const eventUser = log.args?.user?.toLowerCase();
                    const isMatch = address && eventUser === address.toLowerCase();
                    return isMatch;
                } catch (err) {
                    console.error('Error filtering events:', err);
                    return false;
                }
            });

            if (userEvents.length > 0) {
                const latestEvent = userEvents[userEvents.length - 1];
                try {
                    // @ts-ignore: auto type inference may be wrong, but we know the event structure
                    const count = Number(latestEvent.args?.count || 0);
                    setLocalVerificationCount(count);

                    setTimeout(() => {
                        refetchVerificationCount();
                        refetchCanClaimReward();
                        refetchUserVerifications();
                    }, 1000);
                } catch (err) {
                    console.error('Error extracting count from event:', err);
                }
            }
        },
        chainId,
    });

    useEffect(() => {
        if (address) {
            refetchVerificationCount();
            refetchCanClaimReward();
            refetchUserVerifications();
        }
    }, [address, refetchVerificationCount, refetchCanClaimReward, refetchUserVerifications]);

    const processUserVerifications = () => {
        if (!userVerifications || !Array.isArray(userVerifications)) {
            return { date: 0, count: 0, rewardClaimed: false };
        }

        try {
            const result = {
                date: Number(userVerifications[0] || 0),
                count: Number(userVerifications[1] || 0),
                rewardClaimed: Boolean(userVerifications[2])
            };
            return result;
        } catch (err) {
            return { date: 0, count: 0, rewardClaimed: false };
        }
    };

    const userVerificationsData = processUserVerifications();
    const directVerificationCount = userVerificationsData.count;

    const finalVerificationCount = Math.max(
        directVerificationCount,
        localVerificationCount,
        verificationCount && typeof verificationCount === 'bigint' ? Number(verificationCount) : 0
    );

    return {
        verificationCount: finalVerificationCount,
        canClaimReward: canClaimReward === true,
        userVerifications: userVerificationsData,
        refetchVerificationCount,
        refetchCanClaimReward,
        refetchUserVerifications
    };
}; 