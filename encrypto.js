const crypto = require('crypto');
const fs = require('fs');

// generates key-pair
function generateRSAKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // key length
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

// encrypting with pub_k
function encryptWithRSAPublicKey(publicKey, plaintext) {
  const bufferPlaintext = Buffer.from(plaintext, 'utf8');
  const encryptedData = crypto.publicEncrypt(publicKey, bufferPlaintext);
  return encryptedData.toString('base64');
}

// decrypting with private_k
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
