import { describe, it, expect } from 'vitest';
import { parseCircuit } from '../src/parser';
import * as fs from 'fs';
import * as path from 'path';

const TEST_DIR = path.join(__dirname, '../examples');
const TEST_FILE = path.join(TEST_DIR, 'simplecircuit.py');

describe('parseCircuit', () => {
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
});
