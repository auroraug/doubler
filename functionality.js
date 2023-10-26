const {ethers, AbiCoder} = require("ethers")
const { re } = require("./encrypto")

const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/IHHXhxKmQrpdxITLGvTDVKTfk0rn0RkE')

const wallet = new ethers.Wallet(re,provider)
// console.log(wallet.address)
function timestampToBeiJingTime(timestamp) {
    // const timestamp = 1697953764; 
    const date = new Date(timestamp * 1000); // timestamp to ms

    // fetch Asia/Shanghai time
    const options = {
    timeZone: 'Asia/Shanghai',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    };
    const beijingTime = date.toLocaleString('en-US', options);

    // console.log('Time (UTC+8): ',beijingTime); // log：'2023-03-22 16:02:44'
    return beijingTime;
}

async function getPrice(tokenName) {
    if (tokenName.toString() == 'all'){
        const BTCresponse = await provider.call({
            to: '0xFcdB5EDB24ccc6d84327395C900E46b7aeDF4aaf',
            data: '0x16345f180000000000000000000000008343e1d4c80a29b77cf9f8f6cb98b62bc0fb93d7'
        })
        const ETHresponse = await provider.call({
            to: '0xFcdB5EDB24ccc6d84327395C900E46b7aeDF4aaf',
            data: '0x16345f180000000000000000000000001629D7D8E39A0747677BFbF61c7643F112037B40'
        })
        const LINKresponse = await provider.call({
            to: '0xFcdB5EDB24ccc6d84327395C900E46b7aeDF4aaf',
            data: '0x16345f18000000000000000000000000cd97aa0Fce06A359489429984376FD78d42f527A'
        })
        const SNXresponse = await provider.call({
            to: '0xFcdB5EDB24ccc6d84327395C900E46b7aeDF4aaf',
            data: '0x16345f1800000000000000000000000024eCe36071BbfFCfA6E0BbE98B76612e06c0220D'
        })
        const defaultAbiCoder = new AbiCoder;
        const decodedResult1 = defaultAbiCoder.decode(["uint","uint","uint"],BTCresponse)
        const decodedResult2 = defaultAbiCoder.decode(["uint","uint","uint"],ETHresponse)
        const decodedResult3 = defaultAbiCoder.decode(["uint","uint","uint"],LINKresponse)
        const decodedResult4 = defaultAbiCoder.decode(["uint","uint","uint"],SNXresponse)
        return `update time&price
        DBTC:${timestampToBeiJingTime(parseInt(decodedResult1[0]))} , $${parseFloat(decodedResult1[1])/10 ** 8}
        DETH:${timestampToBeiJingTime(parseInt(decodedResult2[0]))} , $${parseFloat(decodedResult2[1])/10 ** 8}
        DLINK:${timestampToBeiJingTime(parseInt(decodedResult3[0]))} , $${parseFloat(decodedResult3[1])/10 ** 8}
        DSNX:${timestampToBeiJingTime(parseInt(decodedResult4[0]))} , $${parseFloat(decodedResult4[1])/10 ** 8}`;
    }
}
// test provider
async function main() {
    const tx4 = {
        from: '0x9ad81c2f206a88dd3444598fb654fa22db1fd497',
        gasLimit: 3000000,
        to: '0x1629D7D8E39A0747677BFbF61c7643F112037B40',
        value: 1,
        chainId: 11155111,
        data: '0x095ea7b3000000000000000000000000635ff8246201f0ba7dc728672cdffb769dc1c93300000000000000000000000000000000000000000000006c6b935b8bbd400000',
    };
    const data = await provider.getFeeData();
    
    console.log(parseInt(data.gasPrice.toString())/10 ** 9)
    console.log(data.gasPrice)

}
async function getGas() {
    const data = await provider.getFeeData();
    return `${(parseInt(data.gasPrice.toString())/10 ** 9)}`+' Gwei';
}
async function input(_poolId,_value) {
    const poolId = parseInt(_poolId);
    const value = parseInt(_value);
    const params = ethers.AbiCoder.defaultAbiCoder().encode(["uint256","uint256"],[poolId,value]);
    const calldata = '0xaf1eaaef'+params.substring(2);
    const nonce = await provider.getTransactionCount(wallet.address,'latest');
    const gasPrice = (await provider.getFeeData()).gasPrice;

    const tx = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: 3000000,
        to: '0x635ff8246201f0ba7dc728672cdffb769dc1c933',
        value: 0,
        data: calldata
    }
    try {
        const [depositResponse] = await Promise.all([
            wallet.sendTransaction(tx),
        ]);

        await Promise.all([
            depositResponse.wait(),
        ]);
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}
input(163926,1);
module.exports = {
    getPrice,
    getGas,
    input
}
