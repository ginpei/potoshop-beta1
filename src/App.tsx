import * as React from 'react';
import './App.css';

interface IAppState {
  bordered: boolean,
  height: number,
  image: HTMLImageElement | null,
  originalHeight: number;
  originalWidth: number;
  scale: number;
  width: number,
}

class App extends React.Component<{}, IAppState> {
  private fOnPaste = this.onPaste.bind(this);
  private fOnScaleInput = this.onScaleInput.bind(this);
  private fOnBorderClick = this.onBorderClick.bind(this);
  private elScale: HTMLInputElement | null;
  private elBorder: HTMLInputElement | null;
  private elCanvas: HTMLCanvasElement | null;

  constructor (props: any) {
    super(props);
    this.state = {
      bordered: false,
      height: 0,
      image: null,
      originalHeight: 0,
      originalWidth: 0,
      scale: 1,
      width: 0,
    };
  }

  public render() {
    return (
      <div id="app" className="app">
        <h1>Potoshop</h1>
        <p className="app-message-paste">Paste image here!</p>
        <p className="app-props">
          Original size:
          <input type="number" className="app-originalWidth"
            value={this.state.originalWidth}
            readOnly={true}
            />
          x
          <input type="number" className="app-originalHeight"
            value={this.state.originalHeight}
            readOnly={true}
            />
          <br />
          Output size:
          <input type="number" className="app-outputWidth"
            value={this.state.width}
            readOnly={true}
            />
          x
          <input type="number" className="app-outputHeight"
            value={this.state.height}
            readOnly={true}
            />
          <input type="range" className="app-scale" min="0" max="1" step="0.01"
            ref={el => this.elScale = el}
            defaultValue={this.state.scale.toString()}
            disabled={!this.state.image}
            onInput={this.fOnScaleInput}
            />
          <br />
          <label>
            Add border
            <input className="app-addBorder" type="checkbox"
              ref={el => this.elBorder = el}
              checked={this.state.bordered}
              onClick={this.fOnBorderClick}
              />
          </label>
        </p>
        <canvas ref={el => this.elCanvas = el} className="app-canvas" />
      </div>
    );
  }

  public componentWillMount () {
    document.addEventListener('paste', this.fOnPaste);
  }

  public componentDidUpdate (_: any, prevState: IAppState) {
    const namesRelatingCanvas = [
      'bordered',
      'image',
      'height',
      'width',
      'scale',
    ];
    const s = this.state;
    const changed = namesRelatingCanvas.some((name) => prevState[name] !== s[name]);
    if (changed) {
      this.updateCanvas();
    }
  }

  public componentWillUnmount () {
    document.removeEventListener('paste', this.fOnPaste);
  }

  protected async onPaste (event: ClipboardEvent) {
    const item = event.clipboardData.items[0];
    if (!item || !item.type.startsWith('image')) {
      return;
    }

    const file = item.getAsFile();
    if (!file) { throw new Error('Failed to get file'); }
    const image = await this.readImage(file);
    if (image) {
      this.setImage(image);
    }
  }

  protected readImage (file: File): Promise<HTMLImageElement | null> {
    if (!file || !file.type.startsWith('image/')) {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        const image = document.createElement('img');
        image.src = url;
        // Firefox sometimes doesn't render immediately
        setTimeout(() => resolve(image), 1);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  protected setImage (image: HTMLImageElement) {
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    this.setState({
      height,
      image,
      originalHeight: height,
      originalWidth: width,
      scale: 1,
      width,
    });
  }

  protected updateCanvas() {
    if (!this.elCanvas) { return; }

    const {
      bordered,
      image,
      width,
      height,
    } = this.state;
    if (!image) { return; }

    const ctx = this.elCanvas!.getContext('2d');
    if (!ctx) { throw new Error('Failed to get canvas context') }

    this.elCanvas.width = width;
    this.elCanvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    if (bordered) {
      ctx.strokeStyle = 'gray';
      ctx.rect(0, 0, width, height);
      ctx.stroke();
    }
  }

  protected onScaleInput () {
    const scale = Number(this.elScale!.value);
    this.setState({
      height: Math.floor(this.state.originalHeight * scale),
      scale,
      width: Math.floor(this.state.originalWidth * scale),
    });
  }

  protected onBorderClick () {
    this.setState({
      bordered: this.elBorder!.checked,
    });
  }
}

export default App;
