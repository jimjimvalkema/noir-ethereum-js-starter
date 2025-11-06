# noir-ethereum-js-starter
let's get started :D

## step 0, install Node, yarn, vs-code, git
*assumes you are on ubuntu or similair, click on the links to see other distrobutions*

### [node](https://nodejs.org/en/download)
```shell
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"
# Download and install Node.js:
nvm install 24
# Verify the Node.js version:
node -v # Should print "v24.11.0".
```

### [yarn](https://nodejs.org/en/download) (part of node)
```shell
# Download and install Yarn:
corepack enable yarn
# Verify Yarn version:
yarn -v
```

### [git](https://git-scm.com/install/linux)
```shell
sudo apt-get install git;
```

### [vscode](https://code.visualstudio.com/)
Go to the download page here: https://code.visualstudio.com/  
And then *(remebember to replace the "REPLACE_WITH_VERSION" text with the actual version)*:  
```shell
cd Downloads;
sudo dpkg -i code_REPLACE_WITH_VERSION.deb;
```
*pro tip if it's blurry and ur using fractional scaling:https://grok.com/c/d1079f60-b8a0-4859-8f17-ef4a265e7fd5*

## [step 1 noir!!!](https://noir-lang.org/docs/getting_started/quick_start)
### install nargo (the compiler)
Install noirup
```shell
curl -L https://raw.githubusercontent.com/noir-lang/noirup/refs/heads/main/install | bash
```
install nargo (and lets stick to this specific version: 1.0.0-beta.14)
```shell
noirup --version  1.0.0-beta.14
```



### make a project
we can now use nargo to make a little hello world project.
```shell
nargo new hello_world
```
### what is in here?
It created a folder called `hello_world`, inside is:
* `src/main.nr`: this is where your noir code is! This the code for your circuit
* `Nargo.toml`: This is where you install packages and add extra information about your repo.    
It also has says: `type = "bin"` this tells the compiler to compile it to a circuit.  
*`type = "lib"`=library,  `type = "contract"`=aztec contract. But we are not going to mess with that. Don't worry about itThe code inside `src/main.nr` should be this: 
*More info about Nargo.toml: https://noir-lang.org/docs/getting_started/project_breakdown*

### [install noir syntax highlighting](https://marketplace.visualstudio.com/items?itemName=noir-lang.vscode-noir)
Let's install the noir extension so we have nice colors :D  
**Inside vs-code** press: `ctrl+p`
Then paste this: `ext install noir-lang.vscode-noir`


### what is this code?
Now lets look at the code. It should look like this.
```rs
fn main(x: Field, y: pub Field) {
    assert(x != y);
}

#[test]
fn test_main() {
    main(1, 2);

    // Uncomment to make test fail
    // main(1, 1);
}
```
Pretty simple! The main function checks that x is not be the same as y. And a test to test that. You can do `nargo test` to test that!    
This code creates a circuit that allows the prover (ex: the user) to pick 2 numbers (x and y) and proof they are not the same!   
And then the verifier (ex: a contract) can verify that proof is correct!  
What is zk here? The first number: `x`! The contract will only see the number `y` since that is the only one with the `pub` keyword. But `x` doesn't have that so that will remain secret.


## step 2 [bb](https://barretenberg.aztec.network/docs/getting_started): let's proof and verify!
### noir is not only for aztec
Noir is not tied to a single smart contract ecosystem or even a proof system. 
Noir the language gets compiled with nargo to a intermediate representation that then other systems called backends can use to create the proofs and verifiers from.  
Aztec is building a zk-rollup and made a backend to do that. And that backend can generate aztec-contracts that live on their rollup but also solidity verifiers that they use to verify their rollup!  
*key take away:* write your code once and proof it with starks snarks or any system that has a backend for noir!!  

### lets install aztecs [barretenberg](https://barretenberg.aztec.network/docs/getting_started) backend (aka bb)
Install bbup
```shell
curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/refs/heads/next/barretenberg/bbup/install | bash
```
*lets install bb and stick to this specific version: 3.0.0-nightly.20251030-2*
```shell
bbup --version 3.0.0-nightly.20251030-2
```
*you can also do `bbup --nv  1.0.0-beta.14` to install the latest version of bb that is compatible with that nargo version*


### setup 
Now let's compile our circuit with nargo.
Go into the hello_world folder and compile it:
```shell
cd hello_world;
nargo compile;
```

Now it generated `target/hello_world.json`, this is our intermediate representation of our circuit!   
Next let's make `nargo` make the "witness", which is the data `bb` needs to create a proofs.  
Lets make the files where we can input the `x` and `y` values:
```shell
nargo check
```

Now `Prover.toml` is generated. Lets edit it and add our numbers for ex lets do:
```toml
x = "1"
y = "2"
```


### proof it!!!
sorry noir brokey, but we will do it in js!
Then we execute with nargo:
```shell 
nargo execute;
```
This generated `target/hello_world.gz` which contains our witness;

Now lets proof it with `bb`.
Remember:   
`./target/hello_world.json` is our intermediated representation of our circuit  
`./target/hello_world.gz` is our witness, the intermediate step of our proof

