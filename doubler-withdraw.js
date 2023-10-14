const {ethers} = require("hardhat");
require("dotenv").config();
const {remove,getBValueByAValue,isExist} = require("./excel");

const provider = new ethers.providers.WebSocketProvider(
    process.env.ALCHEMY_API_KEY_URL,
    "sepolia"
);
const Provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_API_KEY_URL,
    "sepolia"
)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY1,provider);
const withdraw = '0x2e1a7d4d' // if the status of the next layer is 'ON'
const gain = '0x022e6df6'    // if the pool was ended

async function main(_poolId) {
    const exist = await isExist(`${_poolId}`);
    console.log('added:',exist)
    if(!exist) {
        const gasPrice = await wallet.getGasPrice();
        console.log(ethers.utils.formatUnits(gasPrice,9))
        const nonce = await wallet.getTransactionCount('latest');
        const tokenId = await getBValueByAValue(`${_poolId}`)
        console.log(tokenId)
        const param = ethers.utils.defaultAbiCoder.encode(['uint256'],[parseInt(tokenId)])
        const calldata = withdraw+param.substring(2) // withdraw's calldata
        const calldata1 = gain+param.substring(2) // gain's calldata

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
        remove(`${tokenId}`)
    }else process.exit(1)
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function execute() {
    // poolId array
    const array = [77153,77154,77155]
    for(let i = 0; i < array.length; i++){
        await main(array[i]);
    }
    await sleep(1000);
    process.exit(0);
}
execute();
