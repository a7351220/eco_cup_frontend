'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useStakingPool, useSelfVerification } from '@/hooks';
import CustomConnectButton from '@/components/ui/CustomConnectButton';
import SelfVerification from './SelfVerification';

export default function VerticalStakingCard() {
  const { address, isConnected } = useAccount();
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
  } = useStakingPool();
  const { isIdentityVerified } = useSelfVerification();

  const [stakeAmount, setStakeAmount] = useState('0.0001');
  const [withdrawAmount, setWithdrawAmount] = useState('0');

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

  // Welcome page when wallet is not connected
  if (!isConnected) {
    return (
      <div className="welcome-card">
        <div className="welcome-decoration leaf-decoration-1">🍃</div>
        <div className="welcome-decoration leaf-decoration-2">🌿</div>
        <div className="welcome-decoration leaf-decoration-3">🍃</div>
        
        <img 
          src="/img/cupfi_logo.svg" 
          alt="CupFi" 
          className="welcome-logo"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%234caf50" rx="50" ry="50"/><text x="50%" y="50%" font-size="40" text-anchor="middle" fill="white" dy=".3em">🍃</text></svg>';
            e.currentTarget.onerror = null;
          }}
        />
        <h1 className="welcome-title">CupFi</h1>
        <p className="welcome-description">
          Stake ETH, use eco-friendly cups, earn rewards, contribute to environmental protection together
        </p>
        <div className="welcome-connect">
          <CustomConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="staking-card">
      <div className="staking-header">
        <div className="flex items-center text-xl font-semibold text-green-800">
          <span className="staking-icon">💰</span> ETH Staking
        </div>
        {/* Leaf button after successful connection */}
        <div className="card-wallet-button">
          <CustomConnectButton />
        </div>
      </div>
      
      {!isIdentityVerified ? (
        <div className="my-4">
          <div className="mb-2 font-medium text-green-800"></div>
          <SelfVerification />
        </div>
      ) : (
        <>
          <div className="stat-container">
            <div>
              <div className="stat-label">Staked Amount</div>
              <div className="stat-value">{stakedAmount} ETH</div>
            </div>
            <div>
              <div className="stat-label">Staking Status</div>
              <div className="stat-value" style={{ color: parseFloat(stakedAmount) >= 0.0001 ? '#4caf50' : '#9e9e9e' }}>
                {parseFloat(stakedAmount) >= 0.0001 ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-800 mb-2">Stake Amount</label>
              <div className="relative flex items-center bg-white rounded-lg overflow-hidden shadow-sm border border-gray-300">
                <input
                  type="number"
                  className="w-full p-3 bg-transparent border-none focus:outline-none"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  min="0.0001"
                  step="0.0001"
                  style={{ appearance: 'textfield' }}
                />
                <span className="pr-3 font-medium text-gray-600">ETH</span>
              </div>
              {!isValidStakeAmount && (
                <p className="text-red-500 text-xs mt-1">Minimum stake amount is 0.0001 ETH</p>
              )}
            </div>
            
            <button
              className="eco-btn"
              onClick={handleStake}
              disabled={!isValidStakeAmount || isStakePending || isStakeLoading}
            >
              {isStakePending || isStakeLoading ? 'Processing...' : 'Stake ETH'}
            </button>
            
            {isStakeSuccess && (
              <p className="text-green-500 text-xs mt-2 text-center">Staking successful!</p>
            )}
          </div>
          
          <div className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-800 mb-2">Withdraw Amount</label>
              <div className="relative flex items-center bg-white rounded-lg overflow-hidden shadow-sm border border-gray-300">
                <input
                  type="number"
                  className="w-full p-3 bg-transparent border-none focus:outline-none"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="0"
                  max={stakedAmount}
                  step="0.0001"
                  style={{ appearance: 'textfield' }}
                />
                <span className="pr-3 font-medium text-gray-600">ETH</span>
              </div>
              <button
                className="text-green-600 text-xs mt-1"
                onClick={handleSetMaxWithdraw}
              >
                Max
              </button>
              {!isValidWithdrawAmount && withdrawAmount !== '0' && (
                <p className="text-red-500 text-xs mt-1">Invalid withdrawal amount</p>
              )}
            </div>
            
            <button
              className="eco-btn eco-btn-outline"
              onClick={handleWithdraw}
              disabled={!isValidWithdrawAmount || isWithdrawPending || isWithdrawLoading}
            >
              {isWithdrawPending || isWithdrawLoading ? 'Processing...' : 'Withdraw ETH'}
            </button>
            
            {isWithdrawSuccess && (
              <p className="text-green-500 text-xs mt-2 text-center">Withdrawal successful!</p>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-600 bg-green-50 p-4 rounded-lg">
            <p className="mb-1">• Complete identity verification first using Self app</p>
            <p className="mb-1">• Minimum stake amount is 0.0001 ETH</p>
            <p className="mb-1">• After staking, you can participate in eco-cup verification activities</p>
            <p>• Complete 3 verifications daily to earn rewards</p>
          </div>
        </>
      )}
    </div>
  );
} 