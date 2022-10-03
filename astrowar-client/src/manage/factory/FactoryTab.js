import React from 'react';
import './FactoryTab.css';
import {FactoryButtonRow} from "./FactoryButtonRow";

export function FactoryTab({type, templateList}) {
  return (
    <div className='container factory-tab' style={{maxHeight: '800px', minWidth:'400px'}}>
      <table>
        <tbody>
          {templateList.map((template, i) => {
            return <FactoryButtonRow key={type+i} template={template} />;
          })}
        </tbody>
      </table>
    </div>);
}

