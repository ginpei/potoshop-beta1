import * as React from 'react';
import './PotoCanvasClipGrid.css';

interface IPotoCanvasClipGridProps {
  height: number;
  style: any;
  width: number;
}

class PotoCanvasClipGrid extends React.Component<IPotoCanvasClipGridProps> {
  public render () {
    const viewfinderStyle = {
      height: this.props.height,
      width: this.props.width,
    };
    const handleStyle = {
      height: 16,
      left: (this.props.width - 16) / 2,
      top: (this.props.height - 16) / 2,
      width: 16,
    };

    return (
      <div className="PotoCanvasClipGrid" style={this.props.style}>
        <svg className="PotoCanvasClipGrid-viewfinder" style={viewfinderStyle}>
          <path className="PotoCanvasClipGrid-grid"
            d={this.gridPath}
            data-PotoCanvasClipGrid-shadow="true"
            />
          <path className="PotoCanvasClipGrid-grid" d={this.gridPath}/>
          <path className="PotoCanvasClipGrid-angles"
            d={this.viewfinderAngles}
            />
        </svg>
        <svg className="PotoCanvasClipGrid-handle"
          style={handleStyle}
          data-PotoCanvasClipGrid-shadow="true">
          <path className="PotoCanvasClipGrid-handleImage"
            d={this.handleImagePath}
            />
        </svg>
        <svg className="PotoCanvasClipGrid-handle" style={handleStyle}>
          <path className="PotoCanvasClipGrid-handleImage"
            d={this.handleImagePath}
            />
        </svg>
      </div>
    );
  }

  protected get gridPath (): string {
    const goldenRatio = 1.6180339887498948420;
    const { height, width } = this.props;

    return `
      M 0,${height / goldenRatio} l ${width},0
      M 0,${height - height / goldenRatio} l ${width},0
      M ${width / goldenRatio},0 l 0,${height}
      M ${width - width / goldenRatio},0 l 0,${height}
    `;
  }

  protected get viewfinderAngles (): string {
    const { height, width } = this.props;
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

export default PotoCanvasClipGrid;
