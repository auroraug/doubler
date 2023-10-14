const { ethers } = require("hardhat");
require("dotenv").config();
const {add,isExist} = require("./excel");

const provider = new ethers.providers.WebSocketProvider(
    process.env.ALCHEMY_API_KEY_URL,
    "sepolia"
);
const Provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_API_KEY_URL,
    "sepolia"
  );
const signer = new ethers.Wallet(process.env.PRIVATE_KEY1, provider);

async function input(_poolId) {
    const poolId = parseInt(_poolId)
    const calldata1 = ethers.utils.defaultAbiCoder.
    encode(['uint256','uint256'],[poolId,10])
    const depositHexdata = '0xaf1eaaef'+calldata1.substring(2)
    const exist = await isExist(`${poolId}`);
    console.log('added:',exist)
    if(!exist) {
        const nonce = await provider.getTransactionCount(signer.address, 'latest');
        let gasPrice = await provider.getGasPrice();
        const tx = {
            nonce: nonce,
            gasPrice: (gasPrice.add(1e8)),
            gasLimit: 3000000,
            to: '0x635ff8246201f0ba7dc728672cdffb769dc1c933',
            value: 0,
            data: depositHexdata,
        };
        try{
            // Send two transactions in parallel and wait for confirmation
            const [depositResponse] = await Promise.all([
                // signer.sendTransaction(tx),
                signer.sendTransaction(tx),
            ]);

            await Promise.all([
                // approveResponse.wait(),
                depositResponse.wait(),
            ]);

            // console.log('Approved Transaction Hash:', approveResponse.hash);
            console.log('Deposit Transaction Hash:', depositResponse.hash);
            await addPool(depositResponse.hash).then((result) => {
                console.log(`add ${poolId} successfully`)
                // write in excel
                add(poolId,result);
            })
            console.log('gwei:',ethers.utils.formatUnits(gasPrice,9))
            // await sleep(5000) // wait 10 seconds
            // process.exit(0);
        } catch (error) {
            console.error('Error:', error);
            process.exit(1);
        }
    }
    else process.exit(1);
}

async function addPool(txhash) {
    try {
        const receipt = await provider.getTransactionReceipt(String(txhash));
        const logs = receipt.logs;
        
        if (logs.length > 0) {
            const tokenIdPromises = [];

            for (const log of logs) {
                if (log.address.toLowerCase() === "0x09547e68ce13fdecb5bf52fd17379fffa97cb797".toLowerCase()) {
                    // console.log('Log:');
                    // console.log('Address:', log.address);
                    // console.log('Data:', log.data);
                    // console.log('Topics:', log.topics);
                    // console.log('tokenId:', parseInt(log.topics[3]));

                    tokenIdPromises.push(parseInt(log.topics[3]));
                }
            }

            if (tokenIdPromises.length > 0) {
                // use Promise.all and wait for all asynchronous operations to complete
                const tokenIds = await Promise.all(tokenIdPromises);
                return tokenIds[0]; // return the first tokenId
            }
        } else {
            console.log('No logs found in this transaction.');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    return null; // mismatch
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    // poolId array
    const poolArray = [68200,68201,68999]
    for (let i = 0;i < poolArray.length; i++) {
        await input(poolArray[i]);
    }
    await sleep(1000);
    process.exit(0)
}
main();

