# udacity-supply-chain-with-ethereum-dapp
The documentation in this repository shows how to manage a supply chain solution backed up by the Ethereum platform. This project was created as part of the Blockchain Developer Nanodegree program from Udacity. 

# Author
Pablo Perotti (pablo.perotti@gmail.com)

# Submission information

## Source Code
https://github.com/pperotti/udacity-supply-chain-with-ethereum-dapp.git

## Documentation (Viewer's Permission)

### UML Diagrams
https://drive.google.com/file/d/1lJgK4C2v-iNkPWpHs-WvW99nv_BBM6_f/view?usp=sharing

### Project
https://docs.google.com/document/d/1l5lE4mMfp1YAfyzYwe_2tQe8KvSDTgeE2VlpdBhKPeY/edit?usp=sharing

### PDF Version
Under /documentation folder, you can find a PDF version of all the official documentation. 

## How to Run the Project

### Setup the project

Clone the project from the repo above,
$ git clone https://github.com/pperotti/udacity-supply-chain-with-ethereum-dapp.git

Once that it is completed, move to project/project-6 directory:

$ cd project/project-6

Execute the following commands in 3 different terminals: 
1) Run ganache-cli in the first terminal window
$ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"

1.1) Make sure you add 4 accounts in your Metamask Wallet. I suggest using the ROLE as the name of an account, so at the end of the set up you will end up with 4 accounts: FARMER, DISTRIBUTOR, RETAILER, CONSUMER, all with 100ETH. 

2) Run truffle console in the second terminal window and deploy the contract.
$ truffle console
$ deploy --reset

3) Run WEB SERVER in third terminal window
$ npm run dev

### Test the Supply Chain

1) Open the web page at http://localhost:3000 after selecting your FARMER's account in METAMASK WALLET. 

2) Register your FARMER'S account

3) HARVEST a few items with different UPC (Let's say 100, 101, 102, 103)

4) Execute: PROCESS, PACK, SELL operations. You will observe the item's list is updated along with how you move the items in between the different states. 

5) Move METAMASK WALLET to the DISTRIBUTOR account. 

6) Refresh Web Page (you will observe that you are now back in the registration screen)

7) Register DISTRIBUTOR account 

8) Test BUY & SHIP operations. You can observe now, the options available are BUY and SHIP. 

9) Once you apply both operations, move your METAMASK ACCOUNT to the RETAILER'S account.

10) Refresh Screen. You will be prompt back to the registration screen so you can associate your METAMASK account with the RETAILER'S role. 

11) You can mark the item of your preference as RECEIVED. After that, the item appear on the right. From that moment on, the item is available to be PURCHASED by any CUSTOMER. 

12) Switch your METAMASK WALLET to use a CUSTOMER account. 

13) Refresh Page. You will be prompt back to the registration screen so you can associate your METAMASK ACCOUNT with the CUSTOMER'S role. 

14) Last, but not least, you can not PURCHASE the item. After that, the item will appear on the right. 


NOTE: At any point, regardless of the role, you can query the Supply Chain for details about any UPC. 

### Video Demo @ Youtube (unlisted video)
https://youtu.be/gCFrYVbtpXU

### Run Unit Tests

1) Reset the deployed contract. 
$ truffle(development) deploy --reset

2) Run all tests (make sure you are located in project/project-6 folder)
You will see something like:

```markdown
$ truffle(development) test
Using network 'development'.

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.

ganache-cli accounts used here...
Contract Owner: accounts[0]  0x27D8D15CbC94527cAdf5eC14B69519aE23288B95
Farmer: accounts[1]  0x018C2daBef4904ECbd7118350A0c54DbeaE3549A
Distributor: accounts[2]  0xCe5144391B4aB80668965F2Cc4f2CC102380Ef0A
Retailer: accounts[3]  0x460c31107DD048e34971E57DA2F99f659Add4f02
Consumer: accounts[4]  0xD37b7B8C62BE2fdDe8dAa9816483AeBDBd356088

  Contract: SupplyChain
FARMER ID: 0x018C2daBef4904ECbd7118350A0c54DbeaE3549A SKU: 1 UPC: 100
UPC: 100 LENGTH: 1
SKU: 1
UPC: 100
ORIGIN OWNER ID: 0x018C2daBef4904ECbd7118350A0c54DbeaE3549A
ORIGIN FARMER ID: 0x018C2daBef4904ECbd7118350A0c54DbeaE3549A
ORIGIN FARMER NAME: John Doe
ORIGIN FARMER INFORMATION: Yarray Valley
ORIGIN FARMER LAT: -38.239770
ORIGIN FARMER LON: 144.341490
    ✓ Testing smart contract function harvestItem() that allows a farmer to harvest coffee (619ms)
    ✓ Testing smart contract function processItem() that allows a farmer to process coffee (168ms)
    ✓ Testing smart contract function packItem() that allows a farmer to pack coffee (140ms)
    ✓ Testing smart contract function sellItem() that allows a farmer to sell coffee (140ms)
    ✓ Testing smart contract function buyItem() that allows a distributor to buy coffee (176ms)
    ✓ Testing smart contract function shipItem() that allows a distributor to ship coffee (163ms)
    ✓ Testing smart contract function receiveItem() that allows a retailer to mark coffee received (160ms)
    ✓ Testing smart contract function purchaseItem() that allows a consumer to purchase coffee (143ms)
    ✓ Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain (57ms)
    ✓ Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain
    ✓ Get all items harvested by one particular farmer (70ms)

  11 passing (2s)

```

