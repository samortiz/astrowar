import React from 'react';
import './Scoreboard.css';
import 'font-awesome/css/font-awesome.min.css';

export function Scoreboard({highScoreOnly}) {
  let player = window.world.displayData?.player;
  let scores = window.world.displayData?.scores.filter(s => s.score > 0);
  if (scores) {
    scores.sort((a, b) => b.score - a.score);
  }
  if (highScoreOnly === 'true') {
    scores = scores.slice(0,6);
  }

  if (!scores) {
    return '';
  }

  return (
      <div className='score-box'>
        Score:
        {scores?.map(score =>
            <div key={score.id} className={score.id === player.id ? 'current-player-row' : ''}>
              <span className='score-color' style={{backgroundColor: '#' + score.color.substring(2)}}> </span>
              <span className='score-text'> {Math.round(score.score)}</span>
            </div>)}
      </div>
  );
}

