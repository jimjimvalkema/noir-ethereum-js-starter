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
```shell
curl -L https://raw.githubusercontent.com/noir-lang/noirup/refs/heads/main/install | bash
noirup
```

### make a project
we can now use nargo to make a little hello world project.
```shell
nargo new hello_world
```
