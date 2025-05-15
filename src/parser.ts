import fs from 'fs';

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

const gateSet = new Set(["h", "cx", "x", "y", "z", "s", "sdg", "t", "tdg", "rx", "ry", "rz", "cy", "cz", "swap", "crz", "cry", "crz", "ccx", "id", "u", "u3"]);
const specialGates = new Set(["measure", "reset", "draw", "barrier"]);


// Main parsing function
export function parseCircuit(filePath: string): CircuitData {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  let circuitName = '';
  let qubitNum = 0;
  const gates: Gate[] = [];

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
    if (circuitName) {
      const gateRegex = new RegExp(`^${circuitName}\\.([a-zA-Z_][a-zA-Z0-9_]*)\\((.*?)\\)`);
      const matchGate = trimmedLine.match(gateRegex);
      if (matchGate) {
        const gateName = matchGate[1];
        if (gateSet.has(gateName)) {
            const qubitArgs = matchGate[2].split(',').map(q => parseInt(q.trim(), 10));
            gates.push({ name: gateName, qubits: qubitArgs });
        }
        else if (specialGates.has(gateName)) {
            const qubitArgs = matchGate[2].split(',').map(q => parseInt(q.trim(), 10));
            gates.push({ name: gateName, qubits: qubitArgs });
        }
      }
    }
  }

  return {
    circuitName,
    qubitNum,
    gates
  };
}
