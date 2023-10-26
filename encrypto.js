const crypto = require('crypto');
const fs = require('fs');

// 生成RSA密钥对
function generateRSAKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // 密钥长度
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  return { publicKey, privateKey };
}

// 使用RSA公钥加密内容
function encryptWithRSAPublicKey(publicKey, plaintext) {
  const bufferPlaintext = Buffer.from(plaintext, 'utf8');
  const encryptedData = crypto.publicEncrypt(publicKey, bufferPlaintext);
  return encryptedData.toString('base64');
}

// 使用RSA私钥解密内容
function decryptWithRSAPrivateKey(privateKey, encryptedData) {
    const bufferEncryptedData = Buffer.from(encryptedData, 'base64');
    const decryptedData = crypto.privateDecrypt(privateKey, bufferEncryptedData);
    return decryptedData.toString('utf8');
  }

const encryptedData = fs.readFileSync('./encryptedData.pem','utf-8')
const privateKey = fs.readFileSync('./privateKey.pem', 'utf8');
const re = decryptWithRSAPrivateKey(privateKey,encryptedData);
module.exports = {
    re
}