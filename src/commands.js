'use strict';

const readline = require('readline');
const fs = require('fs');
const { Graph } = require('./classes/Graph.js');
const { alert, displayVertices } = require('./tools.js');

console.log('Type "help" to see all commands!');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

rl.prompt();

const question = (str) => new Promise((answer) => rl.question(str, answer));

let graph = new Graph();

const commands = {
  help() {
    const message = fs.readFileSync('src/documentation.txt', 'utf-8');
    console.log(message);
  },

  async new() {
    const name = await question('Enter graph name: ');
    const field = await question('Enter key field: ');
    graph = new Graph(name, field, null);
    return graph;
  },

  async add() {
    const type = await question('Enter type of vertex: ');
    const input = await question('Enter data: ');
    graph.add(input, type);
  },

  async dlink() {
    const linkFrom = await question('From: ');
    const linkTo = await question('To: ');
    const type = await question('Enter link name: ');
    graph.link(linkFrom, linkTo, type, true);
  },

  async link() {
    const linkFrom = await question('From: ');
    const linkTo = await question('To: ');
    const name = await question('Enter link name: ');
    graph.link(linkFrom, linkTo, name);
  },

  async select() {
    const query = await question('Enter data: ');
    const links = await question('Enter links: ');
    const selected = graph.select(query);
    const link = graph.getLinked(links);
    if (![...selected, ...link].length) return alert('yell', 'Nothing found');
    if (selected.length && link.length) {
      const res = selected.filter((value) => link.includes(value));
      displayVertices(res, graph.keyField);
    } else displayVertices([...selected, ...link], graph.keyField);
  },

  async modify() {
    const vertex = await question('Vertex you want to modify: ');
    const data = await question('Data you want to modify: ');
    graph.modifyVertex(vertex, data);
  },

  async delete() {
    const vertexToDelete = await question('Enter vertex you want to delete: ');
    graph.deleteVertex(vertexToDelete);
  },

  async unlink() {
    const deleteFrom = await question('Vertex you want to delete links from: ');
    const deleted = await question('Links you want to delete: ');
    graph.deleteLinks(deleteFrom, deleted);
  },

  async save() {
    const name = await question('Enter file name: ');
    graph.saveToFile(name);
  },

  async import() {
    const fileName = await question('Enter file name: ');
    graph.setGraph(fileName);
  },

  async join() {
    const fileName = await question('Enter file name: ');
    graph.mergeTwoGraphs(fileName);
  },

  async clear() {
    const graphName = await question('Enter name of graph you want to clear: ');
    graph.deleteGraph(graphName);
  },

  show() {
    if (!graph) return alert('red', 'You have not created graph yet');
    console.log('Graph name:', graph.graphName);
    if (!graph.vertices.size)
      return alert('red', 'There is no vertices in graph');
    const vertices = graph.vertices.values();
    displayVertices(vertices, graph.keyField);
  },

  async exit() {
    if (!graph.directory) {
      const toSave = await question(
        'Seems like you have unsaved changes. Wanna save?(y/n) '
      );
      if (toSave === 'y') await commands.save();
    }
    rl.close();
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
