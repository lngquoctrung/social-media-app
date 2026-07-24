const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const keysDir = path.join(__dirname, "..", "..", "keys");

if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
}

console.log("Generating RSA key pair for JWT...");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: "spki",
        format: "pem"
    },
    privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
    }
});

fs.writeFileSync(path.join(keysDir, "jwt.private.key"), privateKey);
fs.writeFileSync(path.join(keysDir, "jwt.public.key"), publicKey);

console.log("Keys generated successfully in backend/keys/ directory!");
