// Trie - for fast retrieval of words and prefix-based searches

// eg, inserting the words: "cat", "car", and "cart", then searching for the prefix "ca".

// Step 1: Insert "cat"
// Start at root.
// For 'c': not present, create a new TrieNode.
// For 'a': not present, create a new TrieNode.
// For 't': not present, create a new TrieNode.
// Set isEnd = true at 't' node.
// Trie structure so far:
// root
//  └─ 'c'
//      └─ 'a'
//          └─ 't' (isEnd=true)

// Step 2: Insert "car"
// Start at root.
// For 'c': exists, move to 'c' node.
// For 'a': exists, move to 'a' node.
// For 'r': not present, create a new TrieNode.
// Set isEnd = true at 'r' node.
// Trie now:
// root
//  └─ 'c'
//      └─ 'a'
//          ├─ 't' (isEnd=true)
//          └─ 'r' (isEnd=true)

// Step 3: Insert "cart"
// Start at root.
// For 'c': exists.
// For 'a': exists.
// For 'r': exists.
// For 't': not present under 'r', create a new TrieNode.
// Set isEnd = true at 't' node under 'r'.
// Trie now:
// root
//  └─ 'c'
//      └─ 'a'
//          ├─ 't' (isEnd=true)
//          └─ 'r' (isEnd=true)
//              └─ 't' (isEnd=true)

// Step 4: Search for Prefix "ca"
// Start at root.
// For 'c': move to 'c' node.
// For 'a': move to 'a' node.
// Call collectWords on this node with prefix "ca".
// collectWords (node at 'a' with prefix "ca"):
// For 't':
// Node at 't' (isEnd=true) → add "cat" to results.
// For 'r':
// Node at 'r' (isEnd=true) → add "car" to results.
// For 't' under 'r':
// Node at 't' (isEnd=true) → add "cart" to results.

// Results collected:
// ["cat", "car", "cart"]


class TrieNode {
  constructor() {
    this.children = {}; // obj storing child nodes, mapping: character -> TrieNode
    this.isEnd = false; // flag to indicate if the node represents the end of a valid word in the trie.
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode(); // root node — entry point for all inserted words
  }

  // Start from the root, iterate over each character in word.
  // If character char is not yet a child, create a TrieNode for it.
  // Move to the child node, repeat for the next character.
  // After all characters, set isEnd to true to mark that this path forms a full word.
  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isEnd = true;
  }

  // Traverses the trie using the given prefix.
  // If any character is missing, returns empty array.
  // If prefix exists, calls collectWords(node, prefix), gathering all words that start with this prefix.
  searchPrefix(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    return this.collectWords(node, prefix);
  }

  // Starting from the given node and prefix, recursively collects all complete words beneath the current node.
  // If isEnd is true, adds the current prefix (which forms a full word) to results.
  // Recursively explores each child node, extending the prefix.
  collectWords(node, prefix, results = []) {
    if (node.isEnd) results.push(prefix);
    for (let char in node.children) {
      this.collectWords(node.children[char], prefix + char, results);
    }
    return results;
  }
}

export default new Trie();