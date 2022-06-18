'use strict';

const fs = require('fs');
const { Graph } = require('./classes/Graph');
const { Vertex } = require('./classes/Vertex');
const {
  deserialize,
  removeFromArray,
  alert,
  checkInput,
  addQuotes,
  normalizeInput,
} = require('./tools.js');

let graph = new Graph();

const createNewGraph = (graphName, keyField) => {
  graph = new Graph(graphName, keyField, null);
  return graph;
};

const add = (input, vertexType) => {
  if (!checkInput(input)) return;
  const inputNormalized = addQuotes(input);
  const data = deserialize(inputNormalized);
  const vertex = new Vertex(graph.graphName, vertexType, data);
  if (Object.prototype.hasOwnProperty.call(data, graph.keyField)) {
    const key = data[graph.keyField];
    if (!graph.vertices.has(key)) {
      graph.vertices.set(key, vertex);
      alert('green', 'Vertex added to the graph successfully');
    }
  } else alert('red', 'Vertex must contain key field');
  return vertex;
};

const createRelation = (vertex, destination, linkName) => {
  const keyField = graph.keyField;
  const key = destination.data[keyField];
  vertex.links.push({ key, linkName });
};

const link = (source, destination, name, directed = false) => {
  const sources = normalizeInput(source);
  const destinations = normalizeInput(destination);
  const vertices = graph.vertices;
  for (const vertex of sources) {
    const from = vertices.get(vertex);
    for (const link of destinations) {
      const target = vertices.get(link);
      if (from && target && !from.links.includes(link)) {
        createRelation(from, target, name);
        if (directed && !target.links.includes(vertex))
          createRelation(target, from, name);
      } else alert('red', 'One of these vertex does not exist');
    }
  }
};

const select = (query) => {
  const result = new Array();
  if (query) {
    if (!checkInput(query)) return;
    const normalized = addQuotes(query);
    const input = deserialize(normalized);
    for (const vertex of graph.vertices.values()) {
      const { data } = vertex;
      if (data) {
        for (const field in input) {
          if (data[field] === input[field]) result.push(vertex);
        }
      }
    }
  }
  return result;
};

const getAllLinks = (vertex) => {
  const links = [];
  for (const link of vertex.links) {
    links.push(link.key);
  }
  return links;
};

const getLinked = (links) => {
  const result = new Set();
  links = links.replaceAll(' ', '').split(',');
  for (const vertex of graph.vertices.values()) {
    const vertexLinks = getAllLinks(vertex);
    for (const link of links) {
      if (vertexLinks.includes(link)) result.add(vertex);
    }
  }
  return Array.from(result);
};

const showGraph = () => {
  console.log('Graph name:', graph.graphName);
  if (!graph.vertices.size)
    return alert('red', 'There is no vertices in graph');
  const vertices = graph.vertices;
  for (const vertex of vertices.values()) {
    const key = vertex.data[graph.keyField];
    const loh = new Object(vertex);
    const { graphName, ...output } = loh;
    console.log(key, '=>', output);
  }
};

const saveToFile = async (fileName) => {
  const file = `${fileName}.json`;
  const vertices = Object.fromEntries(graph.vertices);
  let data = JSON.stringify(vertices);
  if (fs.existsSync(file)) {
    const oldData = JSON.parse(fs.readFileSync(file, 'utf-8'));
    data = JSON.stringify(Object.assign(oldData, vertices));
    fs.truncate(file, (err) => {
      if (err) throw err;
    });
  }
  await fs.promises.appendFile(file, data);
};

const getVerticesFromFile = (fileName) => {
  const file = `${fileName}.json`;
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    const parsed = Object.entries(JSON.parse(content));
    const data = new Map(parsed);
    return data;
  } else return alert('red', 'This file does not exist');
};

const setGraph = (fileName, keyField) => {
  const vertices = getVerticesFromFile(fileName);
  const [vertex] = vertices.values();
  graph = new Graph(vertex.graphName, keyField);
  graph.vertices = vertices;
};

const mergeTwoGraphs = (fileName) => {
  const vertices = getVerticesFromFile(fileName);
  graph.vertices = new Map([...graph.vertices, ...vertices]);
};

const deleteGraph = (name) => {
  if (name === graph.graphName) graph.vertices.clear();
};

const deleteRelation = (vertex, linkToDelete) => {
  for (const link of vertex.links) {
    if (link['key'] === linkToDelete) removeFromArray(vertex.links, link);
  }
};

const deleteVertex = (name) => {
  const vertices = graph.vertices;
  const vertexToDelete = vertices.get(name);
  const deletedKey = vertexToDelete.data[graph.keyField];
  const deleted = vertices.delete(name);
  if (deleted) {
    for (const vertex of vertices.values()) {
      deleteRelation(vertex, deletedKey);
    }
  }
};

const deleteLinks = (deleteFrom, deleteWhat) => {
  const linksToDelete = normalizeInput(deleteWhat);
  const vertex = graph.vertices.get(deleteFrom);
  for (const link of linksToDelete) {
    deleteRelation(vertex, link);
  }
};

const renameKey = (oldName, newName, data) => {
  graph.vertices.set(newName, data);
  graph.vertices.delete(oldName);
  for (const vertex of graph.vertices.values()) {
    for (const link of vertex.links) {
      if (link['key'] === oldName) {
        link['key'] = newName;
      }
    }
  }
};

const modifyVertex = (link, newData) => {
  if (!checkInput(newData)) return;
  const modificator = deserialize(addQuotes(newData));
  const vertex = graph.vertices.get(link);
  const keyField = graph.keyField;

  if (graph.vertices.has(modificator[keyField]))
    return alert('red', 'Vertex with this key field is already exists');

  for (const [key, value] of Object.entries(modificator)) {
    if (Object.prototype.hasOwnProperty.call(vertex.data, key)) {
      if (vertex.data[key] !== modificator[key])
        vertex.data[key] = modificator[key];
    } else vertex.data[key] = value;
  }
  if (link !== vertex.data[keyField]) {
    renameKey(link, vertex.data[keyField], vertex);
  }
};

const isSaved = () => {
  if (!graph.directory) return false;
  const vertices = Object.fromEntries(graph.vertices);
  const verticesData = JSON.stringify(vertices);
  const fileData = fs.readFileSync(graph.directory, 'utf-8');
  if (fileData !== verticesData) return false;
  return true;
};

module.exports = {
  createNewGraph,
  add,
  link,
  select,
  getAllLinks,
  getLinked,
  showGraph,
  saveToFile,
  setGraph,
  mergeTwoGraphs,
  deleteVertex,
  deleteGraph,
  deleteLinks,
  modifyVertex,
  renameKey,
  isSaved,
};
