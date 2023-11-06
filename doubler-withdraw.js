const {ethers} = require("hardhat");
require("dotenv").config();

const provider = new ethers.providers.WebSocketProvider(
    process.env.ALCHEMY_API_KEY_URL,
    "sepolia"
);
const Provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_API_KEY_URL,
    "sepolia"
)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY1,provider);

function buildTx(events,num) {
    let nonce = num
    const transactions = []
    for (const event of events) {
        const calldata = '0x022e6df6'+ethers.utils.defaultAbiCoder.encode(['uint'],[parseInt(event)]).substring(2)
        const tx = {
            nonce: nonce,
            to: '0x635ff8246201f0Ba7dC728672CDFfB769DC1c933',
            value: 0,
            gasLimit: 3000000,
            data: calldata
        }
        transactions.push(tx)
        nonce++;
    }
    return transactions;
}
// gain all the LP token
async function Gain(tokens) {
    const nonce = await wallet.getTransactionCount('latest');
    const transactions = buildTx(tokens,nonce);
    try {
        await Promise.all(
            transactions.map(transaction => wallet.sendTransaction(transaction))
        ).then(() => {
            console.log('All transactions have been sent successfully!')
            process.exit(1)
        })
    } catch (error) {
        console.error(error)
        process.exit()
    }
}
// fetch the undrawn LP token
async function queryAlive(_address) {
    const inputfilter = {
      address: '0x09547e68ce13fdecb5bf52fd17379fffa97cb797',
      topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          null,
          ethers.utils.hexZeroPad(_address,32),
          null
      ],
      fromBlock: 4137553,
      toBlock: 'latest'
    };
    const gainfilter = {
      address: '0x635ff8246201f0ba7dc728672cdffb769dc1c933',
      topics: [
          '0xe4318cbbcd43f45d3616ef5218ed36e0aa9c4e1031ca53b7ef373e5b4bc004d6',
          null,
          null,
          ethers.utils.hexZeroPad(_address,32)
      ],
      fromBlock: 4137553,
      toBlock: 'latest'
    };
    const withdrawfilter = {
      address: '0x635ff8246201f0ba7dc728672cdffb769dc1c933',
      topics: [
          '0x64b7ede42bee285f28adff7881662a3c0936fb456e5be5bbba9ac6ca125c4293',
          null,
          null,
          ethers.utils.hexZeroPad(_address,32)
      ],
      fromBlock: 4137553,
      toBlock: 'latest'
    };
    try {
      const [inputLogs, gainLogs, withdrawLogs] = await Promise.all([
        fetchLogs(provider, [inputfilter]),
        fetchLogs(provider, [gainfilter]),
        fetchLogs(provider, [withdrawfilter])
      ]);
  
      const input = inputLogs.map(log => parseInt(log.topics[3], 16));
      const withdraw = new Set([...new Set([...gainLogs, ...withdrawLogs].map(log => parseInt(log.topics[1], 16)))]);
      const filter = input.filter(itemA => !withdraw.has(itemA));
      return filter;
    } catch (error) {
      console.error('An error occurred while querying logs: ', error);
    }
  }
  
async function fetchLogs(provider, filters) {
    const logs = await Promise.all(filters.map(filter => provider.getLogs(filter)));
    return logs.flat();
  }

module.exports = {
    provider,
    Provider
}
