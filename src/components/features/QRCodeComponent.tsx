'use client';

import React, { useState, useEffect } from 'react';
import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';
import {logo} from 'public/img/cupfi_logo_64'

interface QRCodeComponentProps {
  address: string;
  onSuccess: () => void;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ address, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="text-yellow-600">loading...</div>;
  }

  try {
    const selfApp = new SelfAppBuilder({
      appName: "EcoCup Verification",
      scope: "1001",
      endpoint: "/api/verify",
      logoBase64: logo,
      userId: address,
      userIdType: "hex",
      disclosures: { 
        date_of_birth: true,
      },
      devMode: process.env.NODE_ENV !== 'production',
    }).build();

    const qrCodeStyle = {
      transform: 'scale(0.7)',
      transformOrigin: 'center', 
    };

    return (
      <div style={qrCodeStyle}>
        <SelfQRcodeWrapper
          selfApp={selfApp}
          type='websocket'
          onSuccess={onSuccess}
        />
      </div>
    );
  } catch (error) {
    console.error('Failed to create Self app:', error);
    return <div className="text-red-500">Failed to create verification QR code</div>;
  }
};

export default QRCodeComponent; 