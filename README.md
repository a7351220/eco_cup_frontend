# CupFi - Sustainable DeFi Verification System

CupFi is a Web3 application that combines DeFi staking mechanisms with eco-friendly behavior verification. Users stake ETH to gain verification eligibility and earn platform tokens by verifying their use of reusable cups.

## Core Features

- 🌱 **Eco Verification**: Upload photos of reusable cup usage with AI verification
- 💰 **Staking System**: Minimum stake of 0.0001 ETH to gain verification eligibility
- 🏆 **Reward System**: Complete 3 daily verifications to unlock rewards
- 🔄 **Official Pool**: Fixed APR token rewards for verified eco-friendly actions

## Tech Stack

### Frontend Technologies

- [Next.js 15](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com)

### Web3 Stack

- [viem](https://viem.sh)
- [wagmi](https://wagmi.sh)
- [RainbowKit](https://www.rainbowkit.com)

### Smart Contracts (Base Sepolia Testnet)

- EcoCupToken: `0xAc45De6353970462389974f1b4Cd1712D51c1983`
- VerificationRegistry: `0x6d8030ADb227128a24EB5a189743B670295172e7`
- RewardController: `0x5F0e11b566EC40feCb3Cbab69471fc6E898fF78B`
- StakingPool: `0x435b529860C12Dd35A3255BDbf222450E485aE35`

## Project Structure

```
src/
├── app/          # Next.js app entry point
├── components/   # React components
├── hooks/        # Custom hooks
├── lib/          # Utilities and constants
├── providers/    # Global state providers
└── assets/       # Static assets
```

## Development Guide

### Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Production Build

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Start Production Server

```bash
npm run start
# or
yarn start
# or
pnpm start
```

### Code Quality Check

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## Environment Variables

Copy the `.env.example` file to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_WALLETCONNECT_ID`: Your WalletConnect Project ID
- `GEMINI_API_KEY`: Your Gemini API Key for AI verification

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
