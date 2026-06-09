import React from 'react';

const SLOT_LABEL_MAP = {
  GK: 'GOL', LB: 'LE', RB: 'LD', CB1: 'ZAG', CB2: 'ZAG', CB3: 'ZAG',
  DM: 'VOL', VOL1: 'VOL', VOL2: 'VOL', CM: 'MC', MC: 'MC',
  AM: 'MEI', MEI: 'MEI', MEI1: 'MEI', MEI2: 'MEI',
  LW: 'PE', PE: 'PE', RW: 'PD', PD: 'PD',
  ST: 'CA', CA: 'CA', CA1: 'CA', CA2: 'CA'
};

export default function PlayerDraft({
  formation,
  lineup,
  currentDraw,
  onRoll,
  onReRollTeam,
  onReRollYear,
  reRolls,
  selectedPlayer,
  setSelectedPlayer,
  teamStats,
  isComplete
}) {
  const getSlotStructure = () => {
    // Retorna os slots da formação atual para exibir no Box Score
    if (formation === '4-4-2') return ['GK', 'LB', 'CB1', 'CB2', 'RB', 'VOL1', 'VOL2', 'MC', 'MEI', 'CA1', 'CA2'];
    if (formation === '3-5-2') return ['GK', 'CB1', 'CB2', 'CB3', 'VOL1', 'VOL2', 'MC', 'MEI1', 'MEI2', 'CA1', 'CA2'];
    if (formation === '4-2-3-1') return ['GK', 'LB', 'CB1', 'CB2', 'RB', 'VOL1', 'VOL2', 'PE', 'MEI', 'PD', 'CA'];
    return ['GK', 'LB', 'CB1', 'CB2', 'RB', 'DM', 'CM', 'AM', 'PE', 'CA', 'PD']; // 4-3-3 default
  };

  const slots = getSlotStructure();
  const escaladosCount = slots.filter(s => lineup[s]).length;

  // Posições ainda vazias no campo
  const getAvailablePositionLabels = () => {
    return slots.filter(slot => !lineup[slot]).map(slot => SLOT_LABEL_MAP[slot]);
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    // Rola suavemente até o campo de futebol para que o usuário veja as posições piscantes
    setTimeout(() => {
      const pitch = document.querySelector('.soccer-pitch');
      if (pitch) {
        pitch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="draft-panel">
      {/* Se o time estiver 100% completo, não permite mais sorteios */}
      {isComplete ? (
        <div className="complete-action-container">
          <p className="draft-instruction success-text">🏆 Elenco completo e pronto para ir a campo!</p>
        </div>
      ) : (
        /* Sorteio Atual ou Botão de Roll */
        !currentDraw ? (
          <div className="roll-action-container">
            <p className="draft-instruction">Sorteie um clube e ano para puxar o elenco correspondente</p>
            <button className="roll-dice-btn" onClick={onRoll}>
              SORTEAR CLUBE & ANO 🎲
            </button>
          </div>
        ) : (
          <div className="active-draft">
            <div className="draft-header-info">
              <span className="draft-drawn-label">Sorteado</span>
              <h2>{currentDraw.flag} {currentDraw.name} <span className="year-highlight">{currentDraw.year}</span></h2>
              
              {/* Controles de Re-roll */}
              {reRolls > 0 ? (
                <div className="reroll-controls">
                  <span className="reroll-count">Novas chances: <strong>{reRolls}</strong> restantes</span>
                  <div className="reroll-buttons">
                    <button className="reroll-btn" onClick={onReRollTeam}>
                      ↺ Outro Time
                    </button>
                    <button className="reroll-btn" onClick={onReRollYear}>
                      ↺ Outro Ano
                    </button>
                  </div>
                </div>
              ) : (
                <span className="no-rerolls-alert">Chances de troca esgotadas</span>
              )}
            </div>

            <p className="pick-instruction">Selecione 1 jogador abaixo e clique na posição piscante no campo:</p>
            
            <div className="players-list-scroll">
              {currentDraw.squad.map(player => {
                const isSelected = selectedPlayer?.id === player.id;
                
                // Verifica se já está escalado
                const isEscalado = Object.values(lineup).some(p => p && p.id === player.id);

                // Verifica se o jogador tem espaço livre em alguma de suas posições na formação tática atual
                const availableLabels = getAvailablePositionLabels();
                const hasAvailableSlot = player.positions.some(pos => availableLabels.includes(pos));
                
                const isUnavailable = isEscalado || !hasAvailableSlot;

                return (
                  <button
                    key={player.id}
                    disabled={isUnavailable}
                    className={`player-draft-card ${isSelected ? 'selected' : ''} ${player.legend ? 'legend' : ''} ${isUnavailable ? 'disabled' : ''}`}
                    onClick={() => handleSelectPlayer(player)}
                  >
                    <div className="player-card-num">#{player.number}</div>
                    <div className="player-card-details">
                      <span className="player-card-name">{player.name}</span>
                      <span className="player-card-positions">
                        {player.positions.join(' / ')}
                      </span>
                    </div>
                    <div className="player-card-force">{player.force}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* Box Score / Sumário à direita */}
      <div className="box-score">
        <div className="box-score-summary-header">
          <span className="box-score-title">Sumário do Time · {escaladosCount}/11</span>
          <span className="box-score-total-rating">{teamStats.overall} rating</span>
        </div>

        <div className="box-score-ratings">
          <div className="rating-block">
            <span className="rating-val">{teamStats.att}</span>
            <span className="rating-label">ataque</span>
          </div>
          <div className="rating-block">
            <span className="rating-val">{teamStats.def}</span>
            <span className="rating-label">defesa</span>
          </div>
        </div>

        <div className="box-score-table-container">
          <table className="box-score-table">
            <tbody>
              {slots.map(slot => {
                const player = lineup[slot];
                const label = SLOT_LABEL_MAP[slot];
                return (
                  <tr key={slot} className={player ? 'filled-row' : 'empty-row'}>
                    <td className="pos">{label}</td>
                    <td className="name">{player ? player.name : '—'}</td>
                    <td className="force">{player ? player.force : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
