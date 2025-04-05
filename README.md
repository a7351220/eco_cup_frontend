# CupFi - Sustainable DeFi Verification System

CupFi is a Web3 application that combines DeFi staking mechanisms with eco-friendly behavior verification. Users stake CELO to gain verification eligibility and earn platform tokens by verifying their use of reusable cups.

## Core Features

- 🌱 **Eco Verification**: Upload photos of reusable cup usage with AI verification
- 💰 **Staking System**: Minimum stake of 0.0001 CELO to gain verification eligibility
- 🏆 **Reward System**: Complete 3 daily verifications to unlock rewards
- 🔄 **Official Pool**: Fixed APR token rewards for verified eco-friendly actions
- 🌐 **Multi-Network Support**: Seamlessly switch between mainnet and testnet environments

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

### Network Support
- Celo Alfajores Testnet
- Celo Mainnet

### Smart Contracts

#### Testnet (Celo Alfajores)
- EcoCupToken: `0x098C568b8EFd867E089D130504d6CE9218519Dc2`
- VerificationRegistry: `0xF7C7a89e994a96C227E5911326aCdd5324261Fa3`
- SelfVerification: `0x73a166998f24878c7d1Dd55230A9281AAfEb43C8`
- RewardController: `0x3eA8E0860008fE95E22F2fb68728f40918Eed89E`
- StakingPool: `0x6075431B8eB46fc86c100b44eD669766363e76E6`

#### Mainnet (Celo)
- EcoCupToken: `0xcf9E16Da624FD6A2F7954ff041C7F250473FB6B3`
- VerificationRegistry: `0x729fEd5Fa9703923206A7Ca732Bb84BcB00CadE3`
- SelfVerification: `0x79eB256B30902588F79C217bF82C099e22A89798`
- RewardController: `0x645261A2eeE8145CAe16B24ec4163c57992E4b80`
- StakingPool: `0x312aB286ac8108eFE5bf9C6355aA149a364E27bB`

## System Architecture

The EcoCup DeFi system employs a modular architecture with five interconnected smart contracts that work together to create a secure and incentivized verification ecosystem on Celo:

### Core Components

1. **SelfVerification Contract**
   - Integrates with the Self protocol for identity verification
   - Validates zero-knowledge proofs for user identities
   - Prevents sybil attacks by ensuring one identity per user
   - Emits verification events when users complete identity verification

2. **VerificationRegistry Contract**
   - Central hub that coordinates the verification process
   - Tracks daily cup usage verifications per user
   - Enforces identity verification requirement before cup verification
   - Implements role-based access control for verifiers
   - Prevents reward gaming by limiting verifications to 3 per day

3. **RewardController Contract**
   - Calculates rewards based on staked amount and configurable APR
   - Distributes EcoCupToken rewards to verified users
   - Enforces eligibility rules (3 verifications and not claimed today)
   - Interacts with VerificationRegistry to check eligibility
   - Mints new tokens via EcoCupToken contract

4. **StakingPool Contract**
   - Manages user CELO staking with minimum threshold of 0.0001 CELO
   - Provides staking data to RewardController for reward calculations
   - Enables withdrawals with safety mechanisms
   - Issues events for staking and withdrawal actions

5. **EcoCupToken Contract**
   - ERC20-compliant token with role-based minting permissions
   - Serves as the reward currency for verified users
   - Implements OpenZeppelin's AccessControl for secure token management

## Functional Flow

1. User completes identity verification through Self protocol (once per user)
2. User stakes CELO in the StakingPool contract (minimum 0.0001 CELO)
3. User performs eco-friendly cup usage and submits for verification
4. Backend verifies submission and calls VerificationRegistry
5. User completes 3 verifications in a single day
6. User claims daily reward based on their staked amount and current APR
7. Rewards are distributed in EcoCupToken to the user's wallet

## Project Structure

```
src/
├── app/          # Next.js app entry point
├── components/   # React components
├── hooks/        # Custom hooks for contract interactions and UI logic
│   ├── useEcoCupToken.ts           # EcoCupToken contract interactions
│   ├── useEcoCupVerification.ts    # Verification submission logic
│   ├── useRewardController.ts      # Reward calculation and distribution
│   ├── useSelfVerification.ts      # User verification status
│   ├── useStakingPool.ts           # Staking functionality
│   └── useVerificationRegistry.ts  # Verification records management
├── lib/          # Utilities and constants
│   ├── constants/
│   │   ├── wagmiConfig.ts                    # Wagmi client configuration
│   │   └── wagmiContractConfig/
│   │       └── contracts.ts                  # Contract configurations for all networks
│   └── utils/
│       └── networkUtils.ts                   # Network detection utilities
├── providers/    # Global state providers
└── assets/       # Static assets
```

## Key Technical Features

- **Zero-Knowledge Identity Verification**: Using Self protocol to verify identity while preserving privacy
- **Daily Tracking Mechanism**: Time-based verification tracking with reset logic
- **Role-Based Access Control**: Secure permission management for critical functions
- **Reward Calculation Algorithm**: Dynamic APR-based calculation tied to staking amount
- **Gas-Optimized Design**: Efficient storage patterns and minimal state changes
- **Cross-Contract Communication**: Secure inter-contract calls with proper validation
- **Sybil Resistance**: Prevents multiple accounts through identity verification
- **Reusable Verification Components**: Modular design for easy extension
- **Celo Blockchain Integration**: Leveraging Celo's mobile-first, carbon-negative blockchain for sustainability

## Network Architecture

The application is designed to work seamlessly across both testnet and mainnet environments:

- **Dynamic Contract Configuration**: Automatically selects the appropriate contract addresses based on the connected network
- **Network Detection**: Utilizes `useNetworkConfig` hook to determine current network and fetch corresponding contract settings
- **Cross-Network Compatibility**: All contract interactions are network-aware and adapt to the user's connected chain

## Contract Verification

Verified contracts can be viewed on CeloScan:

### Celo Mainnet
- [EcoCupToken](https://celoscan.io/address/0xcf9E16Da624FD6A2F7954ff041C7F250473FB6B3)
- [VerificationRegistry](https://celoscan.io/address/0x729fEd5Fa9703923206A7Ca732Bb84BcB00CadE3)
- [SelfVerification](https://celoscan.io/address/0x79eB256B30902588F79C217bF82C099e22A89798)
- [RewardController](https://celoscan.io/address/0x645261A2eeE8145CAe16B24ec4163c57992E4b80)
- [StakingPool](https://celoscan.io/address/0x312aB286ac8108eFE5bf9C6355aA149a364E27bB)

### Celo Alfajores Testnet
- [EcoCupToken](https://alfajores.celoscan.io/address/0x098C568b8EFd867E089D130504d6CE9218519Dc2)
- [VerificationRegistry](https://alfajores.celoscan.io/address/0xF7C7a89e994a96C227E5911326aCdd5324261Fa3)
- [SelfVerification](https://alfajores.celoscan.io/address/0x73a166998f24878c7d1Dd55230A9281AAfEb43C8)
- [RewardController](https://alfajores.celoscan.io/address/0x3eA8E0860008fE95E22F2fb68728f40918Eed89E)
- [StakingPool](https://alfajores.celoscan.io/address/0x6075431B8eB46fc86c100b44eD669766363e76E6)

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
