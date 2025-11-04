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
#### what is in here?
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
#### noir is not only for aztec
Noir is not tied to a single smart contract ecosystem or even a proof system. 
Noir the language gets compiled with nargo to a intermediate representation that then other systems called backends can use to create the proofs and verifiers from.  
Aztec is building a zk-rollup and made a backend to do that. And that backend can generate aztec-contracts that live on their rollup but also solidity verifiers that they use to verify their rollup!  
*key take away:* write your code once and proof it with starks snarks or any system that has a backend for noir!!  

#### lets install aztecs [barretenberg](https://barretenberg.aztec.network/docs/getting_started) backend (aka bb)
Install bbup
```shell
curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/refs/heads/next/barretenberg/bbup/install | bash
```
*lets install bb and stick to this specific version: 3.0.0-nightly.20251030-2*
```shell
bbup --version 3.0.0-nightly.20251030-2
```
*you can also do `bbup --nv  1.0.0-beta.14` to install the latest version of bb that is compatible with that nargo version*


#### setup 
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


#### proof it!!!
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
bb prove -b ./target/hello_world.json -w ./target/hello_world.gz --write_vk -o target
```
This generated a whole bunch of files. But most importantly the proof and public inputs.   
*vk and vk_hash are used to verify which circuit you are proving/verify*  
And now can verify it by doing: 
```shell
bb verify -p ./target/proof -k ./target/vk
```

Yay we verified a zk proof.


## step 3 now let's do it in the browser
