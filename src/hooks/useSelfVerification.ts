import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useCallback } from 'react';
import { useNetworkConfig } from '@/lib/utils/networkUtils';

// VERIFIER_ROLE constant as keccak256 hash
export const VERIFIER_ROLE = "0x3a9a1512256ee5e7f6e09557a22aaf332f9a6bd11da45478ec08c5418f96a1b4";

/**
 * This hook provides the functionality to interact with the SelfVerification contract
 * and check identity verification status
 */
export const useSelfVerification = () => {
    const { address } = useAccount();
    const { contracts, chainId } = useNetworkConfig();
    const [qrStatus, setQrStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

    // Check if user is already verified
    const { data: isIdentityVerified, refetch: refetchVerificationStatus } = useReadContract({
        ...contracts.VerificationRegistry,
        functionName: 'isIdentityVerified',
        args: [address],
        chainId,
    });

    // Check if user has VERIFIER_ROLE (admin)
    const { data: hasVerifierRole } = useReadContract({
        ...contracts.SelfVerification,
        functionName: 'hasRole',
        args: [VERIFIER_ROLE, address],
        chainId,
    });

    // For admin users with VERIFIER_ROLE
    const {
        writeContract: writeMockVerification,
        data: mockVerificationHash,
        isPending: isMockVerificationPending,
        error: mockVerificationError
    } = useWriteContract();

    const { isLoading: isMockVerificationLoading, isSuccess: isMockVerificationSuccess } = useWaitForTransactionReceipt({
        hash: mockVerificationHash,
    });

    // For testing environments only - mock identity verification
    const mockIdentityVerification = useCallback((targetAddress: string) => {
        if (!address) return;

        writeMockVerification({
            ...contracts.SelfVerification,
            functionName: 'mockIdentityVerification',
            args: [targetAddress],
            chainId,
        });

        setTimeout(() => {
            if (targetAddress.toLowerCase() === address.toLowerCase()) {
                refetchVerificationStatus();
            }
        }, 3000);
    }, [address, writeMockVerification, refetchVerificationStatus, contracts.SelfVerification, chainId]);

    // Handle successful verification from Self app
    const handleVerificationSuccess = useCallback(() => {
        setQrStatus('pending');

        // Refetch verification status after a delay to allow for transaction processing
        setTimeout(() => {
            refetchVerificationStatus();
            setQrStatus('success');
        }, 5000);
    }, [refetchVerificationStatus]);

    // Verify self automatically for admin users
    const verifyAdminSelf = useCallback(() => {
        if (address && hasVerifierRole) {
            mockIdentityVerification(address);
        }
    }, [address, hasVerifierRole, mockIdentityVerification]);

    return {
        isIdentityVerified: isIdentityVerified === true,
        hasVerifierRole: hasVerifierRole === true,
        qrStatus,
        setQrStatus,
        mockIdentityVerification,
        handleVerificationSuccess,
        refetchVerificationStatus,
        isMockVerificationPending,
        isMockVerificationLoading,
        isMockVerificationSuccess,
        verifyAdminSelf
    };
}; 