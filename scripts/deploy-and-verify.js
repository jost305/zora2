const hre = require("hardhat")
const fs = require("fs")
const path = require("path")

async function main() {
  console.log("🚀 Starting Zora Clone deployment...\n")

  // Get network info
  const network = hre.network.name
  const chainId = hre.network.config.chainId
  console.log(`Network: ${network} (Chain ID: ${chainId})`)

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners()
  const deployerBalance = await hre.ethers.provider.getBalance(deployer.address)

  console.log("Deployer address:", deployer.address)
  console.log("Deployer balance:", hre.ethers.formatEther(deployerBalance), "ETH\n")

  // Check minimum balance
  const minBalance = hre.ethers.parseEther("0.01")
  if (deployerBalance < minBalance) {
    throw new Error(`Insufficient balance. Need at least 0.01 ETH, have ${hre.ethers.formatEther(deployerBalance)} ETH`)
  }

  // Deploy BondingCurveFactory
  console.log("📦 Deploying BondingCurveFactory...")
  const BondingCurveFactory = await hre.ethers.getContractFactory("BondingCurveFactory")
  const factory = await BondingCurveFactory.deploy(deployer.address)

  console.log("⏳ Waiting for deployment confirmation...")
  await factory.waitForDeployment()
  const factoryAddress = await factory.getAddress()

  console.log("✅ BondingCurveFactory deployed to:", factoryAddress)

  // Verify deployment
  console.log("\n🔍 Verifying deployment...")
  const deploymentFee = await factory.deploymentFee()
  const platform = await factory.platform()

  console.log("Deployment fee:", hre.ethers.formatEther(deploymentFee), "ETH")
  console.log("Platform address:", platform)

  // Test deployment by creating a sample content coin
  console.log("\n🧪 Testing deployment with sample content coin...")
  try {
    const tx = await factory.deployContentCoin("Test Content Coin", "TEST", "ipfs://QmTestHash123", {
      value: deploymentFee,
    })

    const receipt = await tx.wait()
    const event = receipt.logs.find((log) => {
      try {
        return factory.interface.parseLog(log).name === "ContentCoinDeployed"
      } catch {
        return false
      }
    })

    if (event) {
      const parsedEvent = factory.interface.parseLog(event)
      console.log("✅ Test content coin deployed:")
      console.log("  - Coin address:", parsedEvent.args.coin)
      console.log("  - Exchange address:", parsedEvent.args.exchange)
    }
  } catch (error) {
    console.log("❌ Test deployment failed:", error.message)
  }

  // Save deployment info
  const deploymentInfo = {
    network: network,
    chainId: chainId,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      BondingCurveFactory: factoryAddress,
    },
    config: {
      deploymentFee: hre.ethers.formatEther(deploymentFee),
      platformAddress: platform,
    },
  }

  const deploymentsDir = path.join(__dirname, "..", "deployments")
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir)
  }

  const deploymentFile = path.join(deploymentsDir, `${network}.json`)
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2))

  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`)

  // Contract verification on Etherscan (if not localhost)
  if (network !== "localhost" && network !== "hardhat") {
    console.log("\n🔗 Verifying contracts on block explorer...")
    try {
      await hre.run("verify:verify", {
        address: factoryAddress,
        constructorArguments: [deployer.address],
      })
      console.log("✅ Contract verified successfully")
    } catch (error) {
      console.log("❌ Verification failed:", error.message)
    }
  }

  console.log("\n🎉 Deployment completed successfully!")
  console.log("Factory Address:", factoryAddress)
  console.log("\nNext steps:")
  console.log("1. Update your frontend environment variables:")
  console.log(`   NEXT_PUBLIC_FACTORY_ADDRESS=${factoryAddress}`)
  console.log("2. Fund the deployer account for ongoing operations")
  console.log("3. Test the application with the deployed contracts")

  return deploymentInfo
}

// Handle errors gracefully
main()
  .then((deploymentInfo) => {
    console.log("\n✨ All done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Deployment failed:")
    console.error(error)
    process.exit(1)
  })
