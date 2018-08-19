import * as React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import ManagementPanel from './ManagementPanel';
import Prototype from './Prototype';
import { readImage, setImage } from './services/image';
import imageInfo from './store/imageState';

class App extends React.Component {
  constructor (props: any) {
    super(props);
    this.onPaste = this.onPaste.bind(this);
  }

  public render() {
    return (
      <Provider store={imageInfo}>
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

  public componentDidMount () {
    document.addEventListener('paste', this.onPaste);
  }

  public componentWillUnmount () {
    document.removeEventListener('paste', this.onPaste);
  }

  protected async onPaste (event: ClipboardEvent) {
    const item = event.clipboardData.items[0];
    if (item) {
      imageInfo.dispatch({ type: 'SET_TYPE', value: item.type });
    }
    if (!item || !item.type.startsWith('image')) {
      return;
    }

    const file = item.getAsFile();
    if (!file) { throw new Error('Failed to get file'); }

    const image = await readImage(file);
    if (image) {
      setImage(image);
    }
  }
}

export default App;
