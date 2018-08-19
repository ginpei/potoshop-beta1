import * as React from 'react';
import { connect } from 'react-redux';
import './PotoCanvas.css';
import { IImageState } from './store/imageState';
import { autoMapStateToProps } from './store/util';

type IPotoCanvasProps = IImageState;

class PotoCanvas extends React.Component {
  private elCanvas: HTMLCanvasElement | null;

  // constructor (props: any) {
  //   super(props);
  // }

  public render() {
    return (
      <div className="PotoCanvas">
        <canvas className="PotoCanvas-canvas" ref={el => this.elCanvas = el} />
      </div>
    );
  }

  public componentWillReceiveProps (nextProps: IPotoCanvasProps) {
    if (nextProps.image) {
      this.updateCanvas(nextProps);
    }
  }

  protected updateCanvas(props: IPotoCanvasProps) {
    if (!this.elCanvas) { return; }

    const {
      bordered,
      image,
      width,
      height,
    } = props;
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
}

function mapStateToProps (state: IImageState) {
  return autoMapStateToProps(state, [
    'bordered',
    'height',
    'image',
    'originalHeight',
    'originalWidth',
    'scale',
    'type',
    'width',
  ]);
};

export default connect(mapStateToProps)(PotoCanvas);
