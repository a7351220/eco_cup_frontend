import { ethers } from 'ethers';
import { contractsConfig } from '@/lib/constants/wagmiContractConfig/contracts';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdentifier } from '@selfxyz/core';

/**
 * API route handler for Self identity verification
 * This endpoint is called from the Self app after user completes identity verification
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { proof, publicSignals } = body;

        if (!proof || !publicSignals) {
            return NextResponse.json(
                { message: 'Proof and publicSignals are required' },
                { status: 400 }
            );
        }

        // Extract user address from verification result using Self SDK
        let userAddress = '';
        try {
            userAddress = await getUserIdentifier(publicSignals, "hex");
            console.log("Extracted address from verification result:", userAddress);
        } catch (error) {
            console.error("Error extracting user address:", error);
            return NextResponse.json(
                { message: 'Failed to extract user address from verification data' },
                { status: 400 }
            );
        }

        // Connect to Celo Alfajores network
        const provider = new ethers.JsonRpcProvider(process.env.CELO_RPC_URL || "https://alfajores-forno.celo-testnet.org");

        // Use private key from environment variables
        if (!process.env.PRIVATE_KEY) {
            return NextResponse.json(
                { message: 'Server configuration error: Private key not found' },
                { status: 500 }
            );
        }

        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const selfVerificationAddress = contractsConfig.SelfVerification.address;

        if (!selfVerificationAddress) {
            return NextResponse.json(
                { message: 'Self verification contract address not configured' },
                { status: 500 }
            );
        }

        const contract = new ethers.Contract(
            selfVerificationAddress,
            contractsConfig.SelfVerification.abi,
            signer
        );

        try {
            // Call the contract to verify the proof
            // Note: The proof format must be transformed for the contract
            const tx = await contract.verifySelfProof({
                a: proof.a,
                b: [
                    [proof.b[0][1], proof.b[0][0]],  // Note: b array indices are swapped
                    [proof.b[1][1], proof.b[1][0]],
                ],
                c: proof.c,
                pubSignals: publicSignals,
            });

            // Wait for transaction confirmation
            const receipt = await tx.wait();

            return NextResponse.json({
                status: 'success',
                result: true,
                message: 'Identity verification successful',
                txHash: receipt.hash
            });
        } catch (contractError) {
            console.error("Contract call failed:", contractError);
            return NextResponse.json({
                status: 'error',
                result: false,
                message: 'Verification failed on the blockchain',
                error: contractError instanceof Error ? contractError.message : 'Unknown contract error'
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Server error processing verification',
            result: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 