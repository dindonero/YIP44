//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./interfaces/IWETH9.sol";

error YIP44__ProposalAlreadyExecuted();
error YIP44__OnlyGovCanCallFunction();

contract YIP44 {
    IWETH9 internal constant WETH = IWETH9(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    address internal constant RESERVES = 0x97990B693835da58A281636296D2Bf02787DEa17;
    address internal constant GOV = 0x8b4f1616751117C38a0f84F9A146cca191ea3EC5;

    address public constant i_receiver = 0x0C04D9e9278EC5e4D424476D3Ebec70Cb5d648D1;

    bool public isExecuted;

    modifier onlyGov() {
        if (msg.sender != GOV) revert YIP44__OnlyGovCanCallFunction();
        _;
    }

    modifier isNotExecuted() {
        if (isExecuted) revert YIP44__ProposalAlreadyExecuted();
        _;
    }

    function execute() public onlyGov isNotExecuted {
        isExecuted = true;

        WETH.transferFrom(RESERVES, address(this), WETH.balanceOf(RESERVES));
        WETH.withdraw(WETH.balanceOf(address(this)));
        payable(i_receiver).transfer(address(this).balance);
    }

    receive() external payable {}
}
