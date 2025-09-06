const hre = require("hardhat")

async function main() {
  console.log("🧪 Running integration tests...\n")

  // Load deployment info
  const network = hre.network.name
  const deploymentFile = `./deployments/${network}.json`

  let deploymentInfo
  try {
    deploymentInfo = require(`../${deploymentFile}`)
  } catch (error) {
    throw new Error(`Deployment file not found: ${deploymentFile}. Run deployment first.`)
  }

  const factoryAddress = deploymentInfo.contracts.BondingCurveFactory
  console.log("Testing factory at:", factoryAddress)

  // Get signers
  const [deployer, creator, trader1, trader2] = await hre.ethers.getSigners()

  // Get factory contract
  const BondingCurveFactory = await hre.ethers.getContractFactory("BondingCurveFactory")
  const factory = BondingCurveFactory.attach(factoryAddress)

  console.log("👤 Test accounts:")
  console.log("  Deployer:", deployer.address)
  console.log("  Creator:", creator.address)
  console.log("  Trader 1:", trader1.address)
  console.log("  Trader 2:", trader2.address)

  // Test 1: Deploy content coin
  console.log("\n📦 Test 1: Deploying content coin...")
  const deploymentFee = await factory.deploymentFee()

  const tx = await factory
    .connect(creator)
    .deployContentCoin("Integration Test Coin", "ITEST", "ipfs://QmIntegrationTest123", { value: deploymentFee })

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

  console.log("✅ Content coin deployed:")
  console.log("  Coin:", coinAddress)
  console.log("  Exchange:", exchangeAddress)

  // Get contract instances
  const ContentCoin = await hre.ethers.getContractFactory("ContentCoin")
  const contentCoin = ContentCoin.attach(coinAddress)

  const BondingCurveExchange = await hre.ethers.getContractFactory("BondingCurveExchange")
  const exchange = BondingCurveExchange.attach(exchangeAddress)

  // Test 2: Buy tokens
  console.log("\n💰 Test 2: Buying tokens...")
  const buyAmount = hre.ethers.parseEther("0.1")

  const initialPrice = await exchange.getCurrentPrice()
  console.log("Initial price:", hre.ethers.formatEther(initialPrice), "ETH")

  await exchange.connect(trader1).buy({ value: buyAmount })

  const trader1Balance = await contentCoin.balanceOf(trader1.address)
  const newPrice = await exchange.getCurrentPrice()

  console.log("✅ Purchase successful:")
  console.log("  Tokens received:", hre.ethers.formatEther(trader1Balance))
  console.log("  New price:", hre.ethers.formatEther(newPrice), "ETH")

  // Test 3: Multiple trades
  console.log("\n🔄 Test 3: Multiple trades...")

  // Trader 2 buys
  await exchange.connect(trader2).buy({ value: hre.ethers.parseEther("0.05") })
  const trader2Balance = await contentCoin.balanceOf(trader2.address)

  // Trader 1 sells half
  const sellAmount = trader1Balance / 2n
  await exchange.connect(trader1).sell(sellAmount)

  const finalPrice = await exchange.getCurrentPrice()
  const marketCap = await exchange.getMarketCap()
  const totalVolume = await exchange.totalVolume()

  console.log("✅ Multiple trades completed:")
  console.log("  Final price:", hre.ethers.formatEther(finalPrice), "ETH")
  console.log("  Market cap:", hre.ethers.formatEther(marketCap), "ETH")
  console.log("  Total volume:", hre.ethers.formatEther(totalVolume), "ETH")

  // Test 4: Fee withdrawal
  console.log("\n💸 Test 4: Fee withdrawal...")

  const creatorFeesBefore = await exchange.creatorFees()
  console.log("Creator fees available:", hre.ethers.formatEther(creatorFeesBefore), "ETH")

  if (creatorFeesBefore > 0) {
    await exchange.connect(creator).withdrawCreatorFees()
    const creatorFeesAfter = await exchange.creatorFees()
    console.log("✅ Creator fees withdrawn, remaining:", hre.ethers.formatEther(creatorFeesAfter), "ETH")
  }

  // Test 5: Factory stats
  console.log("\n📊 Test 5: Factory statistics...")

  const totalCoins = await factory.getCoinCount()
  const creatorCoins = await factory.getCreatorCoins(creator.address)

  console.log("✅ Factory stats:")
  console.log("  Total coins deployed:", totalCoins.toString())
  console.log("  Creator's coins:", creatorCoins.length)

  console.log("\n🎉 All integration tests passed!")

  return {
    factoryAddress,
    coinAddress,
    exchangeAddress,
    testResults: {
      deployment: true,
      trading: true,
      fees: true,
      statistics: true,
    },
  }
}

main()
  .then((results) => {
    console.log("\n✨ Integration testing completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Integration tests failed:")
    console.error(error)
    process.exit(1)
  })
