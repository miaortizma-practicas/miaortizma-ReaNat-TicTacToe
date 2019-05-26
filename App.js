import React, { Component, Fragment } from 'react';
import { TouchableHighlight, FlatList, Text, View, StyleSheet, Button } from 'react-native';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square(props) {
  return (
    <TouchableHighlight style={{flex: 1}} onPress={props.onPress}>
        <View 
          style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems:'center', 
            backgroundColor: '#fff', borderStyle: 'solid', borderWidth: 1}}
        >
          <Text style={{fontSize: 25, fontWeight: 'bold'}}>{props.value}</Text>
        </View>
    </TouchableHighlight> 
  );
}

class Board extends Component {

  renderSquare(i){
    return (
      <Square 
        value={this.props.squares[i]}
        onPress={() => this.props.onPress(i)}
      />
    );
  }

  render() {
    return ( 
      <Fragment>
        <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}} />
        <View style={{flex: 3, flexDirection: 'row'}}>
          <View style={{flex: 1}} />
          <View style={{flex: 4, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderStyle: 'solid', borderWidth: 1}}>
            <View style={styles.row}>  
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </View>
            <View style={styles.row}>  
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </View>
            <View style={styles.row}>  
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </View>
          </View>
          <View style={{flex: 1}} />
        </View>
      </Fragment>
    );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handlePress(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: ( step % 2 ) == 0,
    });
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <View style={{flex:1}}>
        <Board 
          squares={current.squares}
          onPress={(i) => this.handlePress(i)}
        />
        <View style={{flex:6, alignItems: 'center'}}>
          <Text>{status}</Text>
          <FlatList
            data={this.state.history}
            keyExtractor={(item, index)  => index.toString()}
            renderItem={(item) => {
              const index = item.index;
              const desc = index ?
                'Go to move #' + index :
                'Go to game start';
              return (
                <Button 
                  onPress={() => this.jumpTo(index)}
                  title={desc}
                />
              );
            }}
          >
          </FlatList>
        </View>
      </View>
    );
  }
}

export default class App extends Component {

  render() {
    return (
      <Game />
    );
  }
}

const styles = StyleSheet.create({
  row: {flex: 1, flexDirection: 'row', alignSelf: 'stretch'},
});
