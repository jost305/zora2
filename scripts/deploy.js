const hre = require("hardhat")

async function main() {
  console.log("Deploying Zora Clone contracts...")

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)

  // Deploy BondingCurveFactory
  const BondingCurveFactory = await hre.ethers.getContractFactory("BondingCurveFactory")
  const factory = await BondingCurveFactory.deploy(deployer.address) // Platform address

  await factory.waitForDeployment()
  const factoryAddress = await factory.getAddress()

  console.log("BondingCurveFactory deployed to:", factoryAddress)

  // Verify deployment
  console.log("Verifying deployment...")
  const deploymentFee = await factory.deploymentFee()
  const platform = await factory.platform()

  console.log("Deployment fee:", hre.ethers.formatEther(deploymentFee), "ETH")
  console.log("Platform address:", platform)

  console.log("\nDeployment completed successfully!")
  console.log("Factory Address:", factoryAddress)

  return {
    factory: factoryAddress,
    deployer: deployer.address,
  }
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
