'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useStakingPool } from '@/hooks';

export default function StakingCard() {
  const { address } = useAccount();
  const {
    stakedAmount,
    stake,
    withdraw,
    isStakePending,
    isWithdrawPending,
    isStakeLoading,
    isWithdrawLoading,
    isStakeSuccess,
    isWithdrawSuccess,
    refetchStakedAmount,
  } = useStakingPool();

  const [stakeAmount, setStakeAmount] = useState('0.0001');
  const [withdrawAmount, setWithdrawAmount] = useState('0');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check input validity
  const isValidStakeAmount = parseFloat(stakeAmount) >= 0.0001;
  const isValidWithdrawAmount = parseFloat(withdrawAmount) > 0 && parseFloat(withdrawAmount) <= parseFloat(stakedAmount);

  // Handle staking
  const handleStake = () => {
    if (!isValidStakeAmount) return;
    stake(stakeAmount);
  };

  // Handle withdrawal
  const handleWithdraw = () => {
    if (!isValidWithdrawAmount) return;
    withdraw(withdrawAmount);
  };

  // Handle setting maximum withdrawal amount
  const handleSetMaxWithdraw = () => {
    setWithdrawAmount(stakedAmount);
  };

  // Improved: Provide more robust data refresh logic
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    
    // Execute multiple refreshes to ensure latest data
    try {
      await refetchStakedAmount();
      
      // Refresh again after 2 seconds to ensure chain data is updated
      setTimeout(async () => {
        await refetchStakedAmount();
        
        // Refresh one more time after 2 seconds, just in case
        setTimeout(async () => {
          await refetchStakedAmount();
          setIsRefreshing(false);
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error("Failed to refresh data", error);
      setIsRefreshing(false);
    }
  }, [refetchStakedAmount]);

  // Monitor staking success
  useEffect(() => {
    if (isStakeSuccess) {
      // Refresh data and reset input after successful stake
      refreshData();
      setStakeAmount('0.0001');
    }
  }, [isStakeSuccess, refreshData]);

  // Monitor withdrawal success
  useEffect(() => {
    if (isWithdrawSuccess) {
      // Refresh data and reset input after successful withdrawal
      refreshData();
      setWithdrawAmount('0');
    }
  }, [isWithdrawSuccess, refreshData]);

  // Refresh data once on page load
  useEffect(() => {
    if (address) {
      refreshData();
    }
  }, [address, refreshData]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        ETH Staking
        {isRefreshing && (
          <span className="ml-2 inline-block text-sm text-blue-500 animate-pulse">
            Updating...
          </span>
        )}
      </h2>
      
      {!address ? (
        <div className="text-center py-4">
          <p className="mb-2">Please connect wallet to use staking features</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Staked Amount</p>
            <p className="text-2xl font-bold">{stakedAmount} ETH</p>
            <button 
              onClick={refreshData} 
              className="text-xs text-blue-500 mt-1 hover:underline"
              disabled={isRefreshing}
            >
              Manual Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Staking Form */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">Stake ETH</h3>
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-900"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    min="0.0001"
                    step="0.0001"
                  />
                  <span className="ml-2">ETH</span>
                </div>
                {!isValidStakeAmount && (
                  <p className="text-red-500 text-xs mt-1">Minimum stake amount is 0.0001 ETH</p>
                )}
              </div>
              <button
                className={`w-full py-2 px-4 rounded-md ${
                  isValidStakeAmount
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleStake}
                disabled={!isValidStakeAmount || isStakePending || isStakeLoading}
              >
                {isStakePending || isStakeLoading ? 'Processing...' : 'Stake'}
              </button>
              {isStakeSuccess && (
                <p className="text-green-500 text-xs mt-2">Staking successful! Data will update automatically</p>
              )}
            </div>

            {/* Withdrawal Form */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">Withdraw ETH</h3>
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-900"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="0"
                    max={stakedAmount}
                    step="0.0001"
                  />
                  <span className="ml-2">ETH</span>
                </div>
                <button
                  className="text-blue-500 text-xs mt-1"
                  onClick={handleSetMaxWithdraw}
                >
                  Max
                </button>
                {!isValidWithdrawAmount && withdrawAmount !== '0' && (
                  <p className="text-red-500 text-xs mt-1">Invalid withdrawal amount</p>
                )}
              </div>
              <button
                className={`w-full py-2 px-4 rounded-md ${
                  isValidWithdrawAmount
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleWithdraw}
                disabled={!isValidWithdrawAmount || isWithdrawPending || isWithdrawLoading}
              >
                {isWithdrawPending || isWithdrawLoading ? 'Processing...' : 'Withdraw'}
              </button>
              {isWithdrawSuccess && (
                <p className="text-green-500 text-xs mt-2">Withdrawal successful! Data will update automatically</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 