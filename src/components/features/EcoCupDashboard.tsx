'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import StakingCard from './StakingCard';
import VerificationCard from './VerificationCard';
import RewardCard from './RewardCard';

export default function EcoCupDashboard() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">CupFi Verification System</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Stake ETH, use eco-friendly cups daily, earn token rewards
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <ConnectButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StakingCard />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          <VerificationCard />
          <RewardCard />
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          The Eco-Friendly Cup DeFi Verification System is an innovative blockchain project that combines DeFi staking with eco-friendly behavior,
          encouraging users to make environmentally conscious choices in daily life. The system uses Smart Contracts to ensure the authenticity and
          transparency of each verification.
        </p>
      </div>
    </div>
  );
} 