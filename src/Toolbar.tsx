import * as React from 'react';
import { connect } from 'react-redux';
// import { setImageFile } from './services/image';
import { IImageState } from './store/image';
import { autoMapStateToProps } from './store/util';
import './Toolbar.css';

type IToolbarProps = any;
type IToolbarState = any;

class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
  constructor (props: any) {
    super(props);

    this.new_onClick = this.new_onClick.bind(this);
    this.reset_onClick = this.reset_onClick.bind(this);
  }

  public render () {
    return (
      <div className="Toolbar">
        <button
          onClick={this.new_onClick}
          ><i className="fa fa-file-o" aria-hidden="true" /> New</button>
        <button
          onClick={this.reset_onClick}
          ><i className="fa fa-trash" aria-hidden="true" /> Reset</button>
      </div>
    );
  }

  protected new_onClick () {
    this.props.setImage(null);
  }

  protected reset_onClick () {
    this.props.setImage(this.props.image);
  }
}

function mapStateToProps (state: IImageState) {
  return autoMapStateToProps(state, 'image', [
    'image',
  ]);
}

function mapDispatchToProps (dispatch: any) {
  return {
    setImage: (value: IImageState) => {
      dispatch({ type: 'SET_IMAGE', value });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
