'use strict';

class Vertex {
  constructor(graphName, type, data) {
    this.graphName = graphName;
    this.type = type;
    this.data = data;
    this.links = new Array();
  }
}

module.exports = { Vertex };
