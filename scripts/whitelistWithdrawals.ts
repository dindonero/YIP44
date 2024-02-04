import { deployments, ethers } from "hardhat"
import { whitelistWithdrawals as helperWhitelist } from "../utils/whitelistWithdrawals"
import { passProposal } from "../utils/passProposal"

export const whitelistWithdrawals = async () => {
    await deployments.fixture(["YIP44"])
    const YIP44 = await ethers.getContract("YIP44")

    let targets: string[] = []
    let values: number[] = []
    let signatures: string[] = []
    let calldatas: string[] = []

    const description = "YIP44: whitelist proposal"
    const [target, value, signature, calldata] = await helperWhitelist(await YIP44.getAddress())
    targets.push(target)
    values.push(value)
    signatures.push(signature)
    calldatas.push(calldata)

    await passProposal(targets, values, signatures, calldatas, description)

    console.log("YIP44 at", await YIP44.getAddress())
}

whitelistWithdrawals().then(() => {
    console.log("done")
})
