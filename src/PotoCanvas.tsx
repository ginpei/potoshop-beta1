import * as React from 'react';
import { connect } from 'react-redux';
import './PotoCanvas.css';
import PotoCanvasClipper from './PotoCanvasClipper';
import PotoCanvasImage from './PotoCanvasImage';
import { setImageFile } from './services/image';
import { IImageState } from './store/imageState';
import { autoMapStateToProps } from './store/util';

type IPotoCanvasProps = Partial<IImageState>;

class PotoCanvas extends React.Component<IPotoCanvasProps> {
  public render () {
    const fileOpener = this.props.image ? undefined : (
      <div className="PotoCanvas">
        <p>
          <input type="file"
            onChange={this.onFileChange}
            />
        </p>
        <p>Or hit <code>Ctrl+V</code> to paste image.</p>
      </div>
    );

    return (
      <div className="PotoCanvas">
        {fileOpener}
        <PotoCanvasImage {...this.props} />
        <PotoCanvasClipper
          active={false}
          clipRect={{
            height: 20,
            left: 10,
            top: 10,
            width: 20,
          }}
          width={this.props.width || 0}
          height={this.props.height || 0}
          />
      </div>
    );
  }

  protected async onFileChange (event: React.ChangeEvent<HTMLInputElement>) {
    const el = event.currentTarget;
    if (!el.files || el.files.length < 1) {
      return;
    }

    const { files } = el;
    if (files.length < 1) {
      return;
    }
    setImageFile(files[0]);
  }
}

function mapStateToProps (state: IImageState) {
  return autoMapStateToProps(state, [
    'height',
    'image',
    'width',
  ]);
}

export default connect(mapStateToProps)(PotoCanvas);
