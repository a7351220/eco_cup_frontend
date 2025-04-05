'use client';

import React from 'react';
import SelfVerification from './SelfVerification';
import AdminVerification from './AdminVerification';
import { useSelfVerification } from '@/hooks';

interface IdentityVerificationProps {
  onVerificationSuccess?: () => void;
}

/**
 * Combined identity verification component
 * - Shows regular SelfVerification for normal users
 * - Automatically processes verification for admin users
 * - Shows AdminVerification panel for users with VERIFIER_ROLE (in development mode only)
 */
const IdentityVerification: React.FC<IdentityVerificationProps> = ({ 
  onVerificationSuccess 
}) => {
  const { isIdentityVerified } = useSelfVerification();
  const isDevelopment = process.env.NODE_ENV !== 'production';

  return (
    <div className="space-y-6">
      <SelfVerification onVerificationSuccess={onVerificationSuccess} />
      
      {/* Admin verification panel - only displayed in development mode and when admin is not verified */}
      {isDevelopment && !isIdentityVerified && <AdminVerification />}
    </div>
  );
};

export default IdentityVerification; 