'use client';

import { useAccount } from 'wagmi';
import { useVerificationRegistry, useRewardController, useEcoCupToken } from '@/hooks';

export default function RewardCard() {
  const { address } = useAccount();
  const { canClaimReward } = useVerificationRegistry();
  const {
    rewardAmount,
    dailyAPR,
    distributeReward,
    isDistributeRewardPending,
    isDistributeRewardLoading,
    isDistributeRewardSuccess,
  } = useRewardController();
  const { tokenBalance } = useEcoCupToken();

  // Handle reward claim
  const handleClaimReward = () => {
    if (!canClaimReward) return;
    distributeReward();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Reward Center</h2>
      
      {!address ? (
        <div className="text-center py-4">
          <p className="mb-2">Please connect wallet to view reward information</p>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-5 text-white mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm opacity-80">My Token Balance</span>
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                EcoCupToken
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{tokenBalance}</div>
            <div className="text-xs opacity-70">Daily APR: {dailyAPR}%</div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-2">Today's Available Rewards</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">{rewardAmount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">EcoCupToken</p>
              </div>
              <button
                className={`py-2 px-4 rounded-md ${
                  canClaimReward
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleClaimReward}
                disabled={!canClaimReward || isDistributeRewardPending || isDistributeRewardLoading}
              >
                {isDistributeRewardPending || isDistributeRewardLoading
                  ? 'Processing...'
                  : canClaimReward
                  ? 'Claim Rewards'
                  : 'Verification Incomplete'}
              </button>
            </div>
            {isDistributeRewardSuccess && (
              <p className="text-green-500 text-xs mt-2">Rewards claimed successfully!</p>
            )}
          </div>

          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 p-4 mb-4">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Reward Information</h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
              <li>• Complete 3 verifications daily to claim rewards</li>
              <li>• Reward amount based on your staked amount and APR</li>
              <li>• Rewards distributed in EcoCupToken</li>
              <li>• Rewards must be claimed daily, no automatic accumulation</li>
            </ul>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            <p>EcoCupToken is the platform token for the eco-friendly cup verification system, with more utilities coming in the future.</p>
          </div>
        </>
      )}
    </div>
  );
} 