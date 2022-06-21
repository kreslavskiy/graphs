'use strict';

class Vertex {
  constructor(graphName, type, data) {
    this.graphName = graphName;
    this.type = type;
    this.data = data;
    this.links = new Array();
  }

  get linksKeys() {
    const keys = new Array();
    for (const link of this.links) {
      keys.push(link.key);
    }
    return keys;
  }
}

module.exports = { Vertex };
