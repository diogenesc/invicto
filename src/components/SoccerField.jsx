import React from 'react';

const POSITION_COORDINATES = {
  '4-3-3': {
    GK: { top: '85%', left: '50%' },
    LB: { top: '65%', left: '15%' },
    CB1: { top: '70%', left: '36%' },
    CB2: { top: '70%', left: '64%' },
    RB: { top: '65%', left: '85%' },
    DM: { top: '48%', left: '50%' },
    CM: { top: '35%', left: '30%' },
    AM: { top: '35%', left: '70%' },
    PE: { top: '15%', left: '18%' },
    CA: { top: '8%', left: '50%' },
    PD: { top: '15%', left: '82%' }
  },
  '4-4-2': {
    GK: { top: '85%', left: '50%' },
    LB: { top: '65%', left: '15%' },
    CB1: { top: '70%', left: '36%' },
    CB2: { top: '70%', left: '64%' },
    RB: { top: '65%', left: '85%' },
    VOL1: { top: '50%', left: '35%' },
    VOL2: { top: '50%', left: '65%' },
    MC: { top: '32%', left: '18%' },
    MEI: { top: '32%', left: '82%' },
    CA1: { top: '10%', left: '35%' },
    CA2: { top: '10%', left: '65%' }
  },
  '3-5-2': {
    GK: { top: '85%', left: '50%' },
    CB1: { top: '70%', left: '22%' },
    CB2: { top: '72%', left: '50%' },
    CB3: { top: '70%', left: '78%' },
    VOL1: { top: '52%', left: '35%' },
    VOL2: { top: '52%', left: '65%' },
    MC: { top: '36%', left: '50%' },
    MEI1: { top: '30%', left: '18%' },
    MEI2: { top: '30%', left: '82%' },
    CA1: { top: '10%', left: '35%' },
    CA2: { top: '10%', left: '65%' }
  },
  '4-2-3-1': {
    GK: { top: '85%', left: '50%' },
    LB: { top: '65%', left: '15%' },
    CB1: { top: '70%', left: '36%' },
    CB2: { top: '70%', left: '64%' },
    RB: { top: '65%', left: '85%' },
    VOL1: { top: '50%', left: '35%' },
    VOL2: { top: '50%', left: '65%' },
    PE: { top: '26%', left: '18%' },
    MEI: { top: '28%', left: '50%' },
    PD: { top: '26%', left: '82%' },
    CA: { top: '8%', left: '50%' }
  }
};

const SLOT_LABEL_MAP = {
  GK: 'GOL',
  LB: 'LE',
  RB: 'LD',
  CB1: 'ZAG',
  CB2: 'ZAG',
  CB3: 'ZAG',
  DM: 'VOL',
  VOL1: 'VOL',
  VOL2: 'VOL',
  CM: 'MC',
  MC: 'MC',
  AM: 'MEI',
  MEI: 'MEI',
  MEI1: 'MEI',
  MEI2: 'MEI',
  LW: 'PE',
  PE: 'PE',
  RW: 'PD',
  PD: 'PD',
  ST: 'CA',
  CA: 'CA',
  CA1: 'CA',
  CA2: 'CA'
};

export default function SoccerField({ formation, lineup, activePlayer, onSelectSlot }) {
  const coordinates = POSITION_COORDINATES[formation] || POSITION_COORDINATES['4-3-3'];
  const slots = Object.keys(coordinates);

  const getSlotStatus = (slot) => {
    // Retorna se o slot é selecionável com base nas posições compatíveis do jogador selecionado
    if (!activePlayer) return false;
    const requiredPos = SLOT_LABEL_MAP[slot];
    return activePlayer.positions.includes(requiredPos);
  };

  return (
    <div className="soccer-pitch">
      <div className="pitch-markings">
        <div className="penalty-area top"></div>
        <div className="center-circle"></div>
        <div className="center-line"></div>
        <div className="penalty-area bottom"></div>
      </div>
      
      {slots.map(slot => {
        const player = lineup[slot];
        const isPickable = getSlotStatus(slot) && !player;
        const coords = coordinates[slot];
        const label = SLOT_LABEL_MAP[slot];

        return (
          <div
            key={slot}
            className={`pitch-slot ${player ? 'filled' : 'empty'} ${isPickable ? 'pickable' : ''} ${player?.legend ? 'legend' : ''}`}
            style={{
              top: coords.top,
              left: coords.left,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => isPickable && onSelectSlot(slot)}
          >
            {player ? (
              <div className="player-badge">
                <span className="player-force">{player.force}</span>
                <span className="player-name">{player.name}</span>
                <span className="player-club-year">{player.flag} {player.year}</span>
              </div>
            ) : (
              <div className="disc-circle">
                {label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
