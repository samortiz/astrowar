import React from 'react';
import './ManageFactory.css';
import {Tab, Tabs} from "react-bootstrap";
import {FactoryTab} from "./FactoryTab";


export function FactoryTabs() {
  const blueprints = window.world.blueprints;
  const upgrades = blueprints?.upgrades;
  const primary = blueprints?.primary;
  const secondary = blueprints?.secondary;
  const droids = blueprints?.droids;
  const ships = blueprints?.ships;

  return (
    <div className='factory-info'>
      <Tabs defaultActiveKey='ships' id='factory-tabs' className="flex-nowrap">
        <Tab eventKey='ships' title="Ships">
          <FactoryTab type='ship' templateList={ships} />
        </Tab>

        {upgrades && upgrades.length > 0 &&
        <Tab eventKey='upgrades' title="Upgrades">
          <FactoryTab type='equip' templateList={upgrades} />
        </Tab>
        }

        {primary && primary.length > 0 &&
        <Tab eventKey='primaryWeapons' title="Primary Weapons">
          <FactoryTab type='equip' templateList={primary} />
        </Tab>
        }

        {secondary && secondary.length > 0 &&
        <Tab eventKey='secondaryWeapons' title="Secondary Weapons">
          <FactoryTab type='equip' templateList={secondary} />
        </Tab>
        }

        {droids && droids.length > 0 &&
        <Tab eventKey='droids' title="Droids">
          <FactoryTab type='equip' templateList={droids} />
        </Tab>
        }

      </Tabs>
    </div>);
}

