'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useSelfVerification } from '@/hooks';
import dynamic from 'next/dynamic';

const QRCodeComponent = dynamic(
  () => import('@/components/features/QRCodeComponent'),
  { ssr: false }
);

const SelfVerification: React.FC<{ onVerificationSuccess?: () => void }> = ({ onVerificationSuccess }) => {
  const { address, isConnected } = useAccount();
  const { 
    isIdentityVerified, 
    hasVerifierRole, 
    handleVerificationSuccess,
    verifyAdminSelf
  } = useSelfVerification();

  useEffect(() => {
    if (address && hasVerifierRole && !isIdentityVerified) {
      verifyAdminSelf();
    }
  }, [address, hasVerifierRole, isIdentityVerified, verifyAdminSelf]);

  const onSuccess = () => {
    handleVerificationSuccess();
    if (onVerificationSuccess) {
      onVerificationSuccess();
    }
  };

  if (isIdentityVerified) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded-md">
        ✓ Your identity has been verified
      </div>
    );
  }

  if (hasVerifierRole) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
        ⏱ Admin detected, auto-verifying...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Identity Verification Required</h2>
      <p className="mb-4 text-center">
        Please scan this QR code with the Self app to verify your identity.
        This is required before you can participate in the EcoCup verification process.
      </p>
      
      {!isConnected ? (
        <div className="text-red-600">Please connect your wallet first</div>
      ) : !address ? (
        <div className="text-yellow-600">Wallet address not available</div>
      ) : (
        <div className="flex justify-center p-2 bg-white rounded-md shadow-md">
          <QRCodeComponent 
            address={address}
            onSuccess={onSuccess}
          />
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        Don't have the Self app? 
        <a 
          href="https://self.xyz/download" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-1 text-blue-600 hover:underline"
        >
          Download here
        </a>
      </div>
    </div>
  );
};

export default SelfVerification; 