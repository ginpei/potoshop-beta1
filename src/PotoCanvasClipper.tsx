import * as React from 'react';
import './PotoCanvasClipper.css';

interface IClipRect {
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

class PotoCanvasClipper extends React.Component<IPotoCanvasClipperProps> {
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
    const viewfinderStyle = clipRect;
    const viewfinderAngles = this.getViewfinderAngles(clipRect);
    const handleStyle = {
      height: 16,
      left: (clipRect.width - 16) / 2,
      top: (clipRect.height - 16) / 2,
      width: 16,
    };

    return (
      <div className="PotoCanvasClipper" style={containerStyle}>
        <div className="PotoCanvasClipper-shadow" style={topShadowStyle}/>
        <div className="PotoCanvasClipper-shadow" style={leftShadowStyle}/>
        <div className="PotoCanvasClipper-shadow" style={rightShadowStyle}/>
        <div className="PotoCanvasClipper-shadow" style={bottomShadowStyle}/>
        <svg className="PotoCanvasClipper-viewfinder" style={viewfinderStyle}>
          <path className="PotoCanvasClipper-angles" d={viewfinderAngles} />
        </svg>
        <svg className="PotoCanvasClipper-handle" style={handleStyle} data-handle-shadow="true">
          <path className="PotoCanvasClipper-handleImage" d={this.handleImagePath} />
        </svg>
        <svg className="PotoCanvasClipper-handle" style={handleStyle}>
          <path className="PotoCanvasClipper-handleImage" d={this.handleImagePath} />
        </svg>
      </div>
    );
  }

  protected getViewfinderAngles ({ height, width }: IClipRect): string {
    const l = 16;
    const w = 5;
    return `
      M 1, 1
        l ${l}, 0
        l 0, ${w}
        l ${-l + w}, 0
        l 0, ${l - w}
        l ${-w}, 0
        z
      M ${width - 1}, 1
        l 0, ${l}
        l ${-w}, 0
        l 0, ${-l + w}
        l ${-l + w}, 0
        l 0, ${-w}
        z
      M ${width - 1}, ${height - 1}
        l ${-l}, 0
        l 0, ${-w}
        l ${l - w}, 0
        l 0, ${-l + w}
        l ${w}, 0
        z
      M 1, ${height - 1}
        l 0, ${-l}
        l ${w}, 0
        l 0, ${l - w}
        l ${l - w}, 0
        l 0, ${w}
        z
    `;
  }

  protected get handleImagePath (): string {
    const length = 16;
    return `
      M ${length / 2}, 0
      l 0, ${length}

      M 0, ${length / 2}
      l ${length}, 0
    `;
  }
}

export default PotoCanvasClipper;
