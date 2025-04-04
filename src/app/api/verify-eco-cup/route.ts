import { verifyEcoCupImage } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { image } = data;

        if (!image) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            );
        }

        // Verify the image using Gemini API
        const result = await verifyEcoCupImage(image);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Verification API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
} 