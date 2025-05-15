# qiskit-docgen

> Generate clean, readable docs from your Qiskit quantum circuits.

`qiskit-docgen` is a CLI tool that takes a Qiskit Python file and outputs a human-readable explanation of the circuit — as Markdown, optionally with inline code comments or rendered circuit diagrams.

## Features

- Converts Qiskit code into Markdown documentation
- Adds inline comments to code files (`--annotate`)
- Optional circuit diagram rendering
- (Coming soon) LLM-based enhanced explanations

## Usage

```bash
npx qiskit-docgen ./examples/bell.py --output ./docs/bell.md --annotate
