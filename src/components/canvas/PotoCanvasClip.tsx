import * as React from 'react';
import './PotoCanvasClip.css';
import PotoCanvasClipGrid from './PotoCanvasClipGrid';

export interface IClipRect {
  height: number;
  left: number;
  top: number;
  width: number;
}
interface IPotoCanvasClipperProps {
  active: boolean;
  clipRect: IClipRect;
  height: number;
  width: number;
}

class PotoCanvasClip extends React.Component<IPotoCanvasClipperProps> {
  public render () {
    if (!this.props.active) {
      return null;
    }

    const { clipRect, height, width } = this.props;
    const containerStyle = {
      height,
      width,
    };
    const topShadowStyle = {
      height: clipRect.top,
      left: 0,
      top: 0,
      width,
    };
    const leftShadowStyle = {
      height: clipRect.height,
      left: 0,
      top: clipRect.top,
      width: clipRect.left,
    };
    const rightShadowStyle = {
      height: clipRect.height,
      left: clipRect.left + clipRect.width,
      right: 0,
      top: clipRect.top,
    };
    const bottomShadowStyle = {
      bottom: 0,
      left: 0,
      top: clipRect.top + clipRect.height,
      width,
    };

    return (
      <div className="PotoCanvasClip" style={containerStyle}>
        <div className="PotoCanvasClip-shadow" style={topShadowStyle}/>
        <div className="PotoCanvasClip-shadow" style={leftShadowStyle}/>
        <div className="PotoCanvasClip-shadow" style={rightShadowStyle}/>
        <div className="PotoCanvasClip-shadow" style={bottomShadowStyle}/>
        <PotoCanvasClipGrid
          height={clipRect.height}
          style={clipRect}
          width={clipRect.width}
          />
      </div>
    );
  }
}

export default PotoCanvasClip;
