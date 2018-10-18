pragma solidity ^0.4.23;

import '../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

import "./stringLib.sol"; // string library to implement string concatinations and based on https://github.com/willitscale/learning-solidity/blob/master/tutorial-07/Strings.sol
contract StarNotary is ERC721 { 
    using Strings for string;
    
   
    struct Star { //Star metadata
        string name;
        string Ra;
        string Dec;
        string Mag;
        string Story;
    }
    //uint256  private _starsCount;  //counter to help looping TokenID to Star Info mapping as there is no way to know the length of the mapping
    mapping(uint256 => Star) private _TokenIdToStarInfo; //mapping tokenid for star info 
    mapping(uint256 => uint256) private _starsForSale; //mapping star tokenid to a price
    mapping(uint256 => uint256) private _starsForSaleIndex; // maaping to track the index of star for sale tokenid  in starsforsale array 

    uint256[] private _starsForSale_TokenId;
    uint256[] private _starTokenIdIndex; //an array to hold tokenid for all stars for sale to easy track and return 
    



    event CreateStar(address indexed _from,  uint256 indexed _tokenId);

    event Log(string indexed _Ra,  string indexed _Dec);
    function getCount() public view returns(uint256){
        return _starTokenIdIndex.length;
    }
    //uint256[] star_TokenId;




// comparring strings not easy task and this function is a helper function  
    function compareStrings (string a, string b) view returns (bool){
       return keccak256(a) == keccak256(b);
            }
     function createStar(uint256 _Token_ID,string _name, string _Ra,string _Dec,string _Mag,string _story) public  returns(uint256) { 
        
         require(!_exists(_Token_ID),"this Token ID is exist");
        
            assert(!checkIfStarExist(_Ra,_Dec)); // assert if coordinates  exist
             Star memory newStar = Star(_name,_Ra,_Dec,_Mag,_story);
             _TokenIdToStarInfo[_Token_ID] = newStar;
             _starTokenIdIndex.push(_Token_ID);                      
            _mint(msg.sender,_Token_ID); // mint new token using ERC721 token
            emit CreateStar(msg.sender,_Token_ID);
            

           
 
    
     }
    function checkIfStarExist( string _Ra ,string _Dec ) public view  returns(bool){ 
        //return boolean true if the coordinates exist and false if not

         

for (uint i=0;i<_starTokenIdIndex.length;i++) {
                Star memory star = _TokenIdToStarInfo[_starTokenIdIndex[i]]; 
                bool D;
                bool R; 
                D=compareStrings(star.Dec,_Dec);
                R=compareStrings(star.Ra,_Ra);

                if (D && R) 
                 
                   { return true;}


                }
                
                 
                   
                    
          


            
            return false;
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {

        //implementation to put star for sale

        require(this.ownerOf(_tokenId) == msg.sender);//requires the owner to put the star for sale

        _starsForSale[_tokenId] = _price;// seling price
        _starsForSale_TokenId.push(_tokenId); // pushing star's for sale tokenid into array for easy track and retrive all stars  tokenid
        _starsForSaleIndex[_tokenId]=_starsForSale_TokenId.length; //this mapping used to track the index of tokenid for easy removing from array and its value = index +1 to avoid mistaken by default value for mapping =0 even if no mapping exist
    }

    function buyStar(uint256 _tokenId) public payable { 
        // implentation for buy star function
        
        require(_starsForSale[_tokenId] > 0); //require star for sale has a price greater than 0

        
        uint256 starCost = _starsForSale[_tokenId]; //selling price
        address starOwner = this.ownerOf(_tokenId); // star owner
        require(msg.value >= starCost); //buy only if amount >= price

        _removeTokenFrom(starOwner, _tokenId); // remove ownership for tokenid from original owner
        _addTokenTo(msg.sender, _tokenId);// giving the ownership for tokenid to the new owner "the buyer"
        
        starOwner.transfer(starCost);//transfer the cost to the owner

        if(msg.value > starCost) { //if the buying greater than price return the remaining to the buyer
            msg.sender.transfer(msg.value - starCost);
        }
        

        uint256 TokenID_index; 
        uint256 lastTokenId;

        if (_starsForSale_TokenId.length==1){

            TokenID_index=_starsForSaleIndex[_tokenId]-1;
        _starsForSale[_tokenId] =0; //reseting the star price to remove it from stars for sale mapping (step 1)
        _remove_from_array(TokenID_index,_starsForSale_TokenId);// remove tokenid from starsforsale array (step 2)
        _starsForSaleIndex[_tokenId]=0;// reseting tokenid index tracking  (step 4)
        
        //_starsForSale[_starsForSale_TokenId[TokenID_index]]=TokenID_index+1;

        }else {

            lastTokenId=_starsForSale_TokenId[_starsForSale_TokenId.length-1];

            TokenID_index=_starsForSaleIndex[_tokenId]-1;
        _starsForSale[_tokenId] =0; //reseting the star price to remove it from stars for sale mapping (step 1)
        _remove_from_array(TokenID_index,_starsForSale_TokenId);// remove tokenid from starsforsale array (step 2)
        _starsForSaleIndex[_tokenId]=0;// reseting tokenid index tracking  (step 4)
        
        _starsForSale[_starsForSale_TokenId[TokenID_index]]=TokenID_index+1;


        }
        TokenID_index=_starsForSaleIndex[_tokenId]-1;
        _starsForSale[_tokenId] =0; //reseting the star price to remove it from stars for sale mapping (step 1)
        _remove_from_array(TokenID_index,_starsForSale_TokenId);// remove tokenid from starsforsale array (step 2)
        _starsForSaleIndex[_tokenId]=0;// reseting tokenid index tracking  (step 4)
        
        _starsForSale[lastTokenId]=TokenID_index+1;
        /*
                after buying complete 
                1 reset star price in mapping
                2 remove star token id from _starsForsale_tokenid array 
                3 reset _starForSaleIndex mapping to zero
                4 update _starForSaleIndex mapping for last array _starForsale_tokenid with removed lement index
            */

        /* 
        
        TokenID_index=_starsForSaleIndex[_tokenId]-1;
        _starsForSale[_tokenId] =0; //reseting the star price to remove it from stars for sale mapping (step 1)
        _remove_from_array(TokenID_index,_starsForSale_TokenId);// remove tokenid from starsforsale array (step 2)
        _starsForSaleIndex[_tokenId]=0;// reseting tokenid index tracking  (step 4)
        
        _starsForSale[_starsForSale_TokenId[TokenID_index]]=TokenID_index+1;// updating mapping for last element (step 4)
       */
    }

    function tokenIdToStarInfo(uint256 _tokenId) public view  returns(string,string,string,string,string){
        Star memory star = _TokenIdToStarInfo[_tokenId];

        // strings to be used for concatinations
        string memory ra; 
        string memory dec;
        string memory mag;
        ra="ra_";
        dec="dec_";
        mag="mag_";

         return (star.name,star.Story,ra.concat(star.Ra),dec.concat(star.Dec),mag.concat(star.Mag));

        //return (star.name,star.Story, (star.Ra), (star.Dec),mag.concat(star.Mag));

    }
// helper function to remove item from array and replace it by last item in the array and returs updated  array
    function _remove_from_array(uint256 index ,uint256[] storage array) internal    returns(uint256[]) {

        
        if (index >= array.length) return;

        uint256 element = array[index];
        uint256 lastindex=array.length - 1;
        array[index] = array[lastindex];
        delete array[lastindex];
        array.length--;

       
        return array;
    }
    function starsForSale() public  view  returns(uint256 []) {
        
        


        return _starsForSale_TokenId;}

    function StarForSale_Price(uint256 _Token_ID) public view returns(uint256){

        return _starsForSale[_Token_ID];
    }


}