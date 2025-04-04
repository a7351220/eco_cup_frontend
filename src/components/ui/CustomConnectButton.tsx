'use client';

import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';

const CustomConnectWrapper: React.FC = () => {
  const { connect, connectors } = useConnect();
  
  const handleCustomConnect = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  return (
    <div className="custom-connect-button">
      <button
        onClick={handleCustomConnect}
        className="eco-connect-btn"
      >
        Connect Wallet
      </button>
      <div className="hidden-button">
        <ConnectButton 
          chainStatus="none"
          showBalance={false}
        />
      </div>
    </div>
  );
};

export default function CustomConnectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useAccount();

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isConnected) {
    return (
      <div className="connect-wallet-container">
        <CustomConnectWrapper />
      </div>
    );
  }

  return (
    <>
      <button 
        onClick={handleButtonClick} 
        className="wallet-button"
        aria-label="lookup wallet"
      >
        🍃
      </button>
      
      {isOpen && (
        <>
          <div className="wallet-modal">
            <div className="wallet-modal-header">
              <span>Your wallet</span>
              <button onClick={handleClose} className="close-button">×</button>
            </div>
            <div className="wallet-modal-content">
              <ConnectButton 
                chainStatus="icon"
                accountStatus="avatar"
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
              />
            </div>
          </div>
          <div className="wallet-backdrop" onClick={handleClose}></div>
        </>
      )}
    </>
  );
} 