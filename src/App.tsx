import * as React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import ManagementPanel from './ManagementPanel';
import PotoCanvas from './PotoCanvas';
import { setImageFile } from './services/image';
import imageState from './store/imageState';

interface IAppState {
  dragover: boolean;
}

class App extends React.Component<{}, IAppState> {
  constructor (props: any) {
    super(props);

    this.state = {
      dragover: false,
    };

    this.onPaste = this.onPaste.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
  }

  public render () {
    return (
      <Provider store={imageState}>
        <div className="App"
          data-drag-over={this.state.dragover}
          >
          <div className="App-Header">
            <AppHeader />
          </div>
          <div className="App-Main">
            <PotoCanvas />
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
    document.addEventListener('dragover', this.onDragOver);
    document.addEventListener('drop', this.onDrop);
    document.addEventListener('dragleave', this.onDragLeave);
  }

  public componentWillUnmount () {
    document.removeEventListener('paste', this.onPaste);
    document.removeEventListener('dragover', this.onDragOver);
    document.removeEventListener('drop', this.onDrop);
    document.removeEventListener('dragleave', this.onDragLeave);
  }

  protected async onPaste (event: ClipboardEvent) {
    const item = event.clipboardData.items[0];
    if (item) {
      imageState.dispatch({ type: 'SET_TYPE', value: item.type });
    }
    if (!item || !item.type.startsWith('image')) {
      return;
    }

    const file = item.getAsFile();
    if (file) {
      setImageFile(file);
    }
  }

  protected onDragOver (event: DragEvent) {
    event.preventDefault();
    this.setState({
      dragover: event.dataTransfer.types.includes('Files'),
    });
  }

  protected async onDrop (event: DragEvent) {
    event.preventDefault();
    this.setState({
      dragover: false,
    });

    const { files } = event.dataTransfer;
    if (files.length < 1) {
      return;
    }
    setImageFile(files[0]);
  }

  protected onDragLeave () {
    this.setState({
      dragover: false,
    });
  }
}

export default App;
