import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';

function pushValue(obj, value, path) {
  let i;
  path = path.split('.');
  for (i = 0; i < path.length - 1; i++)
    obj = obj[path[i]];

  obj[path[i]].children.push(value);
}

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      mode: "recursive",
      recursiveTree: {
        name: 'Main node',
        children: [
          { 
            name: 'node',
            children: [
              { name: 'node', children: [] },
              { name: 'node', children: [] }
            ]
          },
          { name: 'node', children: [] },
          { name: 'node', children: [] }
        ]
      },
      iterativeTree: [
        { name: 'Main node', depth: 0 },
        { name: 'node', depth: 1 },
        { name: 'node', depth: 2 },
        { name: 'node', depth: 2 },
        { name: 'node', depth: 1 },
        { name: 'node', depth: 1 }
      ]
    }
  }

  addRecursiveNode = (depth, path) => {
    const { recursiveTree } = this.state;
    if (depth === 0) recursiveTree.children.push({ name: 'node', children: [] });
    else pushValue(recursiveTree, { name: 'node', children: [] }, path.substring(1, path.length));
    this.setState({recursiveTree});
  }
  addIterativeNode = (depth, index) => {
    const { iterativeTree } = this.state;
    if (index + 1 === iterativeTree.length) iterativeTree.push({ name: 'node', depth: depth + 1});
    for (let i = index + 1; i < iterativeTree.length; i++) {
      if (iterativeTree[i].depth <= depth) {
        iterativeTree.splice(i, 0, { name: 'node', depth: depth + 1});
        break;
      } 
      else if (i === iterativeTree.length - 1) 
        iterativeTree.push({ name: 'node', depth: depth + 1});
    }
    this.setState({iterativeTree});
  }

  renderRecursiveNode = (object, depth, path) => {
    return (
      <View style={{paddingLeft: 5 * (depth + 1), marginBottom: 5}}>
        <View style={styles.nameContainer}>
          <Text>{object.name}</Text>
          <TouchableOpacity style={styles.button} onPress={this.addRecursiveNode.bind(this, depth, path)}>
            <Text style={styles.buttonText}>Add node</Text>
          </TouchableOpacity>
        </View>
        {object.children.map((child, index) => this.renderRecursiveNode(child, depth + 1, path + `.children.${index}`))}
      </View>
    )
  }
  iterateTree = (tree) => {
    return (
      <View>
        {tree.map((child, i) => (
          <View key={i} style={{paddingLeft: 15 * child.depth, marginBottom: 5}}>
            <View style={styles.nameContainer}>
              <Text>{child.name}</Text>
              <TouchableOpacity style={styles.button} onPress={this.addIterativeNode.bind(this, child.depth, i)}>
                <Text style={styles.buttonText}>Add node</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    )
  }

  mapTree = () => {
    if (this.state.mode === 'recursive') return this.renderRecursiveNode(this.state.recursiveTree, 0, '');
    else return this.iterateTree(this.state.iterativeTree);
  }
  switchMode = () => this.setState({mode: this.state.mode === 'iterative' ? 'recursive' : 'iterative'});
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.modeButton} onPress={this.switchMode}>
          <Text style={styles.buttonText}>{this.state.mode}</Text>
        </TouchableOpacity>
        <ScrollView>
          {this.mapTree()}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    padding: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3
  },
  button: {
    backgroundColor: 'red',
    marginLeft: 5,
    padding: 3,
    borderRadius: 10
  },
  buttonText: {
    color: '#fff'
  },
  modeButton: {
    backgroundColor: 'red',
    margin: 20,
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});