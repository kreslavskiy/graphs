'use strict';

const readline = require('readline');
const vm = require('vm');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (line) => {
  line = line.trim();
  const command = commands[line];
  if (command) command();
  else console.log('\x1b[31m', 'Unknown command', '\x1b[0m');
  rl.prompt();
});

rl.on('close', () => process.exit(0));

const question = (str) => new Promise((answer) => rl.question(str, answer));

class Vertex {
  constructor (graph, data) {
    this.graph = graph;
    this.data = data;
    this.links = new Map();
  }

  link(...args) {
    const distinct = new Set(args);
    const { links } = this;
    const keyField = graph.keyField;
    for (const item of distinct) {
      const key = item.data[keyField];
      links.set(key, item);
    }
    return this;
  }
}

class Cursor {
  constructor(vertices) {
    this.vertices = vertices;
  }

  linked(...names) {
    const { vertices } = this;
    const result = new Set();
    for (const vertex of vertices) {
      let condition = true;
      for (const name of names) {
        condition = condition && vertex.links.has(name);
      }
      if (condition) result.add(vertex);
    }
    return new Cursor(result);
  }
}

const graph  = {
  
  keyField: undefined,
  vertices: new Map(),

  async keyFieldSetter () {
    const keyField = await question ('Enter key field: ');
    graph.keyField = keyField;
    return keyField;
  },

  async add () {
    const input = await question ('Enter data: ');
    const inputExec = '{' + input + '}';
    const script = vm.createScript('(' + inputExec + ')');
    const data = script.runInThisContext();
    console.dir(data);
    const vertex = new Vertex(this, data);
    const key = data[graph.keyField];
    if (graph.vertices.get(key) === undefined) {
      graph.vertices.set(key, vertex);
    }
    return vertex;
  },

  link (source) {
    const vertices = graph.vertices;
    const from = vertices.get(source);
    return {
      to(destination) {
        if (from) {
            const target = vertices.get(destination.toString());
            if (target) from.link(target);
        }
      }
    };
  },

  select(query) {
    const vertices = new Set();
    for (const vertex of this.vertices.values()) {
      let condition = true;
      const { data } = vertex;
      if (data) {
        for (const field in query) {
          condition = condition && data[field] === query[field];
        }
        if (condition) vertices.add(vertex);
      }
    }
    return new Cursor(vertices);
  },

  showData() {
    const result = new Map (graph.vertices);
    result.forEach((vertex) => {
      delete vertex.graph;
    });
    return result;
  }
}

const commands = {
  help () {
    console.log('Commands:', Object.keys(commands).join(', '));
  },
  setkf () {
    graph.keyFieldSetter ();
  },
  add () {
    graph.add ();
  },
  async link () {
    const linkFrom = await question ('from ');
    const linkTo = await question ('to ');
    graph.link(linkFrom).to(linkTo);
  },
  show () {
    const res = graph.showData();
    console.dir (res);
  },
  exit () {
    rl.close();
    console.clear();
  },
};