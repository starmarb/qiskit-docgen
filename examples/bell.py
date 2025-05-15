from qiskit import QuantumCircuit
from qiskit.quantum_info import SparsePauliOp
from qiskit.transpiler import generate_preset_pass_manager

# creates a new circuit with 2 qubits
qc = QuantumCircuit(2)

# add a hadamard to qubit 0
qc.h(0)

# controlled-x on 1, controlled by 0
qc.cx(0,1)

qc.draw("mpl")