// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract EKLDeposit is Ownable, Pausable {
    struct Token {
        mapping(address => uint256) userDeposit;
        uint256[] packages;
        bool valid;
    }
    mapping(address => Token) tokens;

    constructor() Ownable(_msgSender()) {}

    function withdrawn() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function setPause(bool _isPause) external onlyOwner {
        if (_isPause) {
            _pause();
        } else _unpause();
    }

    function updateTokens(
        address[] memory _tokens,
        bool[] memory _valids
    ) external onlyOwner {
        require(_tokens.length == _valids.length, "Error: input invalid");
        for (uint8 i = 0; i < _tokens.length; i++) {
            tokens[_tokens[i]].valid = _valids[i];
        }
    }

    function setPackages(
        address _token,
        uint256[] memory _amounts
    ) external onlyOwner {
        require(tokens[_token].valid, "Error: token invalid");
        require(_amounts.length > 0, "Error: amount empty");

        tokens[_token].packages = new uint256[](_amounts.length);

        for (uint8 i = 0; i < _amounts.length; i++) {
            require(_amounts[i] > 0, "Error: amount invalid");
            tokens[_token].packages[i] = _amounts[i];
        }
    }

    function addPackages(
        address _token,
        uint256[] memory _amounts
    ) external onlyOwner {
        require(tokens[_token].valid, "Error: token invalid");

        for (uint8 i = 0; i < _amounts.length; i++) {
            require(_amounts[i] > 0, "Error: amount invalid");
            tokens[_token].packages.push(_amounts[i]);
        }
    }

    function withdrawnToken(
        address _token,
        uint256 _amount
    ) external onlyOwner {
        require(
            IERC20(_token).balanceOf(address(this)) >= _amount,
            "Token insufficient"
        );

        require(
            IERC20(_token).approve(owner(), _amount),
            "Token approve failed!"
        );

        require(
            IERC20(_token).transfer(owner(), _amount),
            "Token transfer fail"
        );
    }

    event Desposit(address from, address token, uint256 amount, uint256 time);

    function deposit(address _token, uint8 _id) external whenNotPaused {
        require(tokens[_token].valid, "Error: token invalid");

        uint256 amount = tokens[_token].packages[_id];
        require(amount > 0, "Error: id invalid");

        // IERC20(_token).approve(address(this), amount);

        IERC20(_token).transferFrom(_msgSender(), address(this), amount);

        tokens[_token].userDeposit[_msgSender()] += amount;

        emit Desposit(_msgSender(), _token, amount, block.timestamp);
    }

    function getDeposit(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token].userDeposit[_user];
    }

    function getTokenInfo(
        address _token
    ) external view returns (bool, uint256[] memory) {
        return (tokens[_token].valid, tokens[_token].packages);
    }

    function getDeposit(address _token) public view returns (uint256) {
        return getDeposit(_token, _msgSender());
    }
}
