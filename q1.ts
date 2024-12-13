// Inorder Traversal Requires a specific definition when dealing with non-binary trees.
// Here I have splitted the children in two parts and then traversed the left part first then root and then right part.

class TreeNode {
	value: String;
	children: TreeNode[];

	constructor(value: String) {
		this.value = value;
		this.children = [];
	}

	addNode(node: TreeNode) {
		this.children.push(node);
	}
	getChilds(): TreeNode[] {
		return this.children;
	}
}
/**
 *
 * @param root accepts root node of tree
 * @returns inorder traversal of tree
 *
 *
 */
const inorder = (root: TreeNode): String[] => {
	var order: String[] = [];
	var children = root.getChilds();
	const mid = Math.floor(children.length / 2);
	for (let i = 0; i < mid; i++) {
		var childInorder = inorder(children[i]);
		order = [...order, ...childInorder];
	}
	order.push(root.value);
	for (let i = mid; i < children.length; i++) {
		var childInorder = inorder(children[i]);
		order = [...order, ...childInorder];
	}
	return order;
};

const A = new TreeNode("A");
const B = new TreeNode("B");
const C = new TreeNode("C");
const D = new TreeNode("D");
const E = new TreeNode("E");
const F = new TreeNode("F");
const G = new TreeNode("G");
const H = new TreeNode("H");
const I = new TreeNode("I");
const J = new TreeNode("J");
const K = new TreeNode("K");
const L = new TreeNode("L");

const root = A; // assigning A as root

// inserting child of A
for (const node of [B, C, D, E]) {
	A.addNode(node);
}

// inserting child of B
for (const node of [F, G]) {
	B.addNode(node);
}

// inserting child of G
G.addNode(L);

// inserting child of D
for (const node of [H, I, J]) {
	D.addNode(node);
}

// inserting child of E
E.addNode(K);

console.log(inorder(A));
