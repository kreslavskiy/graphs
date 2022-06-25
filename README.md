# Graphs
This program is created to work with graph data structures
## Installation 
1. Clone the repository: 
```bash
git clone https://github.com/kreslavskiy/graphs
```
2. Run the program:
```bash
node src/commands.js
```
## Usage
Type 'help' to see what which command does.

1. To create new graph just type 'new', then enter name of the graph and key field

<img width="682" alt="Снимок экрана 2022-06-26 в 00 13 08" src="https://user-images.githubusercontent.com/89911844/175790691-cd3f63cb-72d4-450c-a9cf-7d180361dd95.png">

2. To add new vertex to your graph use command 'add', then you'll have to enter type of the vertex, which you choose by yourself, and data that vertex will contain. Pay attention: you mustn’t use qoutes, otherwise vertex won't be added to the graph.

<img width="682" alt="Снимок экрана 2022-06-26 в 00 17 12" src="https://user-images.githubusercontent.com/89911844/175790770-524d4116-979d-433f-b606-6f9123420fa6.png">

3. Use 'link' or 'dlink' commands to create relation between vertices. 'link' creates undirected link and 'dlink' is for directed links. Also you'll have to enter name of the link for both commands
Note: you can link multiple vertices at once, it'll work by many-to-many principle 

<img width="682" alt="Снимок экрана 2022-06-26 в 00 22 12" src="https://user-images.githubusercontent.com/89911844/175790896-b4e26951-96f9-4ecf-955c-0c42b256ae3a.png">
