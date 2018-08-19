import * as React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import ManagementPanel from './ManagementPanel';
import Prototype from './Prototype';
import store from './store/imageInfo';

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
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
            <ManagementPanel />
          </div>
          <div className="App-Footer">
            <AppFooter />
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
