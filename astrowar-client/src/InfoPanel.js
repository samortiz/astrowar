import React from 'react';
import './InfoPanel.css';
import { InfoFly } from './fly/InfoFly';
import { ManageTabs } from './manage/ManageTabs';

export class InfoPanel extends React.Component {

  render() {
    let player = window.world?.displayData?.player;
    if (player?.currentShip?.landed) {
      return (<ManageTabs/>);
    } else {
      return (<InfoFly/>);
    }

  }
}