## Tools information
Truffle v5.2.4 (core: 5.2.4)
Solidity v0.5.16 (solc-js)
Node v15.8.0
Web3.js v1.2.9

## Metamask Address @ Rinkeby 
0x46bC4FfD362198c6ac8524fbee442eFE342C2521

## Contract information 

2_deploy_contracts.js
=====================
   Replacing 'FarmerRole'
   ----------------------
   > transaction hash:    0x03b2f9937f6c095ebb3bc7f559cb2da2c52aba3f3ac357c7effb4ee6d2ca330a
   > Blocks: 1            Seconds: 9
   > contract address:    0xB5B298D3eF4aD066faA92E4F7196AAaf01d822e5
   > block number:        8529764
   > block timestamp:     1620181184
   > account:             0x9626F9786789BAcE23291C099A3d868Cd0ccBDC4
   > balance:             18.56990264
   > gas used:            302766 (0x49eae)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.00302766 ETH


   Replacing 'DistributorRole'
   ---------------------------
   > transaction hash:    0x2e52186c91e3815b90d8df101775cb9ec5320d6dd4ac6352f22b6efe2f446bfc
   > Blocks: 1            Seconds: 9
   > contract address:    0x813F71D13328313cd98729d709799DD16e1D8F97
   > block number:        8529765
   > block timestamp:     1620181199
   > account:             0x9626F9786789BAcE23291C099A3d868Cd0ccBDC4
   > balance:             18.56687486
   > gas used:            302778 (0x49eba)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.00302778 ETH


   Replacing 'RetailerRole'
   ------------------------
   > transaction hash:    0x39bab19877a1add1dd1799b74dcdfb8a21b519c7010fd0effd5cc0afd4637ebf
   > Blocks: 1            Seconds: 9
   > contract address:    0x74939Bd28A298f9a4BD0B8F57AFB123Ba3ed052b
   > block number:        8529766
   > block timestamp:     1620181214
   > account:             0x9626F9786789BAcE23291C099A3d868Cd0ccBDC4
   > balance:             18.56384672
   > gas used:            302814 (0x49ede)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.00302814 ETH


   Replacing 'ConsumerRole'
   ------------------------
   > transaction hash:    0xac3164d23610181e73ece703504c1b218b3c4f37b75ac42c23d95b18e846d73f
   > Blocks: 1            Seconds: 8
   > contract address:    0x47199e08a7ab71Dcd0457EF1Af3703454642AF36
   > block number:        8529767
   > block timestamp:     1620181229
   > account:             0x9626F9786789BAcE23291C099A3d868Cd0ccBDC4
   > balance:             18.56081882
   > gas used:            302790 (0x49ec6)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.0030279 ETH


   Replacing 'SupplyChain'
   -----------------------
   > transaction hash:    0x2dfd5ddb47094ae1b0380841ded10cae3dfb5f5845951a155a62ffe7a633c117
   > Blocks: 1            Seconds: 8
   > contract address:    0x46bC4FfD362198c6ac8524fbee442eFE342C2521
   > block number:        8529768
   > block timestamp:     1620181244
   > account:             0x9626F9786789BAcE23291C099A3d868Cd0ccBDC4
   > balance:             18.51622378
   > gas used:            4459504 (0x440bf0)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.04459504 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.05670652 ETH


Summary
=======
> Total deployments:   6
> Final cost:          0.05897165 ETH

## Rinkeby Information

All the transactions for my wallet (0x9626F9786789BAcE23291C099A3d868Cd0ccBDC4) 

https://rinkeby.etherscan.io/address/0x9626f9786789bace23291c099a3d868cd0ccbdc4

The Contract Details
https://rinkeby.etherscan.io/address/0x46bC4FfD362198c6ac8524fbee442eFE342C2521



