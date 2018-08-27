import * as React from 'react';
import { connect } from 'react-redux';
import { IDraggableEventData } from './components/Draggable';
import Draggable from './components/Draggable';
import './PotoCanvas.css';
import PotoCanvasClipper from './PotoCanvasClipper';
import PotoCanvasImage from './PotoCanvasImage';
import { setImageFile } from './services/image';
import { IImageState } from './store/imageState';
import { autoMapStateToProps } from './store/util';

type IPotoCanvasProps = Partial<IImageState>;

interface IPotoCanvasState {
  clipDragging: boolean;
  clipLeft: number;
  clipTop: number;
}

class PotoCanvas extends React.Component<IPotoCanvasProps, IPotoCanvasState> {
  constructor (props: IPotoCanvasProps) {
    super(props);
    this.state = {
      clipDragging: false,
      clipLeft: 0,
      clipTop: 0,
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
            active={true}
            clipRect={{
              height: 300,
              left: 10 + this.state.clipLeft,
              top: 10 + this.state.clipTop,
              width: 400,
            }}
            width={this.props.width || 0}
            height={this.props.height || 0}
            />
        </Draggable>
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

  protected onClipDrag (_: MouseEvent, data: IDraggableEventData) {
    this.setState({
      clipDragging: data.dragging,
      clipLeft: data.diffLeft,
      clipTop: data.diffTop,
    });
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
