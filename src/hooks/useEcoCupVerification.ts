import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useVerificationRegistry } from './useVerificationRegistry';
import { useNetworkConfig } from '@/lib/utils/networkUtils';

type VerificationStep = 'idle' | 'capturing' | 'processing' | 'success' | 'failed';
type VerificationFeedback = {
    isValid: boolean;
    confidence: number;
    feedback: string;
};

export function useEcoCupVerification() {
    const { address } = useAccount();
    const { contracts, chainId } = useNetworkConfig();
    const [step, setStep] = useState<VerificationStep>('idle');
    const [error, setError] = useState<string | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<VerificationFeedback | null>(null);
    const { verificationCount } = useVerificationRegistry();

    // Initialize the write contract hook
    const {
        writeContract,
        data: verificationHash,
        isPending: isVerificationPending,
        error: verificationError
    } = useWriteContract();

    // Wait for transaction receipt
    const { isLoading: isVerificationLoading, isSuccess: isVerificationSuccess } = useWaitForTransactionReceipt({
        hash: verificationHash,
    });

    // Reset state
    const reset = () => {
        setStep('idle');
        setError(null);
        setImageSrc(null);
        setFeedback(null);
    };

    // Handle camera capture
    const captureImage = async (videoElement: HTMLVideoElement | null, canvasElement: HTMLCanvasElement | null) => {
        try {
            if (!videoElement || !canvasElement) {
                throw new Error('Camera elements not available');
            }

            setStep('capturing');
            setError(null);

            const context = canvasElement.getContext('2d');
            if (!context) {
                throw new Error('Canvas context not available');
            }

            // Draw the video frame to the canvas
            context.drawImage(
                videoElement,
                0, 0,
                canvasElement.width,
                canvasElement.height
            );

            // Convert canvas to image data URL
            const imageDataUrl = canvasElement.toDataURL('image/jpeg', 0.8);
            setImageSrc(imageDataUrl);

            // Process the image
            await verifyImage(imageDataUrl);
        } catch (err) {
            setStep('failed');
            setError(err instanceof Error ? err.message : 'Failed to capture image');
            console.error('Image capture error:', err);
        }
    };

    // Handle file upload (for desktop users or when camera is not available)
    const handleFileUpload = async (file: File) => {
        try {
            setStep('processing');
            setError(null);

            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('Please upload an image file');
            }

            // Convert file to data URL
            const reader = new FileReader();

            const imageDataUrlPromise = new Promise<string>((resolve, reject) => {
                reader.onload = () => {
                    if (typeof reader.result === 'string') {
                        resolve(reader.result);
                    } else {
                        reject(new Error('Failed to read file'));
                    }
                };
                reader.onerror = () => reject(new Error('Error reading file'));
            });

            reader.readAsDataURL(file);
            const imageDataUrl = await imageDataUrlPromise;

            setImageSrc(imageDataUrl);

            // Process the image
            await verifyImage(imageDataUrl);
        } catch (err) {
            setStep('failed');
            setError(err instanceof Error ? err.message : 'Failed to process image');
            console.error('File upload error:', err);
        }
    };

    // Verify the image with Gemini API
    const verifyImage = async (imageDataUrl: string) => {
        try {
            setStep('processing');
            setError(null);

            // Call the verification API
            const response = await fetch('/api/verify-eco-cup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageDataUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Verification failed');
            }

            const result = await response.json();
            setFeedback(result);

            // If verification is successful and confidence is high enough, record it
            if (result.isValid && result.confidence > 0.7) {
                await recordVerificationOnChain();
                setStep('success');
            } else {
                setStep('failed');
                setError(result.feedback || 'Image does not show proper eco cup usage');
            }
        } catch (err) {
            setStep('failed');
            setError(err instanceof Error ? err.message : 'Verification process failed');
            console.error('Verification error:', err);
        }
    };

    // Record the verification on blockchain
    const recordVerificationOnChain = async () => {
        try {
            if (!address) {
                throw new Error('Wallet not connected');
            }
            // Call the smart contract to record the verification
            writeContract({
                address: contracts.VerificationRegistry.address,
                abi: contracts.VerificationRegistry.abi,
                functionName: 'recordVerification',
                args: [address],
                chainId,
            });

        } catch (err) {
            console.error('Blockchain recording error:', err);
            throw err;
        }
    };

    return {
        step,
        error,
        imageSrc,
        feedback,
        captureImage,
        handleFileUpload,
        verifyImage,
        reset,
        isPending: isVerificationPending,
        isLoading: isVerificationLoading,
        isSuccess: isVerificationSuccess,
        verificationCount
    };
} 