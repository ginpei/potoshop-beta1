import * as React from 'react';
import { connect } from 'react-redux';
import Slider, { ISliderEventData } from './components/Slider';
import './ImageStatePanel.css';
import './ManagementPanel.css';
import { IImageState } from './store/image';
import store from './store/index';
import { autoMapStateToProps, buildNestedDispatcher } from './store/util';

type IImageStatePanelProps = any;
// interface IImageStatePanelProps {
//   bordered: boolean;
// };

type IImageStatePanelState = IImageState;

class ImageStatePanel extends React.Component<IImageStatePanelProps, IImageStatePanelState> {
  constructor (props: IImageStatePanelProps) {
    super(props);
    this.state = store.getState().image;

    this.onSlider1Change = this.onSlider1Change.bind(this);
    this.onRotationChange = this.onRotationChange.bind(this);
    this.onBorderedClick = this.onBorderedClick.bind(this);
    this.onFlipHClick = this.onFlipHClick.bind(this);
    this.onFlipVClick = this.onFlipVClick.bind(this);
  }

  public render () {
    return (
      <div className="ImageStatePanel">
        <div className="ManagementPanel-info">
          <ul>
            <li>Type: {this.props.type}</li>
            <li>
              Original size:
              {this.props.originalWidth}
              x
              {this.props.originalHeight}
            </li>
            <li>
              Size:
              {this.props.width}
              x
              {this.props.height}
            </li>
            <li>
              <label>
                <input type="checkbox"
                  checked={this.state.bordered}
                  onClick={this.onBorderedClick}
                  />
                Border
              </label>
            </li>
            <li>
              Flip:
              <br/>
              <label>
                <input type="checkbox"
                  checked={this.state.flipH}
                  onClick={this.onFlipHClick}
                  />
                Horizontally
              </label>
              <br/>
              <label>
                <input type="checkbox"
                  checked={this.state.flipV}
                  onClick={this.onFlipVClick}
                  />
                Vertically
              </label>
            </li>
          </ul>
          <div>
            Scale:
            <Slider className="ManagementPanel-slider1"
              max={1}
              min={0.01}
              step={0.01}
              value={this.state.scale}
              onChange={this.onSlider1Change}
              />
          </div>
          <div>
            Rotation:
            <Slider className="ManagementPanel-slider1"
              max={1}
              min={-1}
              step={0.01}
              value={this.state.rotation}
              onChange={this.onRotationChange}
              />
          </div>
        </div>
      </div>
    );
  }

  public componentWillReceiveProps (nextProps: IImageStatePanelProps) {
    const nextState: any = {};
    if (typeof nextProps.bordered === 'boolean') {
      nextState.bordered = nextProps.bordered;
    }
    if (typeof nextProps.flipH === 'boolean') {
      nextState.flipH = nextProps.flipH;
    }
    if (typeof nextProps.flipV === 'boolean') {
      nextState.flipV = nextProps.flipV;
    }
    if (typeof nextProps.scale === 'number') {
      nextState.scale = nextProps.scale;
    }
    if (typeof nextProps.rotation === 'number') {
      nextState.rotation = nextProps.rotation;
    }

    if (Object.keys(nextState).length > 0) {
      this.setState(nextState);
    }
  }

  protected onBorderedClick (event: React.MouseEvent<HTMLInputElement>) {
    const el = event.currentTarget;
    this.props.setBordered(el.checked);
  }

  protected onFlipHClick (event: React.MouseEvent<HTMLInputElement>) {
    const el = event.currentTarget;
    this.props.setFlipH(el.checked);
  }

  protected onFlipVClick (event: React.MouseEvent<HTMLInputElement>) {
    const el = event.currentTarget;
    this.props.setFlipV(el.checked);
  }

  protected onSlider1Change (_: any, data: ISliderEventData) {
    this.props.setScale(data.value);
  }

  protected onRotationChange (_: any, data: ISliderEventData) {
    this.props.setRotation(data.value);
  }
}

function mapStateToProps (state: IImageState) {
  return autoMapStateToProps(state, 'image', [
    'bordered',
    'flipH',
    'flipV',
    'rotation',
    'height',
    'originalHeight',
    'originalWidth',
    'scale',
    'type',
    'width',
  ]);
}

function mapDispatchToProps (dispatchOriginal: any) {
  const dispatch = buildNestedDispatcher('image', dispatchOriginal);
  return {
    setBordered: (value: boolean) => {
      dispatch({ type: 'SET_BORDERED', value });
    },
    setFlipH: (value: number) => {
      dispatch({ type: 'SET_FLIP_H', value });
    },
    setFlipV: (value: number) => {
      dispatch({ type: 'SET_FLIP_V', value });
    },
    setFlipW: (value: number) => {
      dispatch({ type: 'SET_FLIP_W', value });
    },
    setRotation: (value: number) => {
      dispatch({ type: 'SET_ROTATION', value });
    },
    setScale: (value: number) => {
      dispatch({ type: 'SET_SCALE', value });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageStatePanel);
