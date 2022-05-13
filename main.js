'use strict';

const readline = require('readline');
const graph = require ('./graph.js');

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

const commands = {
  help () {
    console.log('Commands:', Object.keys(commands).join(', '));
  },
  async setkf () {
    const field = await question ('Enter key field: ');
    graph.keyFieldSetter (field);
  },
  async add () {
    const input = await question ('Enter data: ');
    graph.add (input);
  },
  async link () {
    const linkFrom = await question ('From: ');
    const linkTo = await question ('To: ');
    graph.link(linkFrom).to(linkTo);
  },
  async select () {
    const query = await question ('');
    const res = graph.select(query);
    console.dir(res);
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
