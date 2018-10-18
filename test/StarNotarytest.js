const StarNotary = artifacts.require('StarNotary')
contract('StarNotary', accounts => { 
    var defaultAccount = accounts[0]
    var user1 = accounts[1]
    var user2 = accounts[2]
    var operator = accounts[3]

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: defaultAccount})
    })

     

    describe('Create Satr and emit create event ', () => { 
        let tokenId = 12345
        let star_name="star elb"
        let star_story="story"
        let tx 
        let s 
        let Ra="12" // correct Ra
        let Dec="28" // correct Dec
        let Ra_not="1.2" //used to test checkifexist function in case coordinates not exist
        let star
        
        beforeEach(async function() { 
            tx = await this.contract.createStar( tokenId,"star","12","28","3","story", {from: user1})
        })

        it('create start ', async function () { 
            await this.contract.tokenIdToStarInfo  (tokenId)
            star= await this.contract.tokenIdToStarInfo(tokenId)
            assert.equal(star[0],"star")
            assert.equal(star[1],"story")
           // assert.equal(star[2],"story")

           
        })

        it('create start using exist tokenid ', async function () { 


            await expectThrow(this.contract.createStar( tokenId,"star","1222","2228","3","story", {from: user1}))

              
             
        })

        it('emits the correct event (CreateStar', async function () { 
            assert.equal(tx.logs[1].event, 'CreateStar')
            assert.equal(tx.logs[1].args._tokenId.toNumber(), tokenId)
            assert.equal(tx.logs[1].args._from, user1)
        })

        it('is Exist coordinates',async function(){
            //await this.contract.createStar(tokenId, "star","12","28","3","story", {from: user1})
            exist=await this.contract.checkIfStarExist(Ra.toString(),Dec.toString()) 
             assert(exist,"Star Coordinates exist")


        })

        it('is  not Exist coordinates',async function(){
            //await this.contract.createStar(tokenId, "star","12","28","3","story", {from: user1})
            exist=await this.contract.checkIfStarExist(Ra_not.toString(),Dec.toString()) 
             assert(!exist,"Star Coordinates not exist")


        })

         
    })
    describe('buying and selling stars', () =>{

        let starId = 1
        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function () {
             await this.contract.createStar( starId,"star","12","28","3","story", {from: user1})
        })

        describe('user1 can sell a star and list stars for sell', () => { 
            it('user1 can put up their star for sale', async function () { 

                
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            
                assert.equal(await this.contract.StarForSale_Price(starId) , starPrice)
                 


               //await expectThrow(this.contract.putStarUpForSale(1, 1, {from: user1}))
            })

            it('user1 gets the funds after selling a star', async function () { 
                let starPrice = web3.toWei(.05, 'ether')
                
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})

                 let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
                 //console.log(balanceOfUser1BeforeTransaction.toNumber())
                 await this.contract.buyStar(starId, {from: user2, value: starPrice})
                let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)

                assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), 
                            balanceOfUser1AfterTransaction.toNumber())
            })


            it('lists stars  for sale tokenid', async function () { 

                let starId1=4
                let starId2=5
                await this.contract.createStar( starId1,"star1","1","28","3","story1", {from: user1})
                await this.contract.createStar( starId2,"star2","2","28","3","story2", {from: user2})


                await this.contract.putStarUpForSale(starId1, starPrice, {from: user1})
                await this.contract.putStarUpForSale(starId2, starPrice, {from: user2})


                 let starsTokenids=await this.contract.starsForSale()

                 

                
            
                 assert.equal(starsTokenids[0] , starId1)
                 assert.equal(starsTokenids[1] , starId2)

                 


               //await expectThrow(this.contract.putStarUpForSale(1, 1, {from: user1}))
            })



    })

    describe('user2 can buy a star that was put up for sale', () => { 
        beforeEach(async function () { 
            await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
        })

        it('user2 is the owner of the star after they buy it', async function () { 
            await this.contract.buyStar(starId, {from: user2, value: starPrice})

            assert.equal(await this.contract.ownerOf(starId), user2)
        })

        it('user2 correctly has their balance changed', async function () { 
            let overpaidAmount = web3.toWei(.05, 'ether')

            const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
            await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice:0})
            const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)

            assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice)
        })
    })

    




    
})

describe('',async function(){


    
})

})
var expectThrow = async function(promise) { 
    try { 
        await promise
    } catch (error) { 
        assert.exists(error)
        return
    }

    assert.fail('Expected an error but didnt see one!')
}