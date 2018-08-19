import * as React from 'react';
import { connect } from 'react-redux';
import Slider, { ISliderEventData } from './components/Slider';
import './ImageStatePanel.css';
import './ManagementPanel.css';
import { IImageState } from './store/imageInfo';
import { autoMapStateToProps } from './store/util';

type IImageStatePanelProps = any;
// interface IImageStatePanelProps {
//   bordered: boolean;
// };

interface IImageStatePanelState {
  bordered: boolean;
  height: number;
  originalHeight: number;
  originalWidth: number;
  scale: number;
  type: string;
  width: number;
}

class ImageStatePanel extends React.Component<IImageStatePanelProps, IImageStatePanelState> {
  constructor (props: IImageStatePanelProps) {
    super(props);
    this.state = {
      bordered: 'bordered' in props ? props.bordered : true,
      height: 0,
      originalHeight: 0,
      originalWidth: 0,
      scale: 1,
      type: '*/*',
      width: 0,
    };

    this.onSlider1Change = this.onSlider1Change.bind(this);
    this.onBorderedClick = this.onBorderedClick.bind(this);
  }

  public render () {
    return (
      <div className="ImageStatePanel">
        <div className="ManagementPanel-info">
          <ul>
            <li>Type: {this.state.type}</li>
            <li>
              Original size:
              {this.state.originalWidth}
              x
              {this.state.originalHeight}
            </li>
            <li>
              Size:
              {this.state.width}
              x
              {this.state.height}
            </li>
            <li>
              <label>
                <input type="checkbox"
                  checked={this.state.bordered}
                  onClick={this.onBorderedClick}
                  />
                Border
                ({String(this.state.bordered)})
              </label>
            </li>
          </ul>
          Scale:
          <Slider className="ManagementPanel-slider1"
            max={1}
            min={0.01}
            step={0.01}
            value={this.state.scale}
            onChange={this.onSlider1Change}
            />
        </div>
      </div>
    );
  }

  public componentWillReceiveProps (nextProps: IImageStatePanelProps) {
    if (typeof nextProps.bordered === 'boolean') {
      this.setState({
        bordered: nextProps.bordered,
      });
    }
  }

  protected onBorderedClick (event: React.MouseEvent<HTMLInputElement>) {
    const el = event.currentTarget;
    this.props.setBordered(el.checked);
  }

  protected onSlider1Change (_: any, data: ISliderEventData) {
    this.setState({
      scale: data.value,
    });
  }
}

function mapStateToProps (state: IImageState) {
  return autoMapStateToProps(state, [
    'bordered',
    'scale',
  ]);
};

function mapDispatchToProps (dispatch: any) {
  return {
    setBordered: (bordered: boolean) => {
      dispatch({ type: 'SET_BORDERED', value: bordered });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageStatePanel);
