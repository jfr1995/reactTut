import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
const list = [
  {
    title: "Birden",
    url: "http://www.ign.com",
    author: "filip",
    num_of_comments: 3,
    points: 2,
    objectID: 0
  },

  {
    title: "Hugh Jass",
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

function isSearched(searchTerm) {
  return function(item) {
    // return a true of false statement
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  };
}

class App extends Component {
  //constructor stuff
  constructor(props) {
    super(props);
    this.state = {
      list: list,
      searchTerm: ""
    };
    // bind on dismiss dunction to the app component class
    this.onDismiss = this.onDismiss.bind(this);
    this.searchChange = this.searchChange.bind(this);
  }
  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }

  searchChange(event) {
    console.log(event.target.value);
    this.setState({ searchTerm: event.target.value });
  }

  // render method
  render() {
    const { list, searchTerm } = this.state;
    return (
      <div className="App">
        <Search value={searchTerm} onChange={this.searchChange}>
          {" "}
          Search{" "}
        </Search>
        <Table list={list} onDismiss={this.onDismiss} pattern={searchTerm} />
      </div>
    );
  }
}

////////////////////////// SEARCH COMPONENT (functional component) ////////////////////////////
const Search = ({ value, onChange, children }) => {
  return (
    <form>
      {children}
      <input type="text" onChange={onChange} value={value} />
    </form>
  );
};

////////////////////////// TABLE COMPONENT (functional component) ////////////////////////////

// class Table extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     const { list, onDismiss, pattern } = this.props;
//     return (
//       <div>
//         {list.filter(isSearched(pattern)).map(item => (
//           <div key={item.objectID}>
//             <span>
//               <a href={item.url}>{item.title}</a>
//             </span>
//             <span>{item.author}</span>
//             <span>{item.num_of_comments}</span>
//             <span>{item.points}</span>
//             <Button onClick={() => onDismiss(item.objectID)}>Dismiss</Button>
//           </div>
//         ))}
//       </div>
//     );
//   }
// }

const Table = ({ list, onDismiss, pattern }) => {
  return (
    <div>
      {list.filter(isSearched(pattern)).map(item => {
        return (
          <div key={item.objectID}>
            <span>
              <a href={item.url}> {item.title} </a>
            </span>
            <span>{item.author} </span>
            <span>{item.num_of_comments} </span>
            <span>{item.points}</span>
            <Button
              onClick={() => {
                onDismiss(item.objectID);
              }}
            >
              {" "}
              Dismiss
            </Button>
          </div>
        );
      })}
    </div>
  );
};

////////////////////////// BUTTON COMPONENT(functional component) /////////////////////////

const Button = ({ onClick, className = "", children }) => {
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
};
export default App;
