import { beforeEach, describe, it, expect } from 'vitest';
import { parseCircuit } from '../src/parser';
import * as fs from 'fs';
import * as path from 'path';

const TEST_DIR = path.join(__dirname, '../examples');
const TEST_FILE = path.join(TEST_DIR, 'simplecircuit.py');

describe('parseCircuit', () => {
beforeEach(() => {
    // Clear markdown file if it exists
    const mdPath = 'circuit.md';
    if (fs.existsSync(mdPath)) fs.unlinkSync(mdPath);
  });

  it('parses a basic Hadamard + CNOT circuit correctly', () => {
    const result = parseCircuit(TEST_FILE);

    expect(result.circuitName).toBe('qc');
    expect(result.qubitNum).toBe(2);
    expect(result.gates).toEqual([
      { name: 'Hadamard', qubits: [0] },
      { name: 'CNOT', qubits: [0, 1] }
    ]);

    const md = fs.readFileSync('circuit.md', 'utf-8');
    expect(md).toMatch(/Hadamard Gate/);
    expect(md).toMatch(/CNOT Gate/);
  });

  it('parses u3 gate with 3 params and 1 qubit', () => {
    const filePath = path.join(TEST_DIR, 'u3_gate.py');
    const result = parseCircuit(filePath);
  
    expect(result.gates.length).toBe(1);
    expect(result.gates[0].name).toBe('U3');
    expect(result.gates[0].qubits).toEqual([0]);
  
    const md = fs.readFileSync('circuit.md', 'utf-8');
    expect(md).toMatch(/U3 Gate/);
    expect(md).toMatch(/3.14/);
    expect(md).toMatch(/1.57/);
    expect(md).toMatch(/0.78/);
  });

  it('parses rz gate with param and qubit', () => {
    const filePath = path.join(TEST_DIR, 'rz_gate.py');
    const result = parseCircuit(filePath);
  
    expect(result.gates.length).toBe(1);
    expect(result.gates[0].name).toBe('RZ');
    expect(result.gates[0].qubits).toEqual([0]);
  
    const md = fs.readFileSync('circuit.md', 'utf-8');
    expect(md).toMatch(/RZ Gate/);
    expect(md).toMatch(/1.234/);
  });

});
