'use client';

import { VerticalScrollLayout } from '@/components/layout/VerticalScrollLayout';
import VerticalStakingCard from './VerticalStakingCard';
import VerticalVerificationCard from './VerticalVerificationCard';
import VerticalRewardCard from './VerticalRewardCard';

export default function EcoVerticalDashboard() {
  const dashboardSections = [
    {
      id: 'staking',
      component: <VerticalStakingCard />,
    },
    {
      id: 'verification',
      component: <VerticalVerificationCard />,
    },
    {
      id: 'rewards',
      component: <VerticalRewardCard />,
    },
  ];

  return <VerticalScrollLayout sections={dashboardSections} />;
} 