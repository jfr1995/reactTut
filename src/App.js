import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const list = [
  {
    title: "Birdmen",
    url: "http://www.ign.com",
    author: "filip",
    num_of_comments: 3,
    points: 2,
    objectID: 0
  },

  {
    title: "Sega CD ",
    url: "http://www.ign.com",
    author: "rich",
    num_of_comments: 10,
    points: 33,
    objectID: 1
  },
  {
    title: "WingsOfRedemption",
    url: "http://www.ign.com",
    author: "Jordie",
    num_of_comments: 393,
    points: 0,
    objectID: 2
  }
];

class App extends Component {
  //constructor stuff
  constructor(props) {
    super(props);
    this.state = {
      list: list
    };
    // bind on dismiss dunction to the app component class
    this.onDismiss = this.onDismiss.bind(this);
  }
  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }

  // render method
  render() {
    return (
      <div className="App">
        {this.state.list.map(item => {
          return (
            <div key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.points}</span>
              <span>
                <button
                  onClick={() => {
                    this.onDismiss(item.objectID);
                  }}
                  type="button"
                >
                  Dismiss
                </button>
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
