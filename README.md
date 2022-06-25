# Graphs
This program is created to work with graph data structures.

No libraries used.

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

1. To create a new graph just type 'new', then enter name of the graph and key field

<img width="682" alt="Снимок экрана 2022-06-26 в 00 13 08" src="https://user-images.githubusercontent.com/89911844/175790691-cd3f63cb-72d4-450c-a9cf-7d180361dd95.png">

2. To add a new vertex to your graph use command 'add', then you'll have to enter type of the vertex, which you choose by yourself, and data that the vertex will contain. Pay attention: you mustn’t use quotes, otherwise vertex won't be added to the graph.

<img width="682" alt="Снимок экрана 2022-06-26 в 00 17 12" src="https://user-images.githubusercontent.com/89911844/175790770-524d4116-979d-433f-b606-6f9123420fa6.png">

3. Use 'link' or 'dlink' commands to create relation between vertices. 'link' creates undirected link and 'dlink' is for directed links. Also you'll have to enter name of the link for both commands
Note: you can link multiple vertices at once, it'll work by many-to-many principle 

<img width="682" alt="Снимок экрана 2022-06-26 в 00 22 12" src="https://user-images.githubusercontent.com/89911844/175790896-b4e26951-96f9-4ecf-955c-0c42b256ae3a.png">

4. Now, when you have a graph of 2 vertices, you may want to see it. Use command 'show' for it!

<img width="682" alt="Снимок экрана 2022-06-26 в 00 24 27" src="https://user-images.githubusercontent.com/89911844/175790949-c1d726c6-692d-4e16-bead-0a9a64352f07.png">

5. If you created many vertices and you want to see concrete ones, you can use command 'select', and select vertices by data:

or by links:

or by both:

6. To modify vertex data, you should use command 'modify', choose the vertex you want to change and enter new data. All new data will overwrite on existing one.

<img width="682" alt="Снимок экрана 2022-06-26 в 00 28 24" src="https://user-images.githubusercontent.com/89911844/175791040-3aadbf7d-6438-4103-86b0-e0c05cd6af60.png">

Note: you can change even key field of data!

<img width="682" alt="Снимок экрана 2022-06-26 в 00 31 37" src="https://user-images.githubusercontent.com/89911844/175791099-8cb1da7b-9720-464c-9ca7-6b449477b66a.png">

7. If you want to delete relation between vertices, use 'unlink' command. 
Note: it also works by many-to-many principle!

<img width="682" alt="Снимок экрана 2022-06-26 в 00 34 28" src="https://user-images.githubusercontent.com/89911844/175791147-fa6cf556-5b09-4008-8931-863855e53dfa.png">

8. Now we can delete usless vertex by using command 'delete'

<img width="682" alt="Снимок экрана 2022-06-26 в 00 35 45" src="https://user-images.githubusercontent.com/89911844/175791165-b675b9b7-9828-4229-a50e-d94b993b04ae.png">

9. You also can save your graph, type 'save', enter file name and it'll be saved in .json format
10. After saving, you can also open your graph in my program. Use command 'import' and enter file name
11. If you created a graph and you want to concatinate it with another one, you can use command 'join', it'll upload data from entered file and unite these 2 graphs
12. To delete all vertices at once use command 'clear', but you need to enter the name of graph to chack if you are sure

<img width="682" alt="Снимок экрана 2022-06-26 в 00 41 26" src="https://user-images.githubusercontent.com/89911844/175791252-7b3a00cd-e13b-4885-9198-0a13c47d434d.png">

13. To quit program use command 'exit'. IF you have unsaved data, it'll ask you if you want to save it. Type 'y' if you do and 'n' if don’t 

## Testing

To test the program, type ```node tests/tests.js```, it expects everething to execute successfully. 

<img width="682" alt="Снимок экрана 2022-06-26 в 00 47 42" src="https://user-images.githubusercontent.com/89911844/175791406-7282c320-3b54-4573-8c19-fb61c9dc8f4a.png">

Then type ```node tests/testsErrors.js```, it expects everything to throw errors.

<img width="682" alt="Снимок экрана 2022-06-26 в 00 48 10" src="https://user-images.githubusercontent.com/89911844/175791417-ab2a3750-1e5f-4b06-b9ce-ac4f660f89e0.png">

