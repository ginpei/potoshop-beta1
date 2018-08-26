import * as React from 'react';
import './Slider.css';

interface ISliderProps {
  className: string;
  max?: number;
  min?: number;
  step?: number;
  value: number;
  onChange?: (event: Event, data: ISliderEventData) => void;
}

interface ISliderState {
  max: number;
  min: number;
  numberValue: number;
  rangeValue: number;
  step: number;
}

export interface ISliderEventData {
  value: number;
}

class Slider extends React.Component<ISliderProps, ISliderState> {
  private elNumber = React.createRef<HTMLInputElement>();
  private elRange = React.createRef<HTMLInputElement>();

  constructor (props: ISliderProps) {
    super(props);
    this.state = {
      max: props.max || 100,
      min: props.min || 0,
      numberValue: props.value,
      rangeValue: props.value,
      step: props.step || 1,
    };

    this.onRangeInput = this.onRangeInput.bind(this);
    this.onNumberInput = this.onNumberInput.bind(this);
  }

  public render () {
    return (
      <div className={`Slider ${this.props.className}`}>
        <input type="range" className="Slider-range"
          ref={this.elRange}
          max={this.state.max}
          min={this.state.min}
          step={this.state.step}
          value={String(this.state.rangeValue)}
          onChange={this.onRangeInput}
          />
        <input type="number" className="Slider-number"
          ref={this.elNumber}
          max={this.state.max}
          min={this.state.min}
          step={this.state.step}
          value={String(this.state.numberValue)}
          onChange={this.onNumberInput}
          />
      </div>
    );
  }

  public componentWillReceiveProps (nextProps: ISliderProps) {
    this.setState({
      numberValue: nextProps.value,
      rangeValue: nextProps.value,
    });
  }

  protected onRangeInput (event: any) {
    if (!this.props.onChange) { return; }
    const el = this.elRange.current;
    if (!el) {
      throw new Error('Element is not ready');
    }
    this.props.onChange(event, { value: Number(el.value) });
  }

  protected onNumberInput (event: any) {
    if (!this.props.onChange) { return; }
    const el = this.elNumber.current;
    if (!el) {
      throw new Error('Element is not ready');
    }
    this.props.onChange(event, { value: Number(el.value) });
  }
}

export default Slider;
