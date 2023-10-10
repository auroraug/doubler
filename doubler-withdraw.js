const {ethers} = require("hardhat");
require("dotenv").config();
const {remove,getBValueByAValue} = require("./excel");

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
const poolId = '63712'
// let erc721Id = 0
const functionSigature = '0x2e1a7d4d'

async function main() {
    const gasPrice = await wallet.getGasPrice();
    const nonce = await wallet.getTransactionCount('latest')
    const value = await getBValueByAValue(`${poolId}`)
    const param = ethers.utils.defaultAbiCoder.encode(['uint256'],[value])
    const calldata = functionSigature+param.substring(2)

    const tx = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: 3000000,
        to: '0x635ff8246201f0Ba7dC728672CDFfB769DC1c933',
        value: 0,
        data: calldata
    }
    const response = await wallet.sendTransaction(tx);
    await response.wait()
    console.log('Withdraw txhash:',response.hash)
    remove(`${value}`)
    process.exit(0);
}
main();