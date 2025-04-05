'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useSelfVerification, VERIFIER_ROLE } from '@/hooks/useSelfVerification';

/**
 * Admin verification component - only visible to users with VERIFIER_ROLE
 * Allows admins to verify other users without requiring QR code scanning
 */
const AdminVerification: React.FC = () => {
  const { address } = useAccount();
  const { hasVerifierRole, mockIdentityVerification, isMockVerificationPending } = useSelfVerification();
  const [targetAddress, setTargetAddress] = useState<string>('');

  if (!hasVerifierRole) {
    return null;
  }

  const handleVerifyAddress = () => {
    if (!targetAddress) {
      alert('Please enter the wallet address to verify');
      return;
    }
    mockIdentityVerification(targetAddress);
  };

  return (
    <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
      <h2 className="text-xl font-semibold mb-4"></h2>
      <p className="mb-4 text-sm text-gray-600">
        As a VERIFIER_ROLE admin, you can verify users directly without scanning QR codes.
      </p>
      
      <div className="flex flex-col space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            placeholder="Enter the wallet address to verify"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleVerifyAddress}
            disabled={isMockVerificationPending || !targetAddress}
            className={`px-4 py-2 rounded ${
              isMockVerificationPending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isMockVerificationPending ? "Verifying..." : "Verify Address"}
          </button>
        </div>
        
        <button
          onClick={() => address && mockIdentityVerification(address)}
          disabled={isMockVerificationPending || !address}
          className="w-full p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          Verify my address
        </button>
      </div>
      
      <div className="mt-4 text-xs text-red-500">
        Note: This admin verification option should be disabled or hidden in production environments.
      </div>
    </div>
  );
};

export default AdminVerification; 