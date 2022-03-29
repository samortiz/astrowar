import React from 'react';
import {ManagePlanet} from './ManagePlanet';
import './ManageTabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Tabs} from "react-bootstrap";

export function ManageTabs() {

  return (
    <Tabs defaultActiveKey='planet' id='manage-tabs' mountOnEnter unmountOnExit className="flex-nowrap">
      <Tab eventKey='planet' title='Planet'>
        <ManagePlanet/>
      </Tab>
    </Tabs>);
}

