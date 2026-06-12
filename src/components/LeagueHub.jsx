import React from 'react';

export default function LeagueHub({
  standings,
  schedule,
  currentRound,
  onStartMatch,
  roundResults = []
}) {
  const totalRounds = 38;
  const currentRoundMatches = schedule[currentRound] || [];
  
  // Encontra o confronto do usuário nesta rodada
  const userMatch = currentRoundMatches.find(
    m => m.home.id === 'user' || m.away.id === 'user'
  );

  const opponent = userMatch
    ? (userMatch.home.id === 'user' ? userMatch.away : userMatch.home)
    : null;

  const isUserHome = userMatch && userMatch.home.id === 'user';

  return (
    <div className="league-hub-container">
      <div className="league-header">
        <h1>Campeonato Brasileiro · Série A</h1>
        <div className="round-indicator">
          <span>Rodada <strong>{currentRound + 1}</strong> de {totalRounds}</span>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${((currentRound + 1) / totalRounds) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="league-grid">
        {/* Tabela de Classificação */}
        <div className="standings-card glass-panel">
          <h3>Tabela de Classificação</h3>
          <div className="table-responsive">
            <table className="standings-table">
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
          <div className="table-legend">
            <span className="legend-item"><span className="legend-dot g4"></span> G-4 (Libertadores)</span>
            <span className="legend-item"><span className="legend-dot z4"></span> Z-4 (Rebaixamento)</span>
          </div>
        </div>

        {/* Painel Lateral (Próximo Jogo e Resultados) */}
        <div className="league-sidebar">
          {/* Card de Próximo Confronto */}
          {opponent && (
            <div className="next-match-card glass-panel">
              <span className="sidebar-section-title">SEU PRÓXIMO DUELO</span>
              <div className="next-match-vs">
                <div className="vs-team user">
                  <span className="team-icon">🏆</span>
                  <span className="team-label">Seu Time</span>
                </div>
                <div className="vs-badge">VS</div>
                <div className="vs-team opponent">
                  <span className="team-icon">{opponent.flag}</span>
                  <span className="team-label">{opponent.name}</span>
                  <span className="team-year">({opponent.year})</span>
                </div>
              </div>
              <div className="match-info-text">
                Você joga como <strong>{isUserHome ? 'Mandante' : 'Visitante'}</strong> no Invicto Stadium.
              </div>
              <button className="start-round-btn animate-pulse" onClick={onStartMatch}>
                IR PARA A PARTIDA ➔
              </button>
            </div>
          )}

          {/* Resultados da Rodada Anterior */}
          {roundResults.length > 0 && (
            <div className="round-results-card glass-panel">
              <span className="sidebar-section-title">RESULTADOS DA RODADA ANTERIOR</span>
              <div className="results-scroll">
                {roundResults.map((match, idx) => {
                  const isUserInvolved = match.homeId === 'user' || match.awayId === 'user';
                  return (
                    <div 
                      key={idx} 
                      className={`result-row ${isUserInvolved ? 'highlighted' : ''}`}
                    >
                      <span className="res-team home">
                        {match.homeFlag} {match.homeName}
                      </span>
                      <span className="res-score">
                        {match.homeScore} – {match.awayScore}
                      </span>
                      <span className="res-team away">
                        {match.awayFlag} {match.awayName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
