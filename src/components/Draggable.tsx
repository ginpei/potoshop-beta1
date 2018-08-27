import * as React from 'react';
// import './Draggable.css';

export interface IDraggableEventData {
  diffLeft: number;
  diffTop: number;
  dragging: boolean;
  originLeft: number;
  originTop: number;
}

interface IDraggableProps {
  onDrag?: (event: MouseEvent, data: IDraggableEventData) => void;
}

interface IDraggableState {
  diffLeft: number;
  diffTop: number;
  dragging: boolean;
  originLeft: number;
  originTop: number;
}

class Draggable extends React.Component<IDraggableProps, IDraggableState> {
  constructor (props: IDraggableProps) {
    super(props);
    this.state = {
      diffLeft: 0,
      diffTop: 0,
      dragging: false,
      originLeft: 0,
      originTop: 0,
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);
  }

  public render () {
    return (
      <div className="Draggable"
        onMouseDown={this.onMouseDown}
        >
        {this.props.children}
      </div>
    );
  }

  public componentWillMount () {
    window.document.addEventListener('mousemove', this.onDocumentMouseMove);
    window.document.addEventListener('mouseup', this.onDocumentMouseUp);
  }

  protected onMouseDown (event: React.MouseEvent) {
    event.preventDefault();
    this.setState({
      dragging: true,
      originLeft: event.pageX,
      originTop: event.pageY,
    });
  }

  protected onDocumentMouseMove (event: MouseEvent) {
    if (!this.state.dragging) { return; }

    event.preventDefault();
    this.setState({
      diffLeft: event.pageX - this.state.originLeft,
      diffTop: event.pageY - this.state.originTop,
    });
    this.emitDrag(event);
  }

  protected onDocumentMouseUp (event: MouseEvent) {
    if (!this.state.dragging) { return; }

    event.preventDefault();
    this.setState({
      dragging: false,
    });
    this.emitDrag(event);
  }

  protected emitDrag (event: MouseEvent) {
    if (!this.props.onDrag) { return; }

    const data: IDraggableEventData = {
      diffLeft: this.state.diffLeft,
      diffTop: this.state.diffTop,
      dragging: this.state.dragging,
      originLeft: this.state.originLeft,
      originTop: this.state.originTop,
    };

    this.props.onDrag(event, data);
  }
}

export default Draggable;
