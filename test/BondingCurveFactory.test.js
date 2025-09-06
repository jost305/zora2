const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("BondingCurveFactory", () => {
  let factory
  let owner, creator, platform
  let deploymentFee

  beforeEach(async () => {
    ;[owner, creator, platform] = await ethers.getSigners()

    const BondingCurveFactory = await ethers.getContractFactory("BondingCurveFactory")
    factory = await BondingCurveFactory.deploy(platform.address)
    await factory.waitForDeployment()

    deploymentFee = await factory.deploymentFee()
  })

  describe("Deployment", () => {
    it("Should set the correct platform address", async () => {
      expect(await factory.platform()).to.equal(platform.address)
    })

    it("Should set the correct deployment fee", async () => {
      expect(deploymentFee).to.equal(ethers.parseEther("0.001"))
    })
  })

  describe("Content coin deployment", () => {
    it("Should deploy content coin and exchange", async () => {
      const tx = await factory
        .connect(creator)
        .deployContentCoin("Test Content", "TEST", "ipfs://test-hash", { value: deploymentFee })

      await expect(tx).to.emit(factory, "ContentCoinDeployed")
    })

    it("Should require deployment fee", async () => {
      await expect(
        factory.connect(creator).deployContentCoin("Test Content", "TEST", "ipfs://test-hash", { value: 0 }),
      ).to.be.revertedWith("Insufficient deployment fee")
    })

    it("Should track deployed coins", async () => {
      await factory
        .connect(creator)
        .deployContentCoin("Test Content", "TEST", "ipfs://test-hash", { value: deploymentFee })

      const creatorCoins = await factory.getCreatorCoins(creator.address)
      expect(creatorCoins.length).to.equal(1)

      const totalCoins = await factory.getCoinCount()
      expect(totalCoins).to.equal(1)
    })
  })

  describe("Admin functions", () => {
    it("Should allow owner to update deployment fee", async () => {
      const newFee = ethers.parseEther("0.002")

      await factory.connect(owner).setDeploymentFee(newFee)

      expect(await factory.deploymentFee()).to.equal(newFee)
    })

    it("Should allow owner to update platform address", async () => {
      const [, , , newPlatform] = await ethers.getSigners()

      await factory.connect(owner).setPlatform(newPlatform.address)

      expect(await factory.platform()).to.equal(newPlatform.address)
    })
  })
})
