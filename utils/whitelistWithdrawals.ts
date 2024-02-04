import { ethers } from "hardhat"
import { RESERVES, STETH, USDC, WETH } from "../helper-hardhat-config"

export const whitelistWithdrawals = async (
    proposalAddress: string
): Promise<[string, number, string, string]> => {
    const targets = RESERVES
    const signatures = "whitelistWithdrawals(address[],uint256[],address[])"
    const values = 0

    const whos = [proposalAddress]
    const amounts = [
        ethers.MaxUint256,
    ]
    const tokens = [WETH]

    const calldatas = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address[]", "uint256[]", "address[]"],
        [whos, amounts, tokens]
    )

    return [targets, values, signatures, calldatas]
}
