export const gateSet = new Set(["h", "cx", "x", "y", "z", "s", "sdg", "t", "tdg", 
    "rx", "ry", "rz", "cy", "cz", "swap", "crz", "cry", "crz", "ccx", "id", "u", "u3"]);
 
export const gateNameMap: Record<string, string> = {
    h: "Hadamard",
    x: "Pauli-X",
    y: "Pauli-Y",
    z: "Pauli-Z",
    cx: "CNOT",
    cz: "Controlled-Z",
    ccx: "Toffoli",
    swap: "SWAP",
    id: "Identity",
    s: "S",
    sdg: "S†",
    t: "T",
    tdg: "T†",
    rx: "RX",
    ry: "RY",
    rz: "RZ",
    u: "U",
    u1: "U1",
    u2: "U2",
    u3: "U3",
    measure: "Measurement"
    };
export const gateDef: Record<string, string> = {
    //single-qubit gates
    h: "Hadamard transforms ${qubit} from a definite state (like |0⟩ or |1⟩) into a superposition of both.",
    x: "Pauli-X flips the state of ${qubit} — like a quantum NOT gate: |0⟩ becomes |1⟩ and vice versa.",
    y: "Pauli-Y flips ${qubit} and also adds a phase of i to the |1⟩ component.",
    z: "Pauli-Z flips the phase of ${qubit}'s |1⟩ component, changing it to -|1⟩.",
    id: "Identity gate leaves ${qubit} unchanged — useful as a placeholder.",
    s: "S gate adds a 90° (π/2) phase to ${qubit}'s |1⟩ state.",
    sdg: "S† (S-dagger) removes a 90° (π/2) phase from ${qubit}'s |1⟩ state.",
    t: "T gate adds a 45° (π/4) phase to ${qubit}'s |1⟩ state.",
    tdg: "T† (T-dagger) removes a 45° (π/4) phase from ${qubit}'s |1⟩ state.",
    //multi-qubit 
    cx: "CNOT flips the target ${qubit} if the control ${control} is in state |1⟩.",
    cz: "Controlled-Z flips the phase of the target ${qubit} if the control ${control} is |1⟩.",
    ccx: "Toffoli (CCX) flips the target ${qubit} only if **both** control ${control1} and ${control2} are |1⟩.",
    swap: "SWAP exchanges the quantum states between ${qubit1} and ${qubit2}.",
    //Rotation
    rx: "RX rotates ${qubit} around the X-axis by ${theta}",
    ry: "RY rotates ${qubit} around the Y-axis by ${theta}",
    rz: "RZ rotates ${qubit} around the Z-axis by ${theta}",
    //Universal Single qubit 
    u: "U rotates ${qubit} with angles θ = ${theta}, φ = ${phi}, and λ = ${lambda}.",
    u1: "U1 applies a pure Z rotation (a phase shift) of ${lambda} to ${qubit}.",
    u2: "U2 is a π/2 rotation around the Bloch sphere for ${qubit}.",
    u3: "U3 rotates ${qubit} with angles θ = ${theta}, φ = ${phi}, and λ = ${lambda}.",
    //measurement
    measure: "Measurement collapses the state into classical 0 or 1 based on probability."
  };  

export function getGate(gateName: string, qubits: number[], params: string[]):string {
    const def = gateDef[gateName];
    return def 
    .replace("${qubit}", `qubit ${qubits[0] ?? "?"}`)
    .replace("${control}", `qubit ${qubits[0] ?? "?"}`)
    .replace("${target}", `qubit ${qubits[1] ?? "?"}`)
    .replace("${qubit1}", `qubit ${qubits[0] ?? "?"}`)
    .replace("${qubit2}", `qubit ${qubits[1] ?? "?"}`)
    .replace("${qubit3}", `qubit ${qubits[2] ?? "?"}`)
    .replace("${theta}", params[0] ?? "?")
    .replace("${phi}", params[1] ?? "?")
    .replace("${lambda}", params[2] ?? "?");
  };

