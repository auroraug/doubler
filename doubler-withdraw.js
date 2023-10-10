const {ethers} = require("hardhat");
require("dotenv").config();
const {remove,getBValueByAValue} = require("./doublerLog");

const provider = new ethers.providers.WebSocketProvider(
    process.env.ALCHEMY_API_KEY_URL,
    "sepolia"
);
const Provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_API_KEY_URL,
    "sepolia"
)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY1,provider);
// set poolId
const poolId = 63576
// let erc721Id = 0
const withdraw = '0x2e1a7d4d'
const gain = '0x022e6df6'

async function main() {
    const gasPrice = await wallet.getGasPrice();
    console.log(ethers.utils.formatUnits(gasPrice,9))
    const nonce = await wallet.getTransactionCount('latest');
    const tokenId = await getBValueByAValue(`${poolId}`)
    console.log(tokenId)
    const param = ethers.utils.defaultAbiCoder.encode(['uint256'],[parseInt(tokenId)])
    const calldata = withdraw+param.substring(2)
    const calldata1 = gain+param.substring(2)

    const tx = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: 3000000,
        to: '0x635ff8246201f0Ba7dC728672CDFfB769DC1c933',
        value: 0,
        data: calldata1
    }
    const response = await wallet.sendTransaction(tx);
    await response.wait()
    console.log('Withdraw txhash:',response.hash)
    remove(`${tokenId}`)
    await sleep(10000)
    process.exit(0);
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
main();
