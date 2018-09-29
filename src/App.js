import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

// constant variables to build then url(used for fetching from api)
const DEFAULT_HPP = 100;
const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

// this url will be passed to the fetch call.
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}s`;

// main application component renders just two elements which are the search and table component
// also maintains a component state which has the properties of result and search term.
class App extends Component {
  //constructor (must also call super since there in inheritance from component class)
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY
    };
    // class methods need to be bound so they can be reffered to in the 'this' object

    // class method for dimissing item in the list
    this.onDismiss = this.onDismiss.bind(this);

    //class method for filtering list
    this.searchChange = this.searchChange.bind(this);

    // set the search property in the compomnent state
    this.searchTopStories = this.searchTopStories.bind(this);

    // fetch additional info from hackernews api
    this.onSearchSubmit = this.onSearchSubmit.bind(this);

    // fetch info from hackernews api
    this.fetchTopSearchStories = this.fetchTopSearchStories.bind(this);

    // method for checking cache on a search
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  }

  /*
  pass in the search value from input field and also the page number for the paginated fetching
  */
  fetchTopSearchStories(searchTerm, page = 0) {
    // native fetch call from web api
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(response => response.json()) // convert the response to json format
      .then(result => this.searchTopStories(result)) // once the result is obtained then it is time to update the state of component
      .catch(error => error); // error handling
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      console.log("ansynchronous call made");
      this.fetchTopSearchStories(searchTerm);
    }

    event.preventDefault();
  }

  searchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => {
      return item.objectID !== id;
    };
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  }

  searchChange(event) {
    //console.log(event.target.value);
    this.setState({ searchTerm: event.target.value });
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchTopSearchStories(searchTerm);
  }

  // render method
  render() {
    const { results, searchTerm, searchKey } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
    if (!results) {
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
        {results ? (
          <Table list={list} onDismiss={this.onDismiss} pattern={searchTerm} />
        ) : null}
        <div className="interactions">
          <Button
            onClick={() => {
              this.fetchTopSearchStories(searchKey, page + 1);
            }}
          >
            More
          </Button>
        </div>
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
