import * as React from 'react';
import ImageStatePanel from './ImageStatePanel';
import './ManagementPanel.css';
import store from './store/imageInfo';

class ManagementPanel extends React.Component {
  public render() {
    return (
      <div className="ManagementPanel">
        <ImageStatePanel store={store} />
      </div>
    );
  }
}

export default ManagementPanel;
