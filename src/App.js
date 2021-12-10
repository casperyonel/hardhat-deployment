import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
  const [greeting, setGreetingValue] = useState('')

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
      await requestAccount() // Prompts user to connect metamask wallet.
      const provider = new ethers.providers.Web3Provider(window.ethereum) 
      const signer = provider.getSigner() // Sign into metamask
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer) // USING SIGNER ADDRESS INSTEAD OF PROVIDER NOW
      const transaction = await contract.setGreeting(greeting) // Passing in state to setGreeting method in contract we accessed
      setGreetingValue('') // Resetting state since we already passed greeting to contract
      await transaction.wait() // Waits for it to be written to blockchain
      fetchGreeting() // To display, since this calls the greeting() method which actually returns our greeting to user. 
    }
  }


  return (
    <div className="App">

        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input type="text" onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />

    </div>
  );
}

export default App;
