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
				"name": "user",
				"type": "address"
			}
		],
		"name": "getAllSharedFiles",
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
				"name": "user",
				"type": "address"
			}
		],
		"name": "getAllUserFiles",
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

const contractAddress = '0x29eB9bF346eE5c0e8D43a5eC111caC59A98B62CC';

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
            
            const networkId = await web3.eth.net.getId();
            console.log(`Connected Network ID: ${networkId}`);
            // Verify if the network is Sepolia Testnet
            if (networkId !== 11155111) {
                alert('Please connect to the Sepolia Testnet');
                console.log('Currently connected to Network ID:', networkId);
            } else {
                // Fetch and display uploaded files
                console.log('Fetching uploaded files...');
                await fetchUploadedFiles();
            }
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
    const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyYjdjM2Q2YS1hYWQ1LTRhZmYtODEzNi1hZTA5OGRlNGFjMjAiLCJlbWFpbCI6InllY293bGVzc3VyQHVtYWlsLnV0bS5hYy5tdSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxMWY5YzlkOTg3NmJlNDVjNDQzNiIsInNjb3BlZEtleVNlY3JldCI6IjA0ZjY1ZWMyNDc3NTdiZjA3NjIzNzk1OGMyN2QxOTQ4NmNmOGJmZWFjN2Y0OWJmYzQ4ZTkwNDk1YmExMDcyNzMiLCJleHAiOjE3NTQ0NTkxMzR9.D9CCodBH7YBGRCh_DOJHQQM8y8wrqKYyMpUi2BwTaLY'; // Replace with your Pinata JWT token

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
                'Authorization': `Bearer ${jwtToken}`, 
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
            
            // Refresh the file list after uploading
            console.log('Fetching uploaded files after upload...');
            await fetchUploadedFiles();
        } else {
            console.error('uploadFile method not found in contract');
            status.textContent = 'uploadFile method not found in contract';
        }
    } catch (error) {
        console.error(error);
        status.textContent = 'An error occurred. Check console for details.';
    }
}

// Fetch and display the uploaded files for the user
async function fetchUploadedFiles() {
    const filesTableBody = document.getElementById('filesTable').getElementsByTagName('tbody')[0];
    filesTableBody.innerHTML = ''; // Clear previous entries

    try {
        console.log('Calling getSharedFiles with account:', account);
        const files = await contract.methods.getSharedFiles(account).call();
        console.log('Fetched files:', files);

        if (files.length === 0) {
            console.log('No files found for this user.');
        }

        files.forEach((file, index) => {
            const row = filesTableBody.insertRow();

            const cellIndex = row.insertCell(0);
            const cellHash = row.insertCell(1);
            const cellKey = row.insertCell(2);

            cellIndex.textContent = index;
            cellHash.textContent = file.hash;
            cellKey.textContent = file.encryptedKey;
        });
    } catch (error) {
        console.error('Error fetching uploaded files:', error);
    }
}

// Grant permission to another user to access a file
async function grantPermission() {
    const fileIndex = document.getElementById('fileIndex').value;
    const userAddress = document.getElementById('userAddress').value;
    const permissionStatus = document.getElementById('permissionStatus');

    if (!fileIndex || !userAddress) {
        permissionStatus.textContent = 'Please provide both file index and user address.';
        return;
    }

    try {
        permissionStatus.textContent = 'Granting permission...';

        if (contract.methods.grantPermission) {
            await contract.methods.grantPermission(fileIndex, userAddress).send({ from: account });
            permissionStatus.textContent = 'Permission granted successfully!';
        } else {
            console.error('grantPermission method not found in contract');
            permissionStatus.textContent = 'grantPermission method not found in contract';
        }
    } catch (error) {
        console.error(error);
        permissionStatus.textContent = 'An error occurred. Check console for details.';
    }
}

// Initialize web3 and attach the event listener
window.onload = async function () {
    document.getElementById('connectButton').onclick = connectWeb3;
    document.getElementById('uploadButton').onclick = uploadFile;
    document.getElementById('grantPermissionButton').onclick = grantPermission;
};
