const { ethers } = require("hardhat");
require("dotenv").config();

const provider = new ethers.providers.WebSocketProvider(
    process.env.ALCHEMY_API_KEY_URL,
    "sepolia"
);
const Provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_API_KEY_URL,
    "sepolia"
  );
const signer = new ethers.Wallet(process.env.PRIVATE_KEY1, provider);
// approve ERC20 contract address
const linkAddr = '0xcd97aa0Fce06A359489429984376FD78d42f527A'
const ethAddr = '0x1629D7D8E39A0747677BFbF61c7643F112037B40'
const snxAddr = '0x24eCe36071BbfFCfA6E0BbE98B76612e06c0220D'
const btcAddr = '0x8343e1D4C80a29b77cf9F8f6Cb98b62BC0FB93D7'
  
const approval = ethers.utils.parseEther('1000000') //Units * Unit Size i.e. 200 * 0.0098 = 1.96
const params = ['0x635ff8246201f0ba7dc728672cdffb769dc1c933',approval]
const calldata = ethers.utils.defaultAbiCoder.encode(['address','uint256'],params)
const approveHexdata = '0x095ea7b3'+calldata.substring(2)

async function approve() {
      const nonce = await provider.getTransactionCount(signer.address, 'latest');
      let gasPrice = await provider.getGasPrice();
      console.log('gwei:',ethers.utils.formatUnits(gasPrice,9))

      const tx1 = {
          nonce: nonce,
          gasPrice: (gasPrice.add(1e8)),
          gasLimit: 3000000,
          to: linkAddr,
          value: 0,
          data: approveHexdata,
      };
      const tx2 = {
          nonce: nonce+1,
          gasPrice: (gasPrice.add(1e8)),
          gasLimit: 3000000,
          to: ethAddr,
          value: 0,
          data: approveHexdata,
      };
      const tx3 = {
          nonce: nonce+2,
          gasPrice: (gasPrice.add(1e8)),
          gasLimit: 3000000,
          to: snxAddr,
          value: 0,
          data: approveHexdata,
      };
      const tx4 = {
          nonce: nonce+3,
          gasPrice: (gasPrice.add(1e8)),
          gasLimit: 3000000,
          to: btcAddr,
          value: 0,
          data: approveHexdata,
      };
      try{
          // Send four transactions in parallel and wait for confirmation
          const [approveResponse1,approveResponse2,approveResponse3,approveResponse4] = await Promise.all([
              signer.sendTransaction(tx1),
              signer.sendTransaction(tx2),
              signer.sendTransaction(tx3),
              signer.sendTransaction(tx4),
          ]);

          await Promise.all([
              approveResponse1.wait(),
              approveResponse2.wait(),
              approveResponse3.wait(),
              approveResponse4.wait(),
          ]);

          // console.log('Approved Transaction Hash:', approveResponse.hash);
          console.log('Approve Transaction Hash:', approveResponse1.hash,approveResponse2.hash,approveResponse3.hash,approveResponse4.hash);
          await sleep(1000) // wait 1 second
          process.exit(0);
      } catch (error) {
          console.error('Error:', error);
          process.exit(1);
      }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

approve();
