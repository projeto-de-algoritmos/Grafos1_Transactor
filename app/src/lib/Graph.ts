import { faker } from '@faker-js/faker';

interface Node {
  id: number;
  img: any;
  name: string;
  balance: number;
  edges: Map<number, number>;
}

export class Graph {
  private nodes: Map<number, Node>;
  private lastNodeId: number;

  constructor() {
    this.nodes = new Map();
    this.lastNodeId = 0;
  }

  addNode(name: string, balance: number): void {
    const img = new Image();
    img.src = faker.image.avatar();
    this.lastNodeId++;
    this.nodes.set(this.lastNodeId, {
      id: this.lastNodeId,
      name,
      balance,
      img,
      edges: new Map(),
    });
  }

  addEdge(from: number, to: number, amount: number): void {
    if (this.nodes.has(from) && this.nodes.has(to)) {
      const fromNode = this.nodes.get(from)!;
      const toNode = this.nodes.get(to)!;

      fromNode.edges.set(to, amount);
      fromNode.balance -= amount;
      toNode.balance += amount;
    }
  }

  getBalance(id: number): number {
    if (this.nodes.has(id)) {
      return this.nodes.get(id)!.balance;
    }
    return 0;
  }

  getNode(id: number): Node | undefined {
    return this.nodes.get(id);
  }

  getHighestBalance(): Node | null {
    let highestBalance = -Infinity;
    let personWithHighestBalance: Node | null = null;

    for (const node of this.nodes.values()) {
      if (node.balance > highestBalance) {
        highestBalance = node.balance;
        personWithHighestBalance = node;
      } else if (node.balance === highestBalance) {
        return null;
      }
    }

    return personWithHighestBalance;
  }

  getAllNodes(): Node[] {
    const nodesArray: Node[] = [];

    for (const node of this.nodes.values()) {
      nodesArray.push(node);
    }

    return nodesArray;
  }
}

export default Graph;
