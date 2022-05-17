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
  async key() {
    const field = await question('Enter key field: ');
    graph.keyFieldSetter(field);
  },
  async add() {
    const input = await question('Enter data: ');
    graph.add(input);
  },
  async link() {
    const linkFrom = await question('From: ');
    const linkTo = await question('To: ');
    graph.link(linkFrom).to(linkTo);
  },
  async select() {
    const query = await question('Enter data: ');
    const links = await question('Enter links: ');
    const selected = graph.select(query);
    const linked = graph.linked(links, selected);
    if (links) console.dir(linked);
    else console.dir(selected);
  },
  async save() {
    const name = await question('Enter file name: ');
    graph.save(name);
  },
  show() {
    const res = graph.showGraph();
    console.dir(res);
  },
  exit() {
    rl.close();
    console.clear();
  },
};
