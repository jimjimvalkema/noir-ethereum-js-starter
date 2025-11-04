import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import circuit from './hello_world/target/hello_world.json';
import { toHex } from 'viem';

function result(content) {
    const container = document.getElementById("results");
    container.appendChild(document.createTextNode(content));
    container.appendChild(document.createElement("br"));
};

function log(content) {
    const container = document.getElementById("logs");
    container.appendChild(document.createTextNode(content));
    container.appendChild(document.createElement("br"));
};


async function onSubmit() {
    const xElement = document.getElementById("number-x")
    const yElement = document.getElementById("number-y")
    const inputs = { x: Number(xElement.value), y: Number(yElement.value) }
    console.log({ inputs })
    log(JSON.stringify(inputs))

    const noirWithCircuit = new Noir(circuit);
    const backend = new UltraHonkBackend(circuit.bytecode);
    try {
        // if inputs invalid noir will error here
        const {witness} = await noirWithCircuit.execute(inputs)
        const { publicInputs, proof } = await backend.generateProof(witness)
        const isVerified = await backend.verifyProof({ publicInputs, proof })
        if (isVerified) {
            result("it worked")
            log(JSON.stringify({ publicInputs, proof:toHex(proof) }))
        } else {
            result("invalid proof")
        }
    } catch (error) {
        result("invalid proof")
    }
}

document.getElementById("submit").addEventListener("click", onSubmit);
