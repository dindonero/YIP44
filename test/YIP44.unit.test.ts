import { deployments, ethers } from "hardhat";
import { whitelistWithdrawals } from "../utils/whitelistWithdrawals";
import { YIP44 } from "../typechain-types";
import { RESERVES, WETH } from "../helper-hardhat-config";
import { expect } from "chai";
import { callExecute } from "../utils/callExecute";
import { passProposal } from "../utils/passProposal";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("YIP44.sol", function () {
    let YIP44: YIP44
    let deployer: SignerWithAddress

    before(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]

        await deployments.fixture(["YIP44"])
        YIP44 = await ethers.getContract("YIP44")
    })

    it("should empty the weth reserves of YAM and send the entire amount to i_receiver in the form of ETH", async () => {

        const wethContract = await ethers.getContractAt("IERC20", WETH)
        const receiverAddr = await YIP44.i_receiver()

        const initWETHReservesBalance = await wethContract.balanceOf(RESERVES)
        const initETHReceiverBalance = await ethers.provider.getBalance(receiverAddr)

        // ======== SETUP ===========
        // WHITELIST PROPOSAL

        let targets: string[] = []
        let values: number[] = []
        let signatures: string[] = []
        let calldatas: string[] = []
        const description = "YIP44: whitelist proposal"

        const [target, value, signature, calldata] = await whitelistWithdrawals(await YIP44.getAddress())
        targets.push(target)
        values.push(value)
        signatures.push(signature)
        calldatas.push(calldata)

        // ==========================
        // EXECUTE PROPOSAL

        const [targetExecute, valueExecute, signatureExecute, calldataExecute] = await callExecute(await YIP44.getAddress())
        targets.push(targetExecute)
        values.push(valueExecute)
        signatures.push(signatureExecute)
        calldatas.push(calldataExecute)

        // ==========================
        // PASS PROPOSAL

        await passProposal(targets, values, signatures, calldatas, description)

        // ==========================
        // ASSERTIONS

        const finalWETHReservesBalance = await wethContract.balanceOf(RESERVES)
        const finalWETHProposalBalance = await wethContract.balanceOf(await YIP44.getAddress())

        const finalETHReceiverBalance = await ethers.provider.getBalance(receiverAddr)
        const finalETHProposalBalance = await ethers.provider.getBalance(await YIP44.getAddress())

        expect(finalWETHReservesBalance.toString()).to.equal("0")
        expect(finalWETHProposalBalance.toString()).to.equal("0")
        expect(finalETHProposalBalance.toString()).to.equal("0")
        expect(finalETHReceiverBalance.toString()).to.equal((initETHReceiverBalance + initWETHReservesBalance).toString())

        console.table({
            "initWETHReservesBalance": initWETHReservesBalance.toString(),
            "finalWETHReservesBalance": finalWETHReservesBalance.toString(),
            "initETHReceiverBalance": initETHReceiverBalance.toString(),
            "finalETHReceiverBalance": finalETHReceiverBalance.toString(),
            "initWETHProposalBalance": initWETHReservesBalance.toString(),
            "finalWETHProposalBalance": finalWETHProposalBalance.toString(),
            "initETHProposalBalance": initETHReceiverBalance.toString(),
            "finalETHProposalBalance": finalETHProposalBalance.toString(),
        })
    })
})
