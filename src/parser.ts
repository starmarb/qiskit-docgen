import * as fs from 'fs';
import * as gi from './gateinfo';
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

const gateSet = gi.gateSet;
const gateNameMap = gi.gateNameMap;
const gateDef = gi.gateDef;

// Main parsing function
export function parseCircuit(filePath: string): CircuitData {
  let markdown = "";
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
          const gateInfo = gi.getGate(gateName, qubits, params);
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
