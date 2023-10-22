const {ethers} = require("hardhat")

const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_KEY_URL);

function timestamp(){
    // declare time standard
    const timeString = '2023.10.21 10:14:57 UTC+8'; //  or '2023/10/21 02:14:57 UTC'
    // parse to date object
    const date = new Date(timeString);

    // fetch timestamp
    const ethereumTimestamp = Math.floor(date.getTime() / 1000);

    console.log('Ethereum Timestamp:', ethereumTimestamp);

    // use Wei to express timestamp
    const weiTimestamp = ethers.utils.parseUnits(ethereumTimestamp.toString(), 0);

    console.log('Ethereum Timestamp (Wei):', weiTimestamp.toString());
}

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

    console.log('Time (UTC+8): ',beijingTime); // log：'2023-03-22 16:02:44'
}

async function getPrice(tokenName) {
    if (tokenName.toString() == 'BTC') {
        const BTCresponse = await provider.call({
            to: '0xFcdB5EDB24ccc6d84327395C900E46b7aeDF4aaf',
            data: '0x16345f180000000000000000000000008343e1d4c80a29b77cf9f8f6cb98b62bc0fb93d7'
        })
        const decodedResult1 = ethers.utils.defaultAbiCoder.decode(["uint","uint","uint"],BTCresponse)
        return parseFloat(decodedResult1[1]/10 ** 8);
    }
    else if (tokenName.toString() == 'ETH') {
        const ETHresponse = await provider.call({
            to: '0xFcdB5EDB24ccc6d84327395C900E46b7aeDF4aaf',
            data: '0x16345f180000000000000000000000001629D7D8E39A0747677BFbF61c7643F112037B40'
        })
        const decodedResult2 = ethers.utils.defaultAbiCoder.decode(["uint","uint","uint"],ETHresponse)
        return parseFloat(decodedResult2[1]/10 ** 8);
    }
    else if (tokenName.toString() == 'LINK') {
        const LINKresponse = await provider.call({
            to: '0xFcdB5EDB24ccc6d84327395C900E46b7aeDF4aaf',
            data: '0x16345f18000000000000000000000000cd97aa0Fce06A359489429984376FD78d42f527A'
        })
        const decodedResult3 = ethers.utils.defaultAbiCoder.decode(["uint","uint","uint"],LINKresponse)
        return parseFloat(decodedResult3[1]/10 ** 8);
    }
    else if (tokenName.toString() == 'SNX') {
        const SNXresponse = await provider.call({
            to: '0xFcdB5EDB24ccc6d84327395C900E46b7aeDF4aaf',
            data: '0x16345f1800000000000000000000000024eCe36071BbfFCfA6E0BbE98B76612e06c0220D'
        })
        const decodedResult4 = ethers.utils.defaultAbiCoder.decode(["uint","uint","uint"],SNXresponse)
        return parseFloat(decodedResult4[1]/10 ** 8);
    }
    else if (tokenName.toString() == 'all'){
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
        const decodedResult1 = ethers.utils.defaultAbiCoder.decode(["uint","uint","uint"],BTCresponse)
        const decodedResult2 = ethers.utils.defaultAbiCoder.decode(["uint","uint","uint"],ETHresponse)
        const decodedResult3 = ethers.utils.defaultAbiCoder.decode(["uint","uint","uint"],LINKresponse)
        const decodedResult4 = ethers.utils.defaultAbiCoder.decode(["uint","uint","uint"],SNXresponse)
        timestampToBeiJingTime(parseInt(decodedResult1[0]))
        console.log('BTC price: ',parseFloat(decodedResult1[1]/10 ** 8))
        console.log(parseInt(decodedResult1[2]))
        timestampToBeiJingTime(parseInt(decodedResult2[0]))
        console.log('ETH price: ',parseFloat(decodedResult2[1]/10 ** 8))
        console.log(parseInt(decodedResult2[2]))
        timestampToBeiJingTime(parseInt(decodedResult3[0]))
        console.log('LINK price: ',parseFloat(decodedResult3[1]/10 ** 8))
        console.log(parseInt(decodedResult3[2]))
        timestampToBeiJingTime(parseInt(decodedResult4[0]))
        console.log('SNX price: ',parseFloat(decodedResult4[1]/10 ** 8))
        console.log(parseInt(decodedResult4[2]))
    }
}
// getPrice('all')
timestamp()
module.exports = {
    getPrice
}