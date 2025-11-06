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

document.getElementById("submit").addEventListener("click", onSubmit);