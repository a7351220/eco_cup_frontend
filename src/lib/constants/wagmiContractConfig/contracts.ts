import StakingPoolABI from '../../../../abi/StakingPool.abi.json';
import VerificationRegistryABI from '../../../../abi/VerificationRegistry.abi.json';
import RewardControllerABI from '../../../../abi/RewardController.abi.json';
import EcoCupTokenABI from '../../../../abi/EcoCupToken.abi.json';
import SelfVerificationABI from '../../../../abi/SelfVerification.abi.json';

/**
 * Celo Alfajores Testnet contract addresses and ABI configurations
 */
export const contractsConfig = {
    StakingPool: {
        address: process.env.NEXT_PUBLIC_TESTNET_STAKING_POOL_ADDRESS || '0x6075431B8eB46fc86c100b44eD669766363e76E6',
        abi: StakingPoolABI,
    },
    VerificationRegistry: {
        address: process.env.NEXT_PUBLIC_TESTNET_VERIFICATION_REGISTRY_ADDRESS || '0xF7C7a89e994a96C227E5911326aCdd5324261Fa3',
        abi: VerificationRegistryABI,
    },
    RewardController: {
        address: process.env.NEXT_PUBLIC_TESTNET_REWARD_CONTROLLER_ADDRESS || '0x3eA8E0860008fE95E22F2fb68728f40918Eed89E',
        abi: RewardControllerABI,
    },
    EcoCupToken: {
        address: process.env.NEXT_PUBLIC_TESTNET_ECO_CUP_TOKEN_ADDRESS || '0x098C568b8EFd867E089D130504d6CE9218519Dc2',
        abi: EcoCupTokenABI,
    },
    SelfVerification: {
        address: process.env.NEXT_PUBLIC_TESTNET_SELF_VERIFICATION_ADDRESS || '0x73a166998f24878c7d1Dd55230A9281AAfEb43C8',
        abi: SelfVerificationABI,
    },
} as const;

/**
 * Celo Mainnet contract addresses and ABI configurations
 */
export const mainnetContractsConfig = {
    StakingPool: {
        address: process.env.NEXT_PUBLIC_MAINNET_STAKING_POOL_ADDRESS || '0x312aB286ac8108eFE5bf9C6355aA149a364E27bB',
        abi: StakingPoolABI,
    },
    VerificationRegistry: {
        address: process.env.NEXT_PUBLIC_MAINNET_VERIFICATION_REGISTRY_ADDRESS || '0x729fEd5Fa9703923206A7Ca732Bb84BcB00CadE3',
        abi: VerificationRegistryABI,
    },
    RewardController: {
        address: process.env.NEXT_PUBLIC_MAINNET_REWARD_CONTROLLER_ADDRESS || '0x645261A2eeE8145CAe16B24ec4163c57992E4b80',
        abi: RewardControllerABI,
    },
    EcoCupToken: {
        address: process.env.NEXT_PUBLIC_MAINNET_ECO_CUP_TOKEN_ADDRESS || '0xcf9E16Da624FD6A2F7954ff041C7F250473FB6B3',
        abi: EcoCupTokenABI,
    },
    SelfVerification: {
        address: process.env.NEXT_PUBLIC_MAINNET_SELF_VERIFICATION_ADDRESS || '0x79eB256B30902588F79C217bF82C099e22A89798',
        abi: SelfVerificationABI,
    },
} as const;

// Celo Alfajores Testnet ChainId
export const CELO_ALFAJORES_CHAIN_ID = 44787;

// Celo Mainnet ChainId
export const CELO_MAINNET_CHAIN_ID = 42220; 