import React, { useState, useRef } from "react";
import TreeChart from "./TreeChart";
import "./App.css";

const initialData = {
  value: "😐",
  children: [
    {
      value: "🙂",
      children: [
        {
          value: "😀"
        },
        {
          value: "😁"
        },
        {
          value: "🤣"
        }
      ]
    },
    {
      value: "😔"
    }
  ]
};

function App() {

  const handleClick = () => {
    initialData.children.push({value: "😔"});
    setData(initialData);
  }

  const [reloadTree, setReloadTree] = useState(false);

  const [numbers, setNumbers] = useState([50,17,12,23,19,9,14,72,54,67,76]);

  const [paths, setPath] = useState([]);

  const [traversalPath, setTraversal] = useState([]);

  var curPath = [];

  var curTraversal = [];

  var prevNode = null;
  
  class Node {
    constructor(value) {
      this.value = value;
      this.children = []; // [null,null];
      // left child: children[0], right child: children[1] 
      this.traverse = "e";  //TEST
    }
  }

  class BinarySearchTree {
    constructor(value) {
      this.root = new Node(value);
    }

    /* insert */
    insert(value) {
      setReloadTree(true);
      console.log(this);
      // create node from value
      var node = new Node(value);
      // if the tree's root is null, set the root to the new node
      if (this.root == null || this.root.value == null || this.root.value === "e") {
          //console.log("Root is null");
          this.root = node;
      }

      var current = this.root;
      while (current) {
        // If tree contains value return
        if (current.value == value) {

          return;
        }
        // value is less than current.value
        else if (value < current.value) {
            
          if (current.children[0] == null || current.children[0].value == "e") {
            current.children[0] = node;
            if (current.children[1]==null){
              current.children[1] = new Node("e");
            }

            return;
          }
          // current = current.left;
          current = current.children[0];
        }
        // value is greater than current.value
        else {
          if (current.children[1] == null || current.children[1].value == "e") {
            // if (current.children[1] == null ){
            if (!current.children[0]) {
              current.children[0] = new Node("e");
            }
            current.children[1] = node;

            return;
            }
          current = current.children[1];
        }
      }
    }

    findMinNode(node) 
    { 
      // if left of a node is null 
      // then it must be minimum node 
      if(node.children[0] === "null" || node.children.length === 0 || node.children[0].value === "e"){
        console.log("ITO YUNG MIN NODE");
        console.log(node);
        return node; 
      }
      else
        return this.findMinNode(node.children[0]); 
    } 

    remove(data) 
    { 
      this.root = this.removeNode(this.root, data); 
      console.log(this);
    } 
  
    // Method to remove node with a  
    // given data 
    // it recur over the tree to find the 
    // data and removes it 
    removeNode(node, key) 
    { 
      // if the root is null then tree is  
      // empty 

      // if(typeof(node) == "undefined") {
      //     return; 
      // }
    
      // if data to be delete is less than  
      // roots data then move to left subtree 
      if(key < node.value) 
      { 
        if(typeof(node.children[0]) == "undefined") {
          return node;
        }

        node.children[0] = this.removeNode(node.children[0], key); 
        return node; 
      } 
    
      // if data to be delete is greater than  
      // roots data then move to right subtree 
      else if(key > node.value) 
      { 
        if(typeof(node.children[1]) == "undefined") {
          return node;
        }

        node.children[1] = this.removeNode(node.children[1], key); 
        return node; 
      } 
    
      else
      { 
        console.log(node);

        if((node.children.length === 0) || (node.children[0].value === "e" && node.children[1].value === "e")) 
        { 

          console.log("BOTH NULL");
          node.value = "e"; 
          node.children.length = 0;
          return node; 
        } 
  
        // deleting node with one children 
        if(node.children[0] === null || node.children[0].value === "e") 
        { 
          console.log("LEFT CHILD YUNG NULL");
            node = node.children[1]; 
            return node; 
        } 
          
        else if(node.children[1] === null || node.children[1].value === "e") 
        { 
          console.log("RIGHT CHILD YUNG NULL");
          node = node.children[0]; 
          return node; 
        } 
  
        // Deleting node with two children 
        // minumum node of the rigt subtree 
        // is stored in aux 
        var aux = this.findMinNode(node.children[1]); 
        node.value = aux.value; 
  
        node.children[1] = this.removeNode(node.children[1], aux.value); 
        return node; 
      } 
    }

    search(data) 
    { 
      curPath = [];
      setPath([]);
      this.searchNode(this.root, data); 
      console.log(this);
    } 
  
    // Method to remove node with a  
    // given data 
    // it recur over the tree to find the 
    // data and removes it 


    searchNode(node, key) 
    { 
      console.log(node.value);    
      // if the root is null then tree is  
      // empty 
      // if(node === "null") 
      //     return null; 
    
      // if data to be delete is less than  
      // roots data then move to left subtree 
      if(key < node.value) 
      { 
        curPath.push(node.value);
        setPath([curPath]);

        if(typeof(node.children[0]) == "undefined") {
          setPath([]);
          return;
        }

        this.searchNode(node.children[0], key); 
        return; 
      } 
    
      else if(key > node.value) 
      { 
        curPath.push(node.value);
        setPath([curPath]);

        if(typeof(node.children[1]) == "undefined") {
          setPath([]);
          return;
        }

        this.searchNode(node.children[1], key); 
        return; 
      } 

      else
      { 
        curPath.push(node.value);
        console.log(curPath);
        setPath([curPath]);
      }
    } 

    inOrder() {
      setTraversal([]);
      curTraversal = [];

      this.inOrderHelper(this.root);
      console.log(curTraversal);
      curTraversal.pop();
      
      setTraversal(curTraversal);
    }

    inOrderHelper(root) {
      if (typeof(root) != "undefined") {
        if (root.value != "e"){
          this.inOrderHelper(root.children[0]);

          console.log(root.value);
          curTraversal.push(root);
          setTraversal([curTraversal]);

          if(prevNode == null){
            prevNode = root;
          }
          else {
            prevNode.traverse = root;
            prevNode = root;
          }

          this.inOrderHelper(root.children[1]);
        }
      }
    }

    preOrder() {
      setTraversal([]);
      curTraversal = [];

      this.preOrderHelper(this.root);
      console.log(curTraversal);
      curTraversal.pop();
      
      setTraversal(curTraversal);
    }

    preOrderHelper(root) {
      if (typeof(root) != "undefined") {
        if (root.value != "e"){

          console.log(root.value);
          curTraversal.push(root);
          setTraversal([curTraversal]);

          if(prevNode == null){
            prevNode = root;
          }
          else {
            prevNode.traverse = root;
            prevNode = root;
          }

          this.preOrderHelper(root.children[0]);

          this.preOrderHelper(root.children[1]);
        }
      }
    }

    postOrder() {
      setTraversal([]);
      curTraversal = [];

      this.postOrderHelper(this.root);
      console.log(curTraversal);
      curTraversal.pop();
      
      setTraversal(curTraversal);
    }

    postOrderHelper(root) {
      if (typeof(root) != "undefined") {
        if (root.value != "e"){

          this.postOrderHelper(root.children[0]);

          this.postOrderHelper(root.children[1]);

          console.log(root.value);
          curTraversal.push(root);
          setTraversal([curTraversal]);

          if(prevNode == null){
            prevNode = root;
          }
          else {
            prevNode.traverse = root;
            prevNode = root;
          }

        }
      }
    }
  } 

  const [constructor, setConstructor] = useState(false);

  if(constructor === false){
    console.log(constructor);
    setConstructor(true);
    var tree = new BinarySearchTree(null);
  }

  //const tree = new BinarySearchTree(null);


  const [data, setData] = useState(new BinarySearchTree(null));

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

 

  

  const doOperation = () => {
    // for (var i = 0; i < numbers.length; i++) {
    //   tree.insert(numbers[i]);
    // }

    //console.log(paths);
  }

  const [numToInsert, setnumInsert] = useState("");

  const [numToDelete, setnumDelete] = useState("");

  const [numToSearch, setnumSearch] = useState("");

  const handleSubmitInsertion = (e) => {
    setTraversal([]);
    setPath([]);
    e.preventDefault();

    var tree = data;
    console.log(tree);
    tree.insert(parseInt(numToInsert));
    setData(tree);
  }

  const handleSubmitDeletion = (e) => {
    setTraversal([]);
    setPath([]);
    e.preventDefault();

    setReloadTree(true);

    var tree = data;
    tree.remove(parseInt(numToDelete));
    setData(tree);
  }

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    setPath([]);
    setTraversal([]);

    setReloadTree(true);

    var tree = data;
    console.log(tree);
    tree.search(parseInt(numToSearch));
    console.log(tree);
  }


  return (
    <React.Fragment>
      <div className = "controls">
        <h1>Binary Search Tree Visualizer</h1>

        <form onSubmit = {handleSubmitInsertion}>
          <input type = "text" value = {numToInsert} required onChange = {(e) => {setnumInsert(e.target.value); setReloadTree(false);}} />
          <input type = "submit" value = "Add number" />
        </form>

        <form onSubmit = {handleSubmitDeletion}>
          <input type = "text" value = {numToDelete} required onChange = {(e) => {setnumDelete(e.target.value); setReloadTree(false);}} />
          <input type = "submit" value = "Delete number" />
        </form>

        <form onSubmit = {handleSubmitSearch}>
          <input type = "text" value = {numToSearch} required onChange = {(e) => {setnumSearch(e.target.value); setReloadTree(false);}} />
          <input type = "submit" value = "Search number" />
        </form>

        <button onClick = {() => setPath([])} className = "reset_button">
          Reset Search Path
        </button>

        <div>
          <button onClick = {() => {data.inOrder(); setReloadTree(false);}}>
            Inorder Traversal
          </button>

          <button onClick = {() => {data.preOrder(); setReloadTree(false);}}>
            Preorder Traversal
          </button>

          <button onClick = {() => {data.postOrder(); setReloadTree(false);}}>
            Postoder Traversal
          </button>

          <button onClick = {() => setTraversal([])} className = "reset_button">
            Reset Traversal Path
          </button>
        </div>
      </div>

      <br/><br/>
      <TreeChart className = "tree" data={data} pathData = {paths} traversalData = {traversalPath} reloadData = {reloadTree}/>


    </React.Fragment>
  );
}

export default App;
