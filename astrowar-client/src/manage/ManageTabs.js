import React from 'react';
import {ManagePlanet} from './ManagePlanet';
import { FactoryTabs } from './factory/FactoryTabs';
import {ManageStorage} from "./ManageStorage";
import './ManageTabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Tabs} from "react-bootstrap";


export function ManageTabs() {

  return (
    <Tabs defaultActiveKey='planet' id='manage-tabs' mountOnEnter unmountOnExit className="flex-nowrap">
      <Tab eventKey='planet' title='Planet'>
        <ManagePlanet/>
      </Tab>
      <Tab eventKey='factory' title='Factory'>
        <FactoryTabs/>
      </Tab>
      <Tab eventKey='storage' title='Storage'>
        <ManageStorage/>
      </Tab>
    </Tabs>);
}

