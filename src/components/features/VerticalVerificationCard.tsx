'use client';

import { useRef, useState, useEffect, ChangeEvent } from 'react';
import { useAccount } from 'wagmi';
import { useVerificationRegistry, useStakingPool } from '@/hooks';
import { useEcoCupVerification } from '@/hooks/useEcoCupVerification';

export default function VerticalVerificationCard() {
  const { address } = useAccount();
  const { stakedAmount } = useStakingPool();
  const { verificationCount } = useVerificationRegistry();
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    step,
    error,
    imageSrc,
    feedback,
    captureImage,
    handleFileUpload,
    reset,
    isPending,
    isLoading,
    isSuccess
  } = useEcoCupVerification();

  // Calculate verification progress percentage
  const verificationProgressPercent = (verificationCount / 3) * 100;
  
  // Check if enough CELO is staked
  const hasStaked = parseFloat(stakedAmount) >= 0.0001;

  // Start camera
  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera (if available)
        audio: false
      });
      
      // Set video stream
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      alert('Unable to start camera, please use the image upload feature.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (!videoRef.current?.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setCameraActive(false);
  };

  // Take photo
  const handleTakePhoto = () => {
    captureImage(videoRef.current, canvasRef.current);
  };

  // Handle file upload
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Trigger file selection
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Retake photo
  const handleReset = () => {
    reset();
    setCameraActive(false);
  };

  // Close camera when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Control button state
  const isCameraButtonDisabled = verificationCount >= 3 || isPending || isLoading;

  return (
    <div className="eco-card">
      <div className="flex items-center text-xl font-semibold mb-4 text-green-800">
        <span className="mr-3 text-2xl">📸</span> Eco-Cup Verification
      </div>
      
      {!address ? (
        <div className="text-center py-4">
          <p className="mb-2">Please connect wallet to view verification status</p>
        </div>
      ) : !hasStaked ? (
        <div className="text-center py-4">
          <p className="mb-2">Please stake at least 0.0001 CELO to gain verification eligibility</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">
                Today's Progress: {verificationCount}/3
              </span>
              <span className="text-sm text-gray-600">
                {verificationProgressPercent.toFixed(0)}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="absolute h-full bg-green-500 rounded"
                style={{ width: `${verificationProgressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="verification-steps">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="step">
                <div className={`step-circle ${verificationCount >= stepNum ? 'step-complete' : 'step-incomplete'}`}>
                  {stepNum}
                </div>
                <span className={verificationCount >= stepNum ? 'text-green-700' : 'text-gray-500'}>
                  {stepNum === 1 ? 'Morning' : stepNum === 2 ? 'Afternoon' : 'Evening'}
                </span>
              </div>
            ))}
          </div>

          <div className="camera-area mt-6">
            {!cameraActive && step === 'idle' ? (
              <div className="text-center">
                <div className="text-4xl mb-2 text-green-500">📷</div>
                <p className="text-sm text-gray-600 mb-4">Click the button below to start camera or upload an image</p>
              </div>
            ) : step === 'processing' || isPending || isLoading ? (
              <div className="text-center">
                <div className="spinner mb-2"></div>
                <p className="text-sm text-blue-600">
                  {step === 'processing' ? 'Analyzing image...' : 'Recording to blockchain...'}
                </p>
              </div>
            ) : step === 'success' ? (
              <div className="text-center">
                <div className="bg-green-50 inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-700 mb-3">Verification Successful!</h3>
                {feedback && (
                  <div className="bg-white border border-green-100 shadow-sm p-4 rounded-lg max-w-md mx-auto">
                    <p className="text-gray-700">{feedback.feedback}</p>
                  </div>
                )}
              </div>
            ) : step === 'failed' ? (
              <div className="text-center">
                <div className="bg-red-50 inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-700 mb-3">Verification Failed</h3>
                {error && (
                  <div className="bg-white border border-red-100 shadow-sm p-4 rounded-lg max-w-md mx-auto">
                    <p className="text-gray-700">{error}</p>
                  </div>
                )}
              </div>
            ) : cameraActive ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="camera-preview" 
                />
                <canvas ref={canvasRef} className="hidden" width="640" height="480" />
              </>
            ) : null}
          </div>

          {step === 'idle' && (
            <div className="flex flex-col gap-4 mt-6">
              <button
                className="eco-btn"
                onClick={startCamera}
                disabled={isCameraButtonDisabled}
              >
                Start Camera
              </button>
              <button
                className="eco-btn eco-btn-outline"
                onClick={triggerFileUpload}
                disabled={isCameraButtonDisabled}
              >
                Upload Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {cameraActive && step === 'idle' && (
            <div className="flex flex-col gap-4 mt-6">
              <button
                className="eco-btn"
                onClick={handleTakePhoto}
              >
                Take Photo
              </button>
              <button
                className="eco-btn eco-btn-outline"
                onClick={stopCamera}
              >
                Cancel
              </button>
            </div>
          )}

          {(step === 'success' || step === 'failed') && (
            <div className="flex flex-col gap-4 mt-6">
              <button
                className="eco-btn"
                onClick={handleReset}
              >
                Take Another Photo
              </button>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600 bg-green-50 p-4 rounded-lg">
            <p className="mb-1">• Take a clear photo of your eco-friendly cup</p>
            <p className="mb-1">• Make sure the cup is clearly visible in the frame</p>
            <p>• Complete 3 verifications daily to earn rewards</p>
          </div>
        </>
      )}
    </div>
  );
} 