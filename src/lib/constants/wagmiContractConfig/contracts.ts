import StakingPoolABI from '../../../../abi/StakingPool.abi.json';
import VerificationRegistryABI from '../../../../abi/VerificationRegistry.abi.json';
import RewardControllerABI from '../../../../abi/RewardController.abi.json';
import EcoCupTokenABI from '../../../../abi/EcoCupToken.abi.json';

/**
 * Base Sepolia testnet contract addresses and ABI configurations
 */
export const contractsConfig = {
    StakingPool: {
        address: '0x435b529860C12Dd35A3255BDbf222450E485aE35',
        abi: StakingPoolABI,
    },
    VerificationRegistry: {
        address: '0x6d8030ADb227128a24EB5a189743B670295172e7',
        abi: VerificationRegistryABI,
    },
    RewardController: {
        address: '0x5F0e11b566EC40feCb3Cbab69471fc6E898fF78B',
        abi: RewardControllerABI,
    },
    EcoCupToken: {
        address: '0xAc45De6353970462389974f1b4Cd1712D51c1983',
        abi: EcoCupTokenABI,
    },
} as const;

// Base Sepolia testnet ChainId
export const BASE_SEPOLIA_CHAIN_ID = 84532; 