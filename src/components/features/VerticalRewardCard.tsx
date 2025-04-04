'use client';

import { useAccount } from 'wagmi';
import { useVerificationRegistry, useRewardController, useEcoCupToken } from '@/hooks';

export default function VerticalRewardCard() {
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
    <div className="eco-card">
      <div className="flex items-center text-xl font-semibold mb-4 text-green-800">
        <span className="mr-3 text-2xl">🏆</span> Reward Center
      </div>
      
      {!address ? (
        <div className="text-center py-4">
          <p className="mb-2">Please connect wallet to view reward information</p>
        </div>
      ) : (
        <>
          <div className="rewards-card">
            <div className="rewards-title">My Token Balance</div>
            <div className="rewards-value">{tokenBalance} ECO</div>
            <div className="rewards-subtitle">Daily APR: {dailyAPR}%</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <div className="font-semibold mb-2">Today's Available Rewards</div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl font-bold">{rewardAmount}</div>
                <div className="text-xs text-green-700">EcoCupToken</div>
              </div>
              <button
                className="eco-btn px-4 py-2"
                style={{ width: 'auto' }}
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

          <div className="bg-yellow-50 p-4 rounded-lg mb-4 border-l-4 border-yellow-400">
            <div className="font-semibold mb-2 text-yellow-800">Reward Information</div>
            <ul className="text-sm text-yellow-700 space-y-1 pl-4">
              <li>• Complete 3 verifications daily to claim rewards</li>
              <li>• Reward amount based on your staked amount and APR</li>
              <li>• Rewards distributed in EcoCupToken</li>
              <li>• Rewards must be claimed daily, no automatic accumulation</li>
            </ul>
          </div>

          <div className="text-sm text-gray-600 mt-4 bg-gray-50 p-4 rounded-lg">
            <p>EcoCupToken is the platform token for the eco-friendly cup verification system</p>
            <p className="mt-1">More ecosystem applications coming in the future</p>
          </div>
        </>
      )}
    </div>
  );
} 