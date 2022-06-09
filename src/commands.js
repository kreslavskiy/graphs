'use strict';

const readline = require('readline');
const { methods } = require('./graph.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

rl.prompt();

const question = (str) => new Promise((answer) => rl.question(str, answer));

const commands = {
  help() {
    console.log('Commands:', Object.keys(commands).join(', '));
  },

  async new() {
    const name = await question('Enter graph name: ');
    const field = await question('Enter key field: ');
    methods.createNewGraph(name, field);
  },

  async add() {
    const type = await question('Enter type of vertex: ');
    const input = await question('Enter data: ');
    methods.add(input, type);
  },

  async dlink() {
    const linkFrom = await question('From: ');
    const linkTo = await question('To: ');
    methods.link(linkFrom, linkTo);
  },

  async link() {
    const linkFrom = await question('From: ');
    const linkTo = await question('To: ');
    methods.link(linkFrom, linkTo, true);
  },

  async select() {
    const query = await question('Enter data: ');
    const links = await question('Enter links: ');
    const selected = methods.select(query);
    const linked = methods.linked(links);
    if (selected.length && linked.length) {
      const res = selected.filter((value) => linked.includes(value));
      console.dir(res);
    } else console.dir([...selected, ...linked]);
  },

  async modify() {
    const vertex = await question('Vertex you want to modify: ');
    const data = await question('Data you want to modify: ');
    methods.modifyVertex(vertex, data);
  },

  async delete() {
    const vertexToDelete = await question('Enter vertex you want to delete: ');
    methods.deleteVertex(vertexToDelete);
  },

  async unlink() {
    const deleteFrom = await question('Vertex you want to delete links from: ');
    const deleted = await question('Links you want to delete: ');
    methods.deleteLinks(deleteFrom, deleted);
  },

  async save() {
    const name = await question('Enter file name: ');
    methods.save(name);
  },

  async import() {
    const fileName = await question('Enter file name: ');
    const field = await question('Enter key field: ');
    methods.getGraphFromFile(fileName, field);
  },

  async clear() {
    const graphName = await question('Enter name of graph you want to clear: ');
    methods.deleteGraph(graphName);
  },

  show() {
    methods.showGraph();
  },

  exit() {
    rl.close();
    console.clear();
  },
};

rl.on('line', async (line) => {
  line = line.trim();
  const command = commands[line];
  if (command) await command();
  else console.log('\x1b[31m', 'Unknown command', '\x1b[0m');
  rl.prompt();
}).on('close', () => process.exit(0));
