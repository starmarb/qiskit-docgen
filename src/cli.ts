import fs from 'fs';
import path from 'path';
import { parseCircuit } from './parser.ts';

const args = process.argv.slice(2);
const inputPath = args[0];

if (!inputPath) {
  console.error("Please provide a Python file path.");
  process.exit(1);
}

const fullPath = path.resolve(inputPath);

if (!fs.existsSync(fullPath)) {
  console.error(`File not found: ${fullPath}`);
  process.exit(1);
}

const result = parseCircuit(fullPath);
console.log(JSON.stringify(result, null, 2));