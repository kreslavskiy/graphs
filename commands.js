'use strict';

const readline = require('readline');
const graph = require('./graph.js');

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
}).on('close', () => process.exit(0));

const question = (str) => new Promise((answer) => rl.question(str, answer));

const commands = {
  help() {
    console.log('Commands:', Object.keys(commands).join(', '));
  },

  async new() {
    const name = await question('Enter graph name: ');
    const field = await question('Enter key field: ');
    graph.methods.createNewGraph(name, field);
  },

  async add() {
    const input = await question('Enter data: ');
    graph.methods.add(input);
  },

  async link() {
    const linkFrom = await question('From: ');
    const linkTo = await question('To: ');
    graph.methods.link(linkFrom, linkTo);
  },

  async select() {
    const query = await question('Enter data: ');
    const links = await question('Enter links: ');
    const selected = graph.methods.select(query);
    const linked = graph.methods.linked(links);
    if (selected != [] && linked != []) {
      const output = selected.filter((value) => linked.includes(value));
      console.dir(output);
    } else if (selected === [] && linked !== []) {
      console.dir(linked);
    } else if (selected !== [] && linked === []) {
      console.dir(selected);
    }
  },

  async modify() {
    const vertex = await question('Vertex you want to modify: ');
    const data = await question('Data you want to modify: ');
    graph.methods.modifyVertex(vertex, data);
  },

  async delete() {
    const vertexToDelete = await question('Enter vertex you want to delete: ');
    graph.methods.deleteVertex(vertexToDelete);
  },

  async unlink() {
    const deleteFrom = await question('Vertex you want to delete links from: ');
    const deleted = await question('Links you want to delete: ');
    graph.methods.deleteLinks(deleteFrom, deleted);
  },

  async save() {
    const name = await question('Enter file name: ');
    graph.methods.save(name);
  },

  async import() {
    const fileName = await question('Enter file name: ');
    const name = await question('Enter graph name: ');
    const field = await question('Enter key field: ');
    graph.methods.getGraphFromFile(fileName, name, field);
  },

  async clear() {
    const graphName = await question('Enter name of graph you want to clear: ');
    graph.methods.deleteGraph(graphName);
  },

  show() {
    graph.methods.showGraph();
  },

  exit() {
    rl.close();
    console.clear();
  },
};
