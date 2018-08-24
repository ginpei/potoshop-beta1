import * as React from 'react';
import './AppHeader.css';

class AppHeader extends React.Component {
  public render () {
    return (
      <div className="AppHeader">
        <a className="AppHeader-title" href="/">Potoshop</a>
      </div>
    );
  }
}

export default AppHeader;
