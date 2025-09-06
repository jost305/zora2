const hre = require("hardhat")

async function main() {
  // Load deployment info
  const network = hre.network.name
  const deploymentFile = `./deployments/${network}.json`

  let deploymentInfo
  try {
    deploymentInfo = require(`../${deploymentFile}`)
  } catch (error) {
    console.error(`Deployment file not found: ${deploymentFile}`)
    console.log("Please run deployment first with: npm run deploy:sepolia")
    process.exit(1)
  }

  const FACTORY_ADDRESS = deploymentInfo.contracts.BondingCurveFactory

  console.log("Creating test Content Coin...")
  console.log("Factory address:", FACTORY_ADDRESS)

  const [deployer] = await hre.ethers.getSigners()
  console.log("Creating coin with account:", deployer.address)

  // Get factory contract
  const BondingCurveFactory = await hre.ethers.getContractFactory("BondingCurveFactory")
  const factory = BondingCurveFactory.attach(FACTORY_ADDRESS)

  // Get deployment fee
  const deploymentFee = await factory.deploymentFee()
  console.log("Deployment fee:", hre.ethers.formatEther(deploymentFee), "ETH")

  // Deploy test content coin
  const tx = await factory.deployContentCoin(
    "Test Music Track",
    "MUSIC1",
    "ipfs://QmTestHash123456789", // Replace with actual IPFS hash
    { value: deploymentFee },
  )

  const receipt = await tx.wait()
  console.log("Transaction hash:", tx.hash)

  // Get the deployed addresses from events
  const event = receipt.logs.find((log) => {
    try {
      return factory.interface.parseLog(log).name === "ContentCoinDeployed"
    } catch {
      return false
    }
  })

  if (event) {
    const parsedEvent = factory.interface.parseLog(event)
    console.log("✅ Content Coin deployed successfully!")
    console.log("Content Coin address:", parsedEvent.args.coin)
    console.log("Exchange address:", parsedEvent.args.exchange)
    console.log("Creator:", parsedEvent.args.creator)
    console.log("Symbol:", parsedEvent.args.symbol)

    // Update frontend environment variable suggestion
    console.log("\n📝 Add this to your .env.local file:")
    console.log(`NEXT_PUBLIC_FACTORY_ADDRESS=${FACTORY_ADDRESS}`)
  } else {
    console.log("❌ Could not find ContentCoinDeployed event")
  }

  console.log("\n🎉 Test coin creation completed!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
