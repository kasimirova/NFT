//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract MultiToken is ERC1155, AccessControl{

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant URI_SETTER_ROLE = keccak256("BURNER_ROLE");
    string baseUri;
    string public name;

    
    constructor(string memory _uri, string memory _name) ERC1155(_uri) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        name = _name;
        baseUri = _uri;
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE){
        _setURI(newuri);
        baseUri = newuri;
    }
    
    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyRole(MINTER_ROLE)
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyRole(MINTER_ROLE)
    {
        _mintBatch(to, ids, amounts, data);
    }

    function burn(address from, uint256 id, uint256 amount) public onlyRole(BURNER_ROLE)
    {   
        _burn(from, id, amount);
    }

    function uri(uint256 tokenId) public view override(ERC1155) returns (string memory) {
        return string (abi.encodePacked(
        baseUri,
        Strings.toString(tokenId),
        ".json"
        ));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
