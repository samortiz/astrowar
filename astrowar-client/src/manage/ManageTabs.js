import React from 'react';
import {ManagePlanet} from './ManagePlanet';
import { FactoryTabs } from './factory/FactoryTabs';
import {ManageStorage} from "./ManageStorage";
import './ManageTabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Tabs} from "react-bootstrap";
import {PLANET_GREEN_FILE} from "../functions/client-constants";


export function ManageTabs() {
  const planet = window.world.displayData?.player?.selectedPlanet;
  const isOnMainPlanet = (planet.imageFile === PLANET_GREEN_FILE);

  return (
    <Tabs defaultActiveKey='planet' id='manage-tabs' mountOnEnter unmountOnExit className="flex-nowrap">
      <Tab eventKey='planet' title='Planet'>
        <ManagePlanet/>
      </Tab>
      {!isOnMainPlanet &&
      <Tab eventKey='factory' title='Factory'>
        <FactoryTabs/>
      </Tab>
      }
      {!isOnMainPlanet &&
      <Tab eventKey='storage' title='Storage'>
        <ManageStorage/>
      </Tab>
      }
    </Tabs>);
}

