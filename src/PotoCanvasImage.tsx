import * as React from 'react';
import { connect } from 'react-redux';
import './PotoCanvasImage.css';
import { defaultState, IImageState } from './store/imageState';
import { autoMapStateToProps } from './store/util';

type IPotoCanvasImageProps = Partial<IImageState>;

class PotoCanvasImage extends React.Component<IPotoCanvasImageProps> {
  private elCanvas = React.createRef<HTMLCanvasElement>();

  public render () {
    return (
      <canvas className="PotoCanvasImage"
        ref={this.elCanvas}
        />
    );
  }

  public componentWillReceiveProps (nextProps: IPotoCanvasImageProps) {
    this.updateCanvas(nextProps);
  }

  protected updateCanvas (props: IPotoCanvasImageProps) {
    const elCanvas = this.elCanvas.current;
    if (!elCanvas) {
      throw new Error('Element is not ready');
    }

    const ctx = elCanvas.getContext('2d');
    if (!ctx) { throw new Error('Failed to get canvas context'); }

    const {
      bordered,
      flipH,
      flipV,
      height,
      image,
      rotation,
      width,
    } = defaultState(props);

    if (!image) {
      elCanvas.width = 0;
      elCanvas.height = 0;
      return;
    }

    const x0 = -width / 2;
    const y0 = -height / 2;
    const degree = rotation * 2 * Math.PI;
    elCanvas.width = width;
    elCanvas.height = height;

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

export default connect(mapStateToProps)(PotoCanvasImage);
