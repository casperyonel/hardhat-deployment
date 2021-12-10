import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import { Greeter } from './artifacts/contracts/Greeter.sol/Greeter.json'
import { EtherscanProvider } from '@ethersproject/providers';

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"


function App() {

  const [greeting, setGreetingValue] = useState('')

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  } // Prompts user to connect metamask account. 

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') { // Make sure they have metamask extension
      const provider = new ethers.providers.Web3Provider(window.ethereum) // Web3Provider is just one provider we can use
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider) // To interact with contract
      try {
        const data = await contract.greet() // Calling method in contract
        console.log('data: ' , data)
       } catch (err) {
         console.log("Error: ", err)
       }
    }
  }

  async function setGreeting() {
    if (!greeting) return // Ensures state is not blank, they wrote something in box. 
    if (typeof window.ethereum !== 'undefined') { // Make sure they have metamask extension
      await requestAccount() // Prompts user to connect metamask account.
      const provider = new ethers.providers.Web3Provider(window.ethereum) 
      const signer = provider.getSigner() // Sign into metamask
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer) // USING SIGNER ADDRESS INSTEAD OF PROVIDER NOW
      const transaction = await contract.setGreeting(greeting) // Passing in state to setGreeting method in contract we accessed
      await transaction.wait() 
      fetchGreeting() // To display
    }
  }


  return (



    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
