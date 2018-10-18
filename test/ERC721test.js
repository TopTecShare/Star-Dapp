const StarNotary = artifacts.require('StarNotary')
contract('StarNotary testing ERC721 functionalities', accounts => { 
    var defaultAccount = accounts[0]
    var user1 = accounts[1]
    var user2 = accounts[2]
    var operator = accounts[3]

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: defaultAccount})
    })

    describe('mint function called ',async function(){

        let tokenId = 12345
        let star_name="star elb"
        let star_story="story"
        let tx 
        
        let Ra="12" // correct Ra
        let Dec="28" // correct Dec
        let Mag="3"
        
        
        beforeEach(async function() { 
            tx = await this.contract.createStar( tokenId,star_name,Ra,Dec,Mag,star_story, {from: user1})
        })

        it('emits the correct event during creation of a new star', async function () { 
            assert.equal(tx.logs[0].event, 'Transfer')
        })


    })

    describe('can transfer token', () => { 
        let tokenId = 12345
        let star_name="star elb"
        let star_story="story"
        let tx 
        
        let Ra="12" // correct Ra
        let Dec="28" // correct Dec
        let Mag="3"
         

        beforeEach(async function () { 
            await await this.contract.createStar( tokenId,star_name,Ra,Dec,Mag,star_story, {from: user1})

            tx = await this.contract.transferFrom(user1, user2, tokenId, {from: user1})
        })

        it('token has new owner', async function () { 
            assert.equal(await this.contract.ownerOf(tokenId), user2)
        })

        it('emits the correct event', async function () { 
            
            assert.equal(tx.logs[0].event, 'Transfer')
            assert.equal(tx.logs[0].args.tokenId, tokenId)
            assert.equal(tx.logs[0].args.to, user2)
            assert.equal(tx.logs[0].args.from, user1)
        })

        it('only permissioned users can transfer tokens', async function() { 
            let randomPersonTryingToStealTokens = accounts[4]

            await expectThrow(this.contract.transferFrom(user1, randomPersonTryingToStealTokens, tokenId, {from: randomPersonTryingToStealTokens}))
        })
    })


    describe('using safetransfer', () => { 
        let tokenId = 12345
        let star_name="star elb"
        let star_story="story"
        let tx 
        
        let Ra="12" // correct Ra
        let Dec="28" // correct Dec
        let Mag="3"
         

        beforeEach(async function () { 
            await await this.contract.createStar( tokenId,star_name,Ra,Dec,Mag,star_story, {from: user1})

            tx = await this.contract.safeTransferFrom(user1, user2, tokenId, {from: user1})
        })

        it('token has new owner', async function () { 
            assert.equal(await this.contract.ownerOf(tokenId), user2)
        })

        it('emits the correct event', async function () { 
            
            assert.equal(tx.logs[0].event, 'Transfer')
            assert.equal(tx.logs[0].args.tokenId, tokenId)
            assert.equal(tx.logs[0].args.to, user2)
            assert.equal(tx.logs[0].args.from, user1)
        })

        it('only permissioned users can transfer tokens', async function() { 
            let randomPersonTryingToStealTokens = accounts[4]

            await expectThrow(this.contract.safeTransferFrom(user1, randomPersonTryingToStealTokens, tokenId, {from: randomPersonTryingToStealTokens}))
        })

       
    })

    describe('can grant approval to transfer', () => { 
        let tokenId = 12345
        let star_name="star elb"
        let star_story="story"
        let tx 
        
        let Ra="12" // correct Ra
        let Dec="28" // correct Dec
        let Mag="3"
         

        beforeEach(async function () { 
             await this.contract.createStar( tokenId,star_name,Ra,Dec,Mag,star_story, {from: user1})

            tx = await this.contract.approve(user2, tokenId, {from: user1})
        })
        

        it('set user2 as an approved address', async function () { 
            assert.equal(await this.contract.getApproved(tokenId), user2)
        })

        it('user2 can now transfer', async function () { 
            await this.contract.transferFrom(user1, user2, tokenId, {from: user2})

            assert.equal(await this.contract.ownerOf(tokenId), user2)
        })

        it('emits the correct event', async function () { 
            assert.equal(tx.logs[0].event, 'Approval')
        })
    })

    describe('can set an operator', () => { 
        let tokenId = 12345
        let star_name="star elb"
        let star_story="story"
        let tx 
        
        let Ra="12" // correct Ra
        let Dec="28" // correct Dec
        let Mag="3"

        beforeEach(async function () { 
            await this.contract.createStar( tokenId,star_name,Ra,Dec,Mag,star_story, {from: user1})

            tx = await this.contract.setApprovalForAll(operator, true, {from: user1})
        })

        it('can set an operator', async function () { 
            assert.equal(await this.contract.isApprovedForAll(user1, operator), true)
        })
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



 

 

