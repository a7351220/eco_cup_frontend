import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { useEffect, useState } from 'react';
import { contractsConfig, BASE_SEPOLIA_CHAIN_ID } from '@/lib/constants/wagmiContractConfig/contracts';

/**
 * This hook provides the functionality to interact with the VerificationRegistry contract
 */
export const useVerificationRegistry = () => {
    const { address } = useAccount();
    const [localVerificationCount, setLocalVerificationCount] = useState<number>(0);

    const { data: verificationCount, refetch: refetchVerificationCount } = useReadContract({
        ...contractsConfig.VerificationRegistry,
        functionName: 'getVerificationCount',
        args: [address],
        chainId: BASE_SEPOLIA_CHAIN_ID,
    });

    const { data: canClaimReward, refetch: refetchCanClaimReward } = useReadContract({
        ...contractsConfig.VerificationRegistry,
        functionName: 'canClaimReward',
        args: [address],
        chainId: BASE_SEPOLIA_CHAIN_ID,
    });

    const { data: userVerifications, refetch: refetchUserVerifications } = useReadContract({
        ...contractsConfig.VerificationRegistry,
        functionName: 'userVerifications',
        args: [address],
        chainId: BASE_SEPOLIA_CHAIN_ID,
    });

    useEffect(() => {
        if (userVerifications && Array.isArray(userVerifications)) {
            const processedData = processUserVerifications();
            console.log('User verification data updated:', processedData);
            setLocalVerificationCount(processedData.count);
        }
    }, [userVerifications]);

    useEffect(() => {
        if (address) {
            console.log('Current connected address:', address);
        }

        if (verificationCount !== undefined) {
            console.log('Verification count from contract:', verificationCount);
        }

        if (userVerifications) {
            console.log('User verifications raw data:', userVerifications);
        }
    }, [address, verificationCount, userVerifications]);

    useWatchContractEvent({
        address: contractsConfig.VerificationRegistry.address,
        abi: contractsConfig.VerificationRegistry.abi,
        eventName: 'VerificationRecorded',
        onLogs: (logs) => {
            console.log('Received verification events:', logs);

            const userEvents = logs.filter(log => {
                try {
                    // @ts-ignore: auto type inference may be wrong, but we know the event structure
                    const eventUser = log.args?.user?.toLowerCase();
                    const isMatch = address && eventUser === address.toLowerCase();
                    console.log(`Event user: ${eventUser}, Current user: ${address}, Match: ${isMatch}`);
                    return isMatch;
                } catch (err) {
                    console.error('Error filtering events:', err);
                    return false;
                }
            });

            if (userEvents.length > 0) {
                console.log('Detected verification event for current user', userEvents);
                const latestEvent = userEvents[userEvents.length - 1];
                try {
                    // @ts-ignore: auto type inference may be wrong, but we know the event structure
                    const count = Number(latestEvent.args?.count || 0);
                    console.log('Setting count from event:', count);
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
        chainId: BASE_SEPOLIA_CHAIN_ID,
    });

    useEffect(() => {
        if (address) {
            console.log('Fetching initial data for address:', address);
            refetchVerificationCount();
            refetchCanClaimReward();
            refetchUserVerifications();
        }
    }, [address, refetchVerificationCount, refetchCanClaimReward, refetchUserVerifications]);

    const processUserVerifications = () => {
        if (!userVerifications || !Array.isArray(userVerifications)) {
            console.log('No user verification data available');
            return { date: 0, count: 0, rewardClaimed: false };
        }

        try {
            const result = {
                date: Number(userVerifications[0] || 0),
                count: Number(userVerifications[1] || 0),
                rewardClaimed: Boolean(userVerifications[2])
            };
            console.log('Processed user verification data:', result);
            return result;
        } catch (err) {
            console.error('Error processing user verification data:', err);
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

    console.log('Final verification count:', {
        directCount: directVerificationCount,
        localCount: localVerificationCount,
        contractCount: verificationCount && typeof verificationCount === 'bigint' ? Number(verificationCount) : 0,
        finalCount: finalVerificationCount
    });

    return {
        verificationCount: finalVerificationCount,
        canClaimReward: canClaimReward === true,
        userVerifications: userVerificationsData,
        refetchVerificationCount,
        refetchCanClaimReward,
        refetchUserVerifications
    };
}; 