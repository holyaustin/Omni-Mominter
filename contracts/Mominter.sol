// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract Mominter is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    Counters.Counter private _itemsShared;
    Counters.Counter public _viewIds;
    Counters.Counter public _tipIds;

    // address owner;
    uint256 private monthly_value;
    address private owner;
    uint commission =  0.1 ether;
    uint tip =  1 ether;
    mapping(address => bool) accounts;
    mapping(uint256 => StorageItem) private idToStorageItem;
    mapping(uint256 => ViewItem) private idToViewItem;

    struct StorageItem {
        uint256 tokenId;
        address payable owner;
        address payable storageDrive;
        uint256 dateCreated;
        bool shared;
    }

    struct ViewItem {
        uint256 vId;
        uint256 tokenId;
        address visitor;
    }

    event StorageItemCreated(
        uint256 indexed tokenId,
        address owner,
        address storageDrive,
        uint256 dateCreated,
        bool shared
    );

    event ViewItemCreated(
        uint256 indexed vId,
        uint256 tokenId,
        address visitor
    );

    event TipCreated(
        uint256 indexed tId,
        uint256 tokenId,
        address sender,
        uint256 amount,
        uint256 commi
    );

    event SubscriptionMade(address account);
    event MonthlyPaymentMade(address account);

    constructor() ERC721("Mominter", "Mominter") {
        owner = payable(msg.sender);
    }

    /* Mints a File*/
    function createFile(string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createStorageItem(newTokenId);
        return newTokenId;
    }

    function createStorageItem(uint256 tokenId) private {
        idToStorageItem[tokenId] = StorageItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            block.timestamp,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
        emit StorageItemCreated(
            tokenId,
            msg.sender,
            address(this),
            block.timestamp,
            false
        );
    }

    function createViewItem(uint256 tokenId) public {
        _viewIds.increment();
        uint256 newViewId = _viewIds.current();
        //createViewItem(newViewId, _tokenId);
        idToViewItem[newViewId] = ViewItem(newViewId, tokenId, msg.sender);
        emit ViewItemCreated(newViewId, tokenId, msg.sender);
    }

        function conBalance() public view returns (uint256){
            return address(this).balance;
    }


// tip moment creator
    function tipCreator(uint256 tokenId) public payable { 
        _tipIds.increment();
      // require(msg.value > 0, "Tip must be at least 1 wei");
        console.log(msg.value);
      address creator = idToStorageItem[tokenId].owner;
      address manager = idToStorageItem[tokenId].storageDrive;
       console.log(commission);
      uint256 tip2 =  msg.value;
       console.log(tip);
       console.log(tip2);
      payable(manager).transfer(commission);
      payable(creator).transfer(tip2);
      uint256 bal= address(this).balance;
      console.log(bal);

        emit TipCreated(_tipIds.current(), tokenId, msg.sender, tip2, commission );
    }

    /* Returns all files on drive */
    function fetchAllStorageItems() public view returns (StorageItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 currentIndex = 0;

        StorageItem[] memory items = new StorageItem[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToStorageItem[i + 1].storageDrive == address(this)) {
                uint256 currentId = i + 1;
                StorageItem storage currentItem = idToStorageItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has created   */
    function fetchMyFiles() public view returns (StorageItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToStorageItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        StorageItem[] memory items = new StorageItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToStorageItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                StorageItem storage currentItem = idToStorageItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only one items by token id   */
    function fetchOneNews(uint256 _tokenId)
        public
        view
        returns (StorageItem[] memory)
    {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToStorageItem[i + 1].tokenId == _tokenId) {
                itemCount += 1;
            }
        }

        StorageItem[] memory items = new StorageItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToStorageItem[i + 1].tokenId == _tokenId) {
                uint256 currentId = i + 1;
                StorageItem storage currentItem = idToStorageItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only one items by token id   */
    function fetchViews(uint256 _tokenId) public view returns (uint256) {
        uint256 totalViewCount = _viewIds.current();
        uint256 itemCount = 0;
        //uint currentIndex = 0;

        for (uint256 i = 0; i < totalViewCount; i++) {
            if (idToViewItem[i + 1].tokenId == _tokenId) {
                itemCount += 1;
            }
        }

        return itemCount;
    }

    function subscribe() external payable {
        require(!accounts[msg.sender], "Account already subscribed");
        // require(msg.value == monthly_value, "Wrong value.");

        accounts[msg.sender] = true;
        emit SubscriptionMade(msg.sender);
    }

    function payMonthlyValue() external payable {
        require(accounts[msg.sender], "Account not subscribed");
        require(msg.value == monthly_value, "Wrong value.");

        emit MonthlyPaymentMade(msg.sender);
    }

    function withdraw(uint256 value) external {
        require(msg.sender == owner, "Address is not the owner");
        require(value <= address(this).balance, "Value higher than balance.");

        (bool success, ) = owner.call{value: value}("");
        require(success, "There was an error!");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
