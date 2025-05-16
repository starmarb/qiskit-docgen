import * as fs from 'fs';

// Define the structure of a gate operation
interface Gate {
  name: string;
  qubits: number[];
}

// Define the final parsed result
interface CircuitData {
  circuitName: string;
  qubitNum: number;
  gates: Gate[];
}

const gateSet = new Set(["h", "cx", "x", "y", "z", "s", "sdg", "t", "tdg", 
  "rx", "ry", "rz", "cy", "cz", "swap", "crz", "cry", "crz", "ccx", "id", "u", "u3"]);
 
const gateNameMap: Record<string, string> = {
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

  const gateDef: Record<string, string> = {
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
    rx: "RX rotates ${qubit} around the X-axis by a given angle.",
    ry: "RY rotates ${qubit} around the Y-axis by a given angle.",
    rz: "RZ rotates ${qubit} around the Z-axis by a given angle.",
    //Universal Single qubit 
    u: "U will apply a rotation to the ${qubit}, defined by ${theta}, ${phi}, ${lambda}",
    u1: "U1 applies a pure Z rotation (a phase shift) of ${lambda} to ${qubit}.",
    u2: "U2 is a π/2 rotation around the Bloch sphere for ${qubit}.",
    u3: "U3 is the most general single-qubit rotation gate applied to ${qubit}.",
    //measurement
    measure: "Measurement collapses the state into classical 0 or 1 based on probability."
  };  

// Main parsing function
export function parseCircuit(filePath: string): CircuitData {
  let markdown = "";
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  let circuitName = '';
  let qubitNum = 0;
  const gates: Gate[] = [];

  function getGate(gateName: string, qubits: number[], params: string[]):string {
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
  }

  for (const line of lines) {
    const trimmedLine = line.trim();

    // 1. Detect QuantumCircuit assignment
    const matchCircuit = trimmedLine.match(/(\w+)\s*=\s*QuantumCircuit\((\d+)\)/);
    if (matchCircuit) {
      circuitName = matchCircuit[1];
      qubitNum = parseInt(matchCircuit[2], 10);
      continue;
    }

    // 2. Detect gate calls, only if we have a circuit name already
    // 3. Push to Markdown file with this information. 

    if (circuitName) {
      const gateRegex = new RegExp(`^${circuitName}\\.([a-zA-Z_][a-zA-Z0-9_]*)\\((.*?)\\)`);
      const matchGate = trimmedLine.match(gateRegex);

      if (matchGate) {
        const gateName = matchGate[1];

        if (gateName in gateNameMap) { 
          const rawArgs = matchGate[2].split(',').map(arg => arg.trim());
          const allNumbers = rawArgs.map(x => isNaN(Number(x)) ? x : Number(x));
          let qubits: number[] = [];
          let params: string[] = [];

          // check if it's a rotation gate
          if (["u", "u3"].includes(gateName)) {
            qubits = [Number(allNumbers[3])];
            params = allNumbers.splice(0,3).map(String);
          }
           else if (["u1", "u2"].includes(gateName)) {
            params = allNumbers.slice(0, allNumbers.length - 1).map(String);
            qubits = [Number(allNumbers[allNumbers.length - 1])];
          } else if (["rx", "ry", "rz"].includes(gateName)) {
            params = [String(allNumbers[0])];
            qubits = [Number(allNumbers[1])];
          } else {
            qubits = allNumbers.map(Number);
          }
          const gateInfo = getGate(gateName, qubits, params);
          markdown += `### ${gateNameMap[gateName]} Gate on ${qubits}\n` ;
          markdown += `${gateInfo}\n\n`;
          gates.push({ name: gateNameMap[gateName], qubits: qubits });
        }
      }
    }
  }
  fs.writeFileSync('circuit.md', markdown);
  return {
    circuitName,
    qubitNum,
    gates
  };
}
const isMain = import.meta.url === process.argv[1] || import.meta.url === `file://${process.argv[1]}`;

if (isMain) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: ts-node parser.ts <path-to-python-file>");
    process.exit(1);
  }
  parseCircuit(filePath);
}
