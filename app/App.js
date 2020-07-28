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
      mode: "iterative",
      tree: {
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
      }
    }
  }

  addNode = (depth, path) => {
    const { tree } = this.state;
    if (depth === 0) tree.children.push({ name: 'node', children: [] });
    else pushValue(tree, { name: 'node', children: [] }, path.substring(1, path.length));
    this.setState({tree});
  }

  renderNode = (object, depth, path) => {
    if (this.state.mode === 'iterative')
      return (
        <View style={{paddingLeft: 5 * (depth + 1), marginBottom: 5}}>
          <View style={styles.nameContainer}>
            <Text>{object.name}</Text>
            <TouchableOpacity style={styles.button} onPress={this.addNode.bind(this, depth, path)}>
              <Text style={styles.buttonText}>Add node</Text>
            </TouchableOpacity>
          </View>
          {object.children.map((child, index) => this.renderNode(child, depth + 1, path + `.children.${index}`))}
        </View>
      )
    else {
      return (
        <View style={{paddingLeft: 5 * (depth + 1), marginBottom: 5}}>
          <View style={styles.nameContainer}>
            <Text>{object.name}</Text>
            <TouchableOpacity style={styles.button} onPress={this.addNode.bind(this, depth, path)}>
              <Text style={styles.buttonText}>Add node</Text>
            </TouchableOpacity>
          </View>
          {object.children.map((child, index) => this.renderNode(child, depth + 1, path + `.children.${index}`))}
        </View>
      )
    }
  }

  mapTree = () => <View>{this.renderNode(this.state.tree, 0, '')}</View>
  switchMode = () => this.setState({mode: this.state.mode === 'iterative' ? 'recursive' : 'iterative'})

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.modeButton} onPress={this.switchMode}>
          <Text style={styles.buttonText}>Switch mode</Text>
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