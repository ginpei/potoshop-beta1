import * as React from 'react';
import { connect } from 'react-redux';
import { IDraggableEventData } from './components/Draggable';
import Draggable from './components/Draggable';
import './PotoCanvas.css';
import PotoCanvasClipper, { IClipRect } from './PotoCanvasClipper';
import PotoCanvasImage from './PotoCanvasImage';
import { setImageFile } from './services/image';
import { IImageState } from './store/image';
import { autoMapStateToProps } from './store/util';

type IPotoCanvasProps = Partial<IImageState>;

interface IPotoCanvasState {
  clipDiffLeft: number;
  clipDiffTop: number;
  clipDragging: boolean;
  clipHeight: number;
  clipLeft: number;
  clipTop: number;
  clipWidth: number;
}

class PotoCanvas extends React.Component<IPotoCanvasProps, IPotoCanvasState> {
  protected get clipRect (): IClipRect {
    const left = this.state.clipLeft + this.state.clipDiffLeft;
    const top = this.state.clipTop + this.state.clipDiffTop;
    const height = this.state.clipHeight / 2;
    const width = this.state.clipWidth / 2;
    return {
      height,
      left: Math.min(Math.max(left, 0), (this.props.width || 0) - width),
      top: Math.min(Math.max(top, 0), (this.props.height || 0) - height),
      width,
    };
  }

  constructor (props: IPotoCanvasProps) {
    super(props);
    this.state = {
      clipDiffLeft: 0,
      clipDiffTop: 0,
      clipDragging: false,
      clipHeight: 0,
      clipLeft: 0,
      clipTop: 0,
      clipWidth: 0,
    };
    this.onClipDrag = this.onClipDrag.bind(this);
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
        <PotoCanvasImage {...this.props} />
        <Draggable matcher=".js-clipDragHandle" onDrag={this.onClipDrag}>
          <PotoCanvasClipper
            active={Boolean(this.props.image)}
            clipRect={this.clipRect}
            width={this.props.width || 0}
            height={this.props.height || 0}
            />
        </Draggable>
      </div>
    );
  }

  public componentWillReceiveProps (nextProps: IPotoCanvasProps) {
    if (this.props.image !== nextProps.image) {
      this.setState({
        clipHeight: nextProps.height || 0,
        clipWidth: nextProps.width || 0,
      });
    }
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

  protected onClipDrag (_: MouseEvent, data: IDraggableEventData) {
    if (data.dragging) {
      this.setState({
        clipDiffLeft: data.diffLeft,
        clipDiffTop: data.diffTop,
        clipDragging: true,
      });
    }
    else {
      const s = this.state;
      this.setState({
        clipDiffLeft: 0,
        clipDiffTop: 0,
        clipDragging: false,
        clipLeft: s.clipLeft + data.diffLeft,
        clipTop: s.clipTop + data.diffTop,
      });
    }
  }
}

function mapStateToProps (state: IImageState) {
  return autoMapStateToProps(state, 'image', [
    'height',
    'image',
    'width',
  ]);
}

export default connect(mapStateToProps)(PotoCanvas);
