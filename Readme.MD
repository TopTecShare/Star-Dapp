# Star-Notary-Service Dapp
	This is a simple project to implment star notary on etheruem  rinkeby test network using ERC721 token standrad 

## Prerequisites Packages
   - Expressjs   (to run client interface "index.html")
   - openzeppelin-solidity 
   - truflle (for local testing and deployment )
   
## Install command
  to install prerequisites   run  `npm install`	
## Start command
  to start the application run   `node server.js`
## server.js
   this is the starting script to start the server at defined port ,in this project port is 8080


## Contract address
   0x27045ae60b38222337aea3b0ef8cbce7124c2b50
## Transaction ID
   0x76029663a04d62d626984103d6fd12bc610595346319ddf18035d309d66989f0
## Stars for Sale Token ID
   - 1540024592710
   - 1540019896855

## Note regarding sell and buy implemntation
   - first when putting a star for sale after verifying the owner ,need to check if this star is already putted for sale before to avoid returning same token id duplicated and only updates the price for last one
   - second buying using only mapping between tokenid and price will not give the ability to get all stars for sale token ids
     - in this implmentation we have a mapping _starsForSale (maps tokenid to its price . zero value is a reset value)
     - in case the star price is zero we mapp the price to the tokenid
     - we push tokenid into _starsForSale_TokenId which used to track all token ids for stars for sale
     - then we mapp the index+1 for pushed tokeid into _starsForSaleIndex ,and this mapping is used to reduce the looping through to search for a given tokenid 
     - if the value of mapping _starsForSale not zero means this tokenid is already had price and we need only to change the price 
     - after successfull buying we remove tokenid from the  _starsForSale_TokenId array so this tokenid no longer retruned as a token id for sale
     
    


   
    