```shell
bb write_vk -b ./target/hello_world.json -o target;
bb prove -b ./target/hello_world.json -w ./target/hello_world.gz -o target;
```
This generated a whole bunch of files. But most importantly the proof and public inputs.   
*vk and vk_hash are used to verify which circuit you are proving/verify*  
And now can verify it by doing: 
```shell
bb verify -p ./target/proof -k ./target/vk
```

Yay we verified a zk proof.


## step 3 now let's do it in the browser
### setup yarn
lets add our js package we need from aztec.   
Make sure you are in the root of your project. (above `hello_world` folder) 
```shell
yarn add @aztec/bb.js@3.0.0-nightly.20251030-2;
yarn add @noir-lang/noir_js@1.0.0-beta.14;
yarn add viem;
```
*you have to make sure the version match with nargo and bb ofc*  

#### lets make a very simple ui with vanilla js and html:
In the root of your project make file named: `index.html`    
Inside `index.html` paste this:
```html
<!DOCTYPE html>
<head>
  <style>
    .outer {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    .inner {
        width: 45%;
        border: 1px solid black;
        padding: 10px;
        word-wrap: break-word;
    }
  </style>
</head>
<body>
  <script type="module" src="/index.js"></script>
  <h1>Noir app</h1>
  <div class="input-area">
    <input id="number-x" type="number" placeholder="Enter secret number x" />
     <input id="number-y" type="number" placeholder="Enter public number y" />
    <button id="submit">Submit numbers</button>
  </div>
  <div class="outer">
    <div id="logs" class="inner"><h2>Logs</h2></div>
    <div id="results" class="inner"><h2>Proof</h2></div>
  </div>
</body>
</html>
```

now add vite to our project so we can run our website locally:
```shell
yarn add vite vite-plugin-node-polyfills;
```

setup config for vite so it supports wasm:  
make a file called `vite.config.js`
Paste this in there: 
```js
// to enable wasm support since bb needs it
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [nodePolyfills()],
  optimizeDeps: { 
    exclude: ["@aztec/bb.js"] 
  },
  resolve: {
    alias: {
      pino: "pino/browser.js",
    },
  }
});
```

Now to see our website we can do: 
```shell
yarn vite dev
```
But the buttons don't work yet!   
Let's paste this into `index.js`:
```js
function addResultToUi(content) {
    const container = document.getElementById("results");
    container.appendChild(document.createTextNode(content));
    container.appendChild(document.createElement("br"));
};

function addLogToUi(content) {
    const container = document.getElementById("logs");
    container.appendChild(document.createTextNode(content));
    container.appendChild(document.createElement("br"));
};

async function onSubmit() {
  const xElement = document.getElementById("number-x")
  const yElement = document.getElementById("number-y")
  const inputs = {x:Number(xElement.value),y:Number(yElement.value)}
  console.log({inputs})
  addLogToUi(JSON.stringify(inputs))
}

document.getElementById("submit").addEventListener("click", onSubmit);
```

now we can see what our inputs are in the logs box!  
#### Now time to proof 
Import noir, the circuit, viem, bb and setup wasm like this at the top of the index.js file:
```js
// just to make the proof look nice! (viem is a library to interact with ethereum just like ethers.js!)
import { toHex } from 'viem';

// our proving backend and noir!
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';

// the circuit we compiled with nargo compile
import circuit from './hello_world/target/hello_world.json';

// initialize some wasm shit
import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";
await Promise.all([
    initACVM(fetch(acvm)),
    initNoirC(fetch(noirc))
]);
```

and replace the onSubmit function with this: 
```js
async function onSubmit() {
    const xElement = document.getElementById("number-x")
    const yElement = document.getElementById("number-y")
    const inputs = { x: Number(xElement.value), y: Number(yElement.value) }
    console.log({ inputs })
    addLogToUi(JSON.stringify(inputs))

    const noirWithCircuit = new Noir(circuit);
    const backend = new UltraHonkBackend(circuit.bytecode);
    // noirWithCircuit.execute() will error on invalid inputs. so we catch that error and log it.
    try {
        // if inputs invalid noir will error here
        const {witness} = await noirWithCircuit.execute(inputs)
        const { publicInputs, proof } = await backend.generateProof(witness)
        const isVerified = await backend.verifyProof({ publicInputs, proof })
        if (isVerified) {
            addResultToUi("it worked")
            addLogToUi(JSON.stringify({ publicInputs, proof: toHex(proof) }))
        } else {
            addResultToUi("invalid proof")
        }
    } catch (error) {
        if (error.message === "Cannot satisfy constraint") {
            addResultToUi("invalid inputs")
        } else {
            // at this point the error is unexpected and something went wrong
            throw error
        }
    }
}
```

now you can run vite again and proof and verify in the browser!
```shell
yarn vite dev;
```

## step 3 verify on ethereum
TODO but you can look here at the bb docs: https://barretenberg.aztec.network/docs/nightly/how_to_guides/how-to-solidity-verifier
### generate the solidity verifier

### setup hardhat

### write a contract

### deploy 

### plug in the ui