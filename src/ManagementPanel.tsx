import * as React from 'react';
import ImageStatePanel from './ImageStatePanel';
import './ManagementPanel.css';

class ManagementPanel extends React.Component {
  public render () {
    return (
      <div className="ManagementPanel">
        <ImageStatePanel />
      </div>
    );
  }
}

export default ManagementPanel;
