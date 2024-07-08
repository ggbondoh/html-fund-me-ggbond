import { ethers } from "./ethers-6.7.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connectBtn");
const fundBtn = document.getElementById("fundBtn");
const balanceBtn = document.getElementById("balanceBtn");
const balanceRes = document.getElementById("balanceResult");
const withdrawBtn = document.getElementById("withdrawBtn");

connectBtn.onclick = connect;
fundBtn.onclick = fund;
balanceBtn.onclick = getBalance;
withdrawBtn.onclick = withdraw;

console.log(ethers);

// connect
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("I see a metamask !");
        try {
            await window.ethereum.request({
                method: "eth_requestAccounts",
            });
        } catch (error) {
            console.error(error);
        }
        connectBtn.innerHTML = "Connected !";
        console.log("metamask connected !");
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });
        console.log(accounts);
    } else {
        connectBtn.innerHTML = "Please install metamask !";
        console.log("No metamask !");
    }
}

// fund
async function fund() {
    const ethAmt = document.getElementById("ethAmount").value;
    // 检查 ethAmt 是否有效
    if (!ethAmt || isNaN(ethAmt) || parseFloat(ethAmt) <= 0) {
        alert("Please enter a valid amount of ETH.");
        return;
    }

    console.log(`Funding with ${ethAmt} ...`);
    if (typeof window.ethereum !== "undefined") {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.fund({
                value: ethers.parseUnits(ethAmt, 18),
            });
            // wait for this TX finish
            await transactionResponse.wait(1);
            console.log("fund end ...");
        } catch (error) {
            console.log(error);
        }
    } else {
        fundBtn.innerHTML = "Please install MetaMask";
    }
}

// withdraw
async function withdraw() {
    console.log("withdrawing ...");
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            console.log("Processing transaction ...");
            const transactionResponse = await contract.withdraw();
            await transactionResponse.wait(1);
            console.log("transaction done ...");
        } catch (error) {
            console.error(error);
        }
    } else {
        withdrawBtn.innerHTML = "Please install MetaMask";
    }
    console.log("withdraw end ...");
}

async function getBalance() {
    console.log(`getBalance ...`);
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        try {
            const balance = await provider.getBalance(contractAddress);
            const ethAmt = ethers.formatEther(balance);
            console.log(ethAmt);
            balanceRes.textContent = `${ethAmt} ETH`;
        } catch (error) {
            console.error(error);
        }
    } else {
        balanceBtn.innerHTML = "Please install MetaMask";
    }
    console.log(`getBalance end ...`);
}
