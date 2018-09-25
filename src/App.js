import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

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
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchTopSearchStories = this.fetchTopSearchStories.bind(this);
  }

  fetchTopSearchStories(searchTerm) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}`
    )
      .then(response => response.json())
      .then(result => this.searchTopStories(result))
      .catch(error => error);
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchTopSearchStories(searchTerm);
    event.preventDefault();
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
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}`
    )
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
          <Search
            value={searchTerm}
            onChange={this.searchChange}
            onSubmit={this.onSearchSubmit}
          >
            {" "}
            Search{" "}
          </Search>
        </div>
        {result ? (
          <Table
            list={result.hits}
            onDismiss={this.onDismiss}
            pattern={searchTerm}
          />
        ) : null}
      </div>
    );
  }
}

////////////////////////// SEARCH COMPONENT (functional component) ////////////////////////////
const Search = ({ value, onChange, onSubmit, children }) => {
  return (
    <form onSubmit={onSubmit}>
      {children}
      <input type="text" onChange={onChange} value={value} />
      <button type="submit"> {children} </button>
    </form>
  );
};

////////////////////////// TABLE COMPONENT (functional component) ////////////////////////////

const Table = ({ list, onDismiss, pattern }) => {
  return (
    <div className="table">
      {list.map(item => {
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
