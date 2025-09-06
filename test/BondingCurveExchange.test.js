const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("BondingCurveExchange", () => {
  let factory, contentCoin, exchange
  let owner, creator, platform, buyer, seller
  let deploymentFee

  beforeEach(async () => {
    ;[owner, creator, platform, buyer, seller] = await ethers.getSigners()

    // Deploy factory
    const BondingCurveFactory = await ethers.getContractFactory("BondingCurveFactory")
    factory = await BondingCurveFactory.deploy(platform.address)
    await factory.waitForDeployment()

    deploymentFee = await factory.deploymentFee()

    // Deploy content coin through factory
    const tx = await factory
      .connect(creator)
      .deployContentCoin("Test Content", "TEST", "ipfs://test-hash", { value: deploymentFee })

    const receipt = await tx.wait()
    const event = receipt.logs.find((log) => {
      try {
        return factory.interface.parseLog(log).name === "ContentCoinDeployed"
      } catch {
        return false
      }
    })

    const parsedEvent = factory.interface.parseLog(event)
    const coinAddress = parsedEvent.args.coin
    const exchangeAddress = parsedEvent.args.exchange

    // Get contract instances
    const ContentCoin = await ethers.getContractFactory("ContentCoin")
    contentCoin = ContentCoin.attach(coinAddress)

    const BondingCurveExchange = await ethers.getContractFactory("BondingCurveExchange")
    exchange = BondingCurveExchange.attach(exchangeAddress)
  })

  describe("Deployment", () => {
    it("Should set the correct creator and platform", async () => {
      expect(await exchange.creator()).to.equal(creator.address)
      expect(await exchange.platform()).to.equal(platform.address)
    })

    it("Should have correct initial price", async () => {
      const initialPrice = await exchange.getCurrentPrice()
      expect(initialPrice).to.equal(ethers.parseEther("0.001"))
    })
  })

  describe("Buying tokens", () => {
    it("Should allow buying tokens with ETH", async () => {
      const ethAmount = ethers.parseEther("0.1")

      await expect(exchange.connect(buyer).buy({ value: ethAmount })).to.emit(exchange, "TokensBought")

      const balance = await contentCoin.balanceOf(buyer.address)
      expect(balance).to.be.gt(0)
    })

    it("Should increase price after purchase", async () => {
      const initialPrice = await exchange.getCurrentPrice()

      await exchange.connect(buyer).buy({ value: ethers.parseEther("0.1") })

      const newPrice = await exchange.getCurrentPrice()
      expect(newPrice).to.be.gt(initialPrice)
    })

    it("Should distribute fees correctly", async () => {
      const ethAmount = ethers.parseEther("1.0")

      await exchange.connect(buyer).buy({ value: ethAmount })

      const creatorFees = await exchange.creatorFees()
      const platformFees = await exchange.platformFees()

      expect(creatorFees).to.be.gt(0)
      expect(platformFees).to.be.gt(0)
    })
  })

  describe("Selling tokens", () => {
    beforeEach(async () => {
      // Buy some tokens first
      await exchange.connect(buyer).buy({ value: ethers.parseEther("1.0") })
    })

    it("Should allow selling tokens", async () => {
      const tokenBalance = await contentCoin.balanceOf(buyer.address)
      const sellAmount = tokenBalance / 2n

      await expect(exchange.connect(buyer).sell(sellAmount)).to.emit(exchange, "TokensSold")
    })

    it("Should decrease price after sale", async () => {
      const initialPrice = await exchange.getCurrentPrice()
      const tokenBalance = await contentCoin.balanceOf(buyer.address)

      await exchange.connect(buyer).sell(tokenBalance / 2n)

      const newPrice = await exchange.getCurrentPrice()
      expect(newPrice).to.be.lt(initialPrice)
    })
  })

  describe("Fee withdrawal", () => {
    beforeEach(async () => {
      // Generate some fees
      await exchange.connect(buyer).buy({ value: ethers.parseEther("1.0") })
    })

    it("Should allow creator to withdraw fees", async () => {
      const initialBalance = await ethers.provider.getBalance(creator.address)

      await exchange.connect(creator).withdrawCreatorFees()

      const finalBalance = await ethers.provider.getBalance(creator.address)
      expect(finalBalance).to.be.gt(initialBalance)
    })

    it("Should allow platform to withdraw fees", async () => {
      const initialBalance = await ethers.provider.getBalance(platform.address)

      await exchange.connect(platform).withdrawPlatformFees()

      const finalBalance = await ethers.provider.getBalance(platform.address)
      expect(finalBalance).to.be.gt(initialBalance)
    })
  })
})
