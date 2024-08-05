// Your contract ABI and address
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "hash",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "encryptedKey",
                "type": "string"
            }
        ],
        "name": "FileUploaded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "fileIndex",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "grantPermission",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "hash",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "PermissionGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "hash",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "PermissionRevoked",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "fileIndex",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "revokePermission",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_hash",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_encryptedKey",
                "type": "string"
            }
        ],
        "name": "uploadFile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "getSharedFiles",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "hash",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "encryptedKey",
                        "type": "string"
                    }
                ],
                "internalType": "struct DecentralizedFileStorage.FileInfo[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "fileIndex",
                "type": "uint256"
            }
        ],
        "name": "hasPermission",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "userFiles",
        "outputs": [
            {
                "internalType": "string",
                "name": "hash",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "encryptedKey",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = '0x6f292acB6b4803E40f9f9d6A78EfAE84e9A2f367';

// Web3 setup
let web3;
let contract;
let account;

async function connectWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = (await web3.eth.getAccounts())[0];
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log('Contract initialized:', contract);
        } catch (error) {
            console.error('User denied account access or there is an error', error);
            alert('Please connect your MetaMask wallet.');
        }
    } else {
        alert('Please install MetaMask!');
    }
}

// Upload file to Pinata and store the hash in the smart contract
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const encryptedKey = document.getElementById('encryptedKey').value;
    const status = document.getElementById('status');

    if (fileInput.files.length === 0) {
        status.textContent = 'Please select a file.';
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        // Upload file to Pinata
        status.textContent = 'Uploading to Pinata...';

        const result = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer YOUR_PINATA_JWT_TOKEN`, // Replace with your Pinata JWT token
            },
            body: formData
        });

        const response = await result.json();
        const ipfsHash = response.IpfsHash;
        status.textContent = `File uploaded to IPFS with hash: ${ipfsHash}`;

        // Store the IPFS hash in the smart contract
        status.textContent = 'Storing IPFS hash in the smart contract...';

        if (contract.methods.uploadFile) {
            await contract.methods.uploadFile(ipfsHash, encryptedKey).send({ from: account });
            status.textContent = 'IPFS hash stored successfully on the blockchain!';
        } else {
            console.error('uploadFile method not found in contract');
            status.textContent = 'uploadFile method not found in contract';
        }
    } catch (error) {
        console.error(error);
        status.textContent = 'An error occurred. Check console for details.';
    }
}

// Initialize web3 and attach the event listener
window.onload = async function () {
    await connectWeb3();
    document.getElementById('uploadButton').onclick = uploadFile;
};
