'use client';

import { useAccount } from 'wagmi';
import { useVerificationRegistry, useStakingPool } from '@/hooks';

export default function VerificationCard() {
  const { address } = useAccount();
  const { stakedAmount } = useStakingPool();
  const { verificationCount, userVerifications } = useVerificationRegistry();

  // Calculate verification progress percentage
  const verificationProgressPercent = (verificationCount / 3) * 100;
  
  // Check if enough ETH is staked
  const hasStaked = parseFloat(stakedAmount) >= 0.0001;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Eco-Cup Verification</h2>
      
      {!address ? (
        <div className="text-center py-4">
          <p className="mb-2">Please connect wallet to view verification status</p>
        </div>
      ) : !hasStaked ? (
        <div className="text-center py-4">
          <p className="mb-2">Please stake at least 0.0001 ETH to be eligible for verification</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Today's Progress: {verificationCount}/3
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {verificationProgressPercent.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${verificationProgressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`p-4 rounded-lg flex flex-col items-center justify-center ${
                  verificationCount >= step
                    ? 'bg-green-100 dark:bg-green-900 border-green-500'
                    : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                } border`}
              >
                <span
                  className={`text-xl font-bold ${
                    verificationCount >= step ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  #{step}
                </span>
                <span
                  className={`text-sm ${
                    verificationCount >= step
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {verificationCount >= step ? 'Completed' : 'Incomplete'}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Complete 3 verifications to become eligible for rewards!
            </p>
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>• Verifications are automatically recorded by the system</p>
            <p>• Complete 3 verifications daily to be eligible for rewards</p>
            <p>• Verification progress resets at midnight</p>
          </div>
        </>
      )}
    </div>
  );
} 