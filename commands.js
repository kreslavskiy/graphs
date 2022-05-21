'use strict';

const { dir } = require('console');
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
    graph.methods.link(linkFrom).to(linkTo);
  },
  async select() {
    const query = await question('Enter data: ');
    const links = await question('Enter links: ');
    const selected = graph.methods.select(query);
    const linked = graph.methods.linked(links);
    if (selected != [] && linked != []) {
      const output = selected.filter(value => linked.includes(value));
      console.dir(output);
    } else if (selected === [] && linked !== []) {
      console.dir(linked);
    } else if (selected !== [] && linked === []) {
      console.dir(selected);
    }
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
  show() {
    const res = graph.methods.showGraph();
    console.dir(res);
  },
  exit() {
    rl.close();
    console.clear();
  },
};
