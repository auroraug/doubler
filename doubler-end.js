const {ethers} = require("hardhat");
require("dotenv").config();
const {getPrice} = require('./doubler-getPrice');

const provider = new ethers.providers.WebSocketProvider(
    process.env.ALCHEMY_API_KEY_URL,
    "sepolia"
);
const poolId = 90042
const functionSig = '0x843188ae'
const param = ethers.utils.defaultAbiCoder.encode(['uint256'],[parseInt(poolId)])
const calldata = functionSig+param.substring(2)
console.log(calldata)
let previousBlockNumber = 0;
// loop
async function watchBlockNumberAndCallEnd() {
    while (true) {
      const currentBlockNumber = await provider.getBlockNumber();
      const price = await getPrice('BTC')
      const threshold = 29955.89567373
      if (currentBlockNumber > previousBlockNumber && price >= threshold) {
        await callEndFunction();
        console.log(`Called attack function at block ${currentBlockNumber}.`);
        await sleep(500);
        process.exit(0)
      }else {
        previousBlockNumber = currentBlockNumber;
        console.log(`未达到价格阈值${threshold}, 当前价格${price}, 当前区块${currentBlockNumber}`)
      }
      // relay
      await sleep(500); // 0.5s
    }
  }
  
  // call end function
  async function callEndFunction() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY1,provider);
    const nonce = await wallet.getTransactionCount('latest');
    const gasPrice = await wallet.getGasPrice();

    const tx = {
        nonce: nonce,
        gasPrice: (gasPrice.add(5e9)),
        gasLimit: 3000000,
        to: '0x635ff8246201f0Ba7dC728672CDFfB769DC1c933',
        value: 0,
        data: calldata
    }
    try {
        const response = await wallet.sendTransaction(tx);
        await response.wait()
        console.log('End txhash:',response.hash)
    } catch (error) {
      console.error('An error occurred while calling the attack function:', error);
    }
  }
  
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  watchBlockNumberAndCallEnd()
    .catch((error) => {
      console.error('An error occurred:', error);
    });