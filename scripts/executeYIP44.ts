import { deployments, ethers } from "hardhat"
import { YIP44 } from "../typechain-types"

const executeYIP44 = async () => {
    //await deployments.fixture(["YIP44"])
    const YIP44: YIP44 = await ethers.getContractAt("YIP44", "0x0c03eCB91Cb50835e560a7D52190EB1a5ffba797")

    const tx = await YIP44.execute()
    await tx.wait(1)
}

executeYIP44().then(() => {
    console.log("done")
})
