import * as React from 'react';
import { connect } from 'react-redux';
import { IDraggableEventData } from './components/Draggable';
import Draggable from './components/Draggable';
import './PotoCanvas.css';
import PotoCanvasClipper, { IClipRect } from './PotoCanvasClipper';
import PotoCanvasImage from './PotoCanvasImage';
import { setImageFile } from './services/image';
import store, { IStore } from './store';
import { IImageClipState } from './store/imageClip';
import { autoMapStateToProps } from './store/util';

interface IPotoCanvasProps {
  height?: number;
  image?: HTMLImageElement | null;
  imageClip?: IImageClipState;
  width?: number;
}

class PotoCanvas extends React.Component<IPotoCanvasProps> {
  protected get clipRect (): IClipRect {
    const c = this.props.imageClip;
    if (!c) {
      return { height: 0, left: 0, top: 0, width: 0 };
    }

    return {
      height: c.height,
      left: c.left + c.diffLeft,
      top: c.top + c.diffTop,
      width: c.width,
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
    const values = {
      ...data,
      imageHeight: this.props.height || 0,
      imageWidth: this.props.width || 0,
    };
    if (data.dragging) {
      store.dispatch({ type: 'imageClip/DRAG', values });
    }
    else {
      store.dispatch({ type: 'imageClip/END_DRAGGING', values });
    }
  }
}

function mapStateToProps (state: IStore) {
  return {
    imageClip: state.imageClip,
    ...autoMapStateToProps(state, 'image', [
      'height',
      'image',
      'width',
    ])
  };
}

export default connect(mapStateToProps)(PotoCanvas);
