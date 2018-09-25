import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

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
      result: null,
      searchTerm: DEFAULT_QUERY
    };
    // bind on dismiss dunction to the app component class
    this.onDismiss = this.onDismiss.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.searchTopStories = this.searchTopStories.bind(this);
  }

  searchTopStories(result) {
    this.setState({ result });
  }
  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: Object.assign({}, this.state.result, { hits: updatedHits })
    });
  }

  searchChange(event) {
    console.log(event.target.value);
    this.setState({ searchTerm: event.target.value });
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.searchTopStories(result))
      .catch(error => error);
  }

  // render method
  render() {
    const { result, searchTerm } = this.state;
    if (!result) {
      return null;
    }
    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} onChange={this.searchChange}>
            {" "}
            Search{" "}
          </Search>
        </div>
        <Table
          list={result.hits}
          onDismiss={this.onDismiss}
          pattern={searchTerm}
        />
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
    <div className="table">
      {list.filter(isSearched(pattern)).map(item => {
        return (
          <div key={item.objectID} className="table-row">
            <span style={{ width: "40%" }}>
              <a href={item.url}> {item.title} </a>
            </span>
            <span style={{ width: "30%" }}>{item.author} </span>
            <span style={{ width: "10%" }}>{item.num_of_comments} </span>
            <span style={{ width: "10%" }}>{item.points}</span>
            <span style={{ width: "10%" }}>
              <Button
                onClick={() => {
                  onDismiss(item.objectID);
                }}
                className="button-inline"
              >
                {" "}
                Dismiss
              </Button>
            </span>
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
