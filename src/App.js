import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

// constant variables to build then url(used for fetching from api)
const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

// main application component
class App extends Component {
  //constructor (must also call super since there in inheritance from component class)
  constructor(props) {
    super(props);
    this.state = {
      result: null,
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
  }

  /*
  pass in the search value from input field and also the page number for the paginated fetching
  */
  fetchTopSearchStories(searchTerm, page = 0) {
    // native fetch api call from the browser an
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`
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
    const { hits, page } = result;

    const oldHits = page !== 0 ? this.state.result.hits : [];

    const updatedHits = [...oldHits, ...hits];

    this.setState({
      result: { hits: updatedHits, page }
    });
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
    const page = (result && result.page) || 0;
    if (!result) {
      return null;
    }
    console.log(result);
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
        <div className="interactions">
          <Button
            onClick={() => {
              this.fetchTopSearchStories(searchTerm, page + 1);
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
