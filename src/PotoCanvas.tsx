import * as React from 'react';
import { connect } from 'react-redux';
import './PotoCanvas.css';
import { setImageFile } from './services/image';
import { IImageState } from './store/imageState';
import { autoMapStateToProps } from './store/util';

type IPotoCanvasProps = IImageState;

class PotoCanvas extends React.Component<IPotoCanvasProps> {
  private elCanvas: HTMLCanvasElement;

  constructor (props: any) {
    super(props);
  }

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
        <canvas className="PotoCanvas-canvas"
          ref={el => el && (this.elCanvas = el)}
          />
      </div>
    );
  }

  public componentWillReceiveProps (nextProps: IPotoCanvasProps) {
    this.updateCanvas(nextProps);
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

  protected updateCanvas (props: IPotoCanvasProps) {
    const ctx = this.elCanvas.getContext('2d');
    if (!ctx) { throw new Error('Failed to get canvas context'); }

    const {
      bordered,
      flipH,
      flipV,
      height,
      image,
      rotation,
      width,
    } = props;

    if (!image) {
      this.elCanvas.width = 0;
      this.elCanvas.height = 0;
      return;
    }

    const x0 = -width / 2;
    const y0 = -height / 2;
    const degree = rotation * 2 * Math.PI;
    this.elCanvas.width = width;
    this.elCanvas.height = height;

    ctx.translate(-x0, -y0);
    ctx.rotate(degree);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    ctx.drawImage(image, x0, y0, width, height);

    ctx.scale(1, 1);
    ctx.rotate(-degree);
    ctx.translate(x0, y0);

    if (bordered) {
      ctx.strokeStyle = 'gray';
      ctx.rect(0, 0, width, height);
      ctx.stroke();
    }
  }
}

function mapStateToProps (state: IImageState) {
  return autoMapStateToProps(state, [
    'bordered',
    'flipH',
    'flipV',
    'height',
    'image',
    'originalHeight',
    'originalWidth',
    'rotation',
    'scale',
    'type',
    'width',
  ]);
}

export default connect(mapStateToProps)(PotoCanvas);
