import React from 'react';

export default function LeagueEnd({ standings, onRestart }) {
  const userIndex = standings.findIndex(t => t.id === 'user');
  const userPos = userIndex + 1;
  const userTeam = standings[userIndex];

  const isChampion = userPos === 1;
  const isLibertadores = userPos > 1 && userPos <= 4;
  const isRelegated = userPos >= 17;

  let outcomeTitle = "Fim de Temporada!";
  let outcomeDesc = "Seu time concluiu as 38 rodadas no meio da tabela e garantiu uma campanha estável.";
  let outcomeBadge = "📋 CAMPANHA CONCLUÍDA";
  let badgeColorClass = "neutral";

  if (isChampion) {
    outcomeTitle = "CAMPEÃO DO BRASILEIRÃO! 🏆";
    outcomeDesc = "Campanha histórica! Você montou um esquadrão imbatível e levantou a taça de campeão da Série A.";
    outcomeBadge = "👑 TÍTULO HISTÓRICO";
    badgeColorClass = "gold";
  } else if (isLibertadores) {
    outcomeTitle = "VAGA NA LIBERTADORES! ✈️";
    outcomeDesc = `Excelente trabalho! Seu time terminou em ${userPos}º lugar e garantiu vaga direta na fase de grupos da Libertadores.`;
    outcomeBadge = "🎟️ VAGA GARANTIDA";
    badgeColorClass = "green";
  } else if (isRelegated) {
    outcomeTitle = "REBAIXADO À SÉRIE B! 😢";
    outcomeDesc = `Temporada trágica. Seu time terminou em ${userPos}º lugar no Z-4 e disputará a segunda divisão no ano que vem.`;
    outcomeBadge = "📉 REBAIXAMENTO";
    badgeColorClass = "red";
  }

  // Gera confetes se for campeão
  const renderConfetti = () => {
    if (!isChampion) return null;
    return (
      <div className="confetti-container">
        {Array.from({ length: 50 }).map((_, i) => {
          const delay = Math.random() * 4;
          const left = Math.random() * 100;
          const duration = 2 + Math.random() * 3;
          const colors = ['#fef08a', '#eab308', '#ca8a04', '#00ff87', '#ffffff', '#3b82f6'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          return (
            <div 
              key={i} 
              className="confetti-piece"
              style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                backgroundColor: color
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="league-end-container">
      {renderConfetti()}

      <div className="league-end-card glass-panel">
        <span className={`outcome-badge-status ${badgeColorClass}`}>{outcomeBadge}</span>
        <h1>{outcomeTitle}</h1>
        <p className="outcome-description">{outcomeDesc}</p>

        <div className="final-stats-mini">
          <div className="stat-item">
            <span className="stat-num">{userTeam.points}</span>
            <span className="stat-label">Pontos</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{userTeam.wins}</span>
            <span className="stat-label">Vitórias</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{userTeam.goalsFor}</span>
            <span className="stat-label">Gols Pró</span>
          </div>
        </div>

        {/* Tabela de Classificação Final */}
        <div className="final-standings-section">
          <h3>Tabela Final do Campeonato</h3>
          <div className="table-responsive">
            <table className="standings-table final-table">
              <thead>
                <tr>
                  <th className="col-pos">Pos</th>
                  <th className="col-team">Time</th>
                  <th className="col-stat highlighted">P</th>
                  <th className="col-stat">J</th>
                  <th className="col-stat">V</th>
                  <th className="col-stat">E</th>
                  <th className="col-stat">D</th>
                  <th className="col-stat">GP</th>
                  <th className="col-stat">GC</th>
                  <th className="col-stat highlighted">SG</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, index) => {
                  const isUser = team.id === 'user';
                  let zoneClass = '';
                  if (index < 4) zoneClass = 'zone-g4';
                  else if (index >= 16) zoneClass = 'zone-z4';

                  return (
                    <tr 
                      key={team.id} 
                      className={`${isUser ? 'user-row' : ''} ${zoneClass}`}
                    >
                      <td className="team-pos">
                        <span className="pos-badge">{index + 1}</span>
                      </td>
                      <td className="team-name-cell">
                        <span className="team-flag">{team.flag}</span>
                        <span className="team-name">{team.name}</span>
                        {team.year && <span className="team-year">({team.year})</span>}
                      </td>
                      <td className="team-stat points">{team.points}</td>
                      <td className="team-stat">{team.played}</td>
                      <td className="team-stat">{team.wins}</td>
                      <td className="team-stat">{team.draws}</td>
                      <td className="team-stat">{team.losses}</td>
                      <td className="team-stat">{team.goalsFor}</td>
                      <td className="team-stat">{team.goalsAgainst}</td>
                      <td className="team-stat diff">{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="league-end-actions">
          <button className="play-again-btn" onClick={onRestart}>
            Jogar Novamente 🔄
          </button>
        </div>
      </div>
    </div>
  );
}
