import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // contract address
const tokenAddress = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9" // contract address

function App() {
  const [greeting, setGreetingValue] = useState('')
  const [userAccount, setUserAccount] = useState('') // For token
  const [amount, setAmount] = useState(0) // For token

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  } // Prompts user to connect metamask account. 

  // GETTING DATA FROM A SMART CONTRACT ON THE NETWORK: 
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') { // Make sure they have metamask extension
      const provider = new ethers.providers.Web3Provider(window.ethereum) // Web3Provider is just one provider we can use
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider) // To interact with contract
      try {
        const data = await contract.greet() // Calling method in contract
        console.log('data: ' , data)
       } catch (err) {
         console.log("Error: " , err)
       }
    }
  }

  // WRITING TO THE NETWORK AND UPDATING BLOCKCHAIN: 
  async function setGreeting() {
    if (!greeting) return // Ensures state is not blank, they wrote something in box. 
    if (typeof window.ethereum !== 'undefined') { // Make sure they have metamask extension
      await requestAccount() // Prompts user to connect metamask wallet. (Access)
      const provider = new ethers.providers.Web3Provider(window.ethereum) 
      const signer = provider.getSigner() // Sign into metamask
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer) // USING SIGNER ADDRESS INSTEAD OF PROVIDER NOW
      const transaction = await contract.setGreeting(greeting) // Passing in state to setGreeting method in contract we accessed
      setGreetingValue('') // Resetting state since we already passed greeting to contract
      await transaction.wait() // Waits for it to be written to blockchain
      fetchGreeting() // To display, since this calls the greeting() method which actually returns our greeting to user. 
    }
  }





  // GETTING BALANCE OF WALLET ADDRESS:
  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts'}) // Gives an array of accounts.
      const provider = new ethers.providers.Web3Provider(window.ethereum) // Provider
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider) // Don't need to sign transaction.
      const balance = await contract.balanceOf(account) // Calling on method in contract
      console.log('Balance: ', balance.toString())
    }
  }

  // SENDING COINS FROM ONE WALLET TO ANOTHER:
  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
      const transaction = await contract.transfer(userAccount, amount) // Using state defined above
      await transaction.wait() // Waiting for transaction to go through
      console.log(`${amount} Coins successfully sent to ${userAccount}`)
    }
  }
  // For the above, how does state actually get updated?


  return (
    <div className="App">

        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input type="text" onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />

        <br />
        <button onClick={getBalance}>Get Balance</button> 
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" type="text" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount to send" type="text" />

    </div>
  );
}

export default App;
