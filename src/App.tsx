import * as React from 'react';
import './App.css';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import Prototype from './Prototype';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <div className="App-Header">
          <AppHeader />
        </div>
        <div className="App-Main">
          <Prototype />
        </div>
        <div className="App-Left">
          <div>Tools</div>
        </div>
        <div className="App-Right">
          <div>Layers</div>
        </div>
        <div className="App-Footer">
          <AppFooter />
        </div>
      </div>
    );
  }
}

export default App;
