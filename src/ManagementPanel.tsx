import * as React from 'react';
import Slider, { ISliderEventData } from './components/Slider';
import './ManagementPanel.css';

interface IManagementPanelState {
  bordered: boolean;
  height: number;
  originalHeight: number;
  originalWidth: number;
  scale: number;
  type: string;
  width: number;
}

class ManagementPanel extends React.Component<{}, IManagementPanelState> {
  private elBordered: HTMLInputElement | null;

  constructor (props: any) {
    super(props);
    this.state = {
      bordered: true,
      height: 0,
      originalHeight: 0,
      originalWidth: 0,
      scale: 1,
      type: '*/*',
      width: 0,
    };

    this.onBorderedChanged = this.onBorderedChanged.bind(this);
    this.onSlider1Change = this.onSlider1Change.bind(this);
  }

  public render() {
    return (
      <div className="ManagementPanel">
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
                  ref={el => this.elBordered = el}
                  checked={this.state.bordered}
                  onChange={this.onBorderedChanged}
                  />
                Border
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

  public componentWillMount () {
    this.setState({
      type: 'image/png',
    });
  }

  protected onBorderedChanged (_: any) {
    this.setState({
      bordered: this.elBordered!.checked,
    });
  }

  protected onSlider1Change (_: any, data: ISliderEventData) {
    this.setState({
      scale: data.value,
    });
  }
}

export default ManagementPanel;
