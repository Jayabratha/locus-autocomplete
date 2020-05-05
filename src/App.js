import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Autocomplete from './Autocomplete/Autocomplete';
import Suggestion from './Suggestion/Suggestion';
import data from './data';

function App() {
  const [results, setResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedId, setSelectedId] = useState('');

  function checkForMatches(list, value) {
    const listLength = list.length;
    for (let i = 0; i < listLength; i++) {
      let item = list[i];
      // Check if item is a list
      if (typeof item === 'object') {
        const items = Object.values(item);
        const matches = checkForMatches(items, value);
        if (matches) {
          return true;
        }
      } else if (item.toLowerCase().includes(value)) {
        return true;
      }
    }
    return false;
  }

  function filterList(value) {
    let filteredData = [];
    if (value) {
      filteredData = data.filter((dataItem) => {
        const items = Object.values(dataItem);
        return checkForMatches(items, value.toLowerCase());
      });
    }
    setSearchText(value);
    setResults(filteredData);
  }

  function setSelection(selection) {
    setSelectedId(selection.props.item.id);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main>
        <Autocomplete id='test'
          placeholder='Search users by ID, name, address, items...'
          onChange={filterList}
          onSelect={setSelection}
          list={results.map((item) => <Suggestion item={item} highlight={searchText} ></Suggestion>)}
        ></Autocomplete>
        {selectedId &&
          <div>
            {selectedId}
          </div>}
      </main>
    </div>
  );
}

export default App;
