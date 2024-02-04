import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deployYIP210: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("Deploying YIP44...")
    await deploy("YIP44", {
        from: deployer,
        log: true,
        args: [],
    })

    log("YIP44 Deployed!")
    log("----------------------------------")
}
export default deployYIP210
deployYIP210.tags = ["all", "YIP44"]
