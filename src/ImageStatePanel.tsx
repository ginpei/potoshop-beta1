import * as React from 'react';
import { connect } from 'react-redux';
import './ImageStatePanel.css';
import './ManagementPanel.css';
import { IImageState } from './store/imageInfo';

function autoMapStateToProps (state: IImageState, names: string[]) {
  return names.reduce((obj, name) => {
    obj[name] = state[name];
    return obj;
  }, {});
}

// ----

type IImageStatePanelProps = any;
// interface IImageStatePanelProps {
//   bordered: boolean;
// };

interface IImageStatePanelState {
  bordered: boolean;
};

class ImageStatePanel extends React.Component<IImageStatePanelProps, IImageStatePanelState> {
  constructor (props: IImageStatePanelProps) {
    super(props);
    this.state = {
      bordered: 'bordered' in props ? props.bordered : true,
    };

    this.onBorderedClick = this.onBorderedClick.bind(this);
  }

  public render () {
    return (
      <div className="ImageStatePanel">
        <label>
          <input type="checkbox"
            checked={this.state.bordered}
            onClick={this.onBorderedClick}
            />
          Border
          ({String(this.state.bordered)})
        </label>
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
