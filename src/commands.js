'use strict';

const readline = require('readline');
const fs = require('fs');
const { alert } = require('./tools.js');
const {
  createNewGraph,
  add,
  link,
  select,
  getLinked,
  showGraph,
  saveToFile,
  setGraph,
  mergeTwoGraphs,
  deleteVertex,
  deleteGraph,
  deleteLinks,
  modifyVertex,
  isSaved,
} = require('./graphMethods.js');

console.log('Type "help" to see all commands!');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

rl.prompt();

const question = (str) => new Promise((answer) => rl.question(str, answer));

const commands = {
  help() {
    const message = fs.readFileSync('src/documentation.txt', 'utf-8');
    console.log(message);
  },

  async new() {
    const name = await question('Enter graph name: ');
    const field = await question('Enter key field: ');
    createNewGraph(name, field);
  },

  async add() {
    const type = await question('Enter type of vertex: ');
    const input = await question('Enter data: ');
    add(input, type);
  },

  async dlink() {
    const linkFrom = await question('From: ');
    const linkTo = await question('To: ');
    const type = await question('Enter link name: ');
    link(linkFrom, linkTo, type, true);
  },

  async link() {
    const linkFrom = await question('From: ');
    const linkTo = await question('To: ');
    const name = await question('Enter link name: ');
    link(linkFrom, linkTo, name);
  },

  async select() {
    const query = await question('Enter data: ');
    const links = await question('Enter links: ');
    const selected = select(query);
    const link = getLinked(links);
    if (![...selected, ...link].length) return alert('yell', 'Nothing found');
    if (selected.length && link.length) {
      const res = selected.filter((value) => link.includes(value));
      console.dir(res);
    } else console.dir([...selected, ...link]);
  },

  async modify() {
    const vertex = await question('Vertex you want to modify: ');
    const data = await question('Data you want to modify: ');
    modifyVertex(vertex, data);
  },

  async delete() {
    const vertexToDelete = await question('Enter vertex you want to delete: ');
    deleteVertex(vertexToDelete);
  },

  async unlink() {
    const deleteFrom = await question('Vertex you want to delete links from: ');
    const deleted = await question('Links you want to delete: ');
    deleteLinks(deleteFrom, deleted);
  },

  async save() {
    const name = await question('Enter file name: ');
    saveToFile(name);
  },

  async import() {
    const fileName = await question('Enter file name: ');
    const field = await question('Enter key field: ');
    setGraph(fileName, field);
  },

  async join() {
    const fileName = await question('Enter file name: ');
    mergeTwoGraphs(fileName);
  },

  async clear() {
    const graphName = await question('Enter name of graph you want to clear: ');
    deleteGraph(graphName);
  },

  show() {
    showGraph();
  },

  async exit() {
    if (!isSaved()) {
      const toSave = await question(
        'Seems like you have unsaved changes. Wanna save?(y/n) '
      );
      if (toSave === 'y') await commands.save();
      rl.close();
    }
  },
};

rl.on('line', async (line) => {
  try {
    line = line.trim();
    const command = commands[line];
    if (command) await command();
    else alert('red', 'Unknown command');
    rl.prompt();
  } catch (err) {
    alert('red', 'Uncought error');
    process.exit();
  }
}).on('close', () => process.exit(0));
