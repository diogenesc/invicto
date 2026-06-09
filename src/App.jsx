import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import SoccerField from './components/SoccerField';
import PlayerDraft from './components/PlayerDraft';
import MatchEngine from './components/MatchEngine';
import { getTeamRatings } from './utils/simulator';
import { BR_TEAMS } from './data/database';

const LOCAL_STORAGE_KEY = 'invicto_draft_state';

const loadSavedState = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error reading saved state", e);
  }
  return null;
};

export default function App() {
  const savedState = loadSavedState() || {};

  const [screen, setScreen] = useState(savedState.screen || 'menu');
  const [formation, setFormation] = useState(savedState.formation || '4-3-3');
  const [playingStyle, setPlayingStyle] = useState(savedState.playingStyle || 'balanced');
  const [lineup, setLineup] = useState(savedState.lineup || {});
  const [reRolls, setReRolls] = useState(savedState.reRolls !== undefined ? savedState.reRolls : 3);
  const [streak, setStreak] = useState(savedState.streak || 0);
  const [history, setHistory] = useState(savedState.history || []);
  
  // Estado do draft atual
  const [currentDraw, setCurrentDraw] = useState(savedState.currentDraw || null);
  const [selectedPlayer, setSelectedPlayer] = useState(savedState.selectedPlayer || null);

  // Salva o estado no localStorage a cada mudança
  useEffect(() => {
    const stateToSave = {
      screen,
      formation,
      playingStyle,
      lineup,
      reRolls,
      streak,
      history,
      currentDraw,
      selectedPlayer
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Error saving state", e);
    }
  }, [screen, formation, playingStyle, lineup, reRolls, streak, history, currentDraw, selectedPlayer]);

  // Calcula estatísticas gerais da equipe atual
  const teamStats = getTeamRatings(lineup);

  const handleStartGame = () => {
    setLineup({});
    setReRolls(3);
    setStreak(0);
    setHistory([]);
    setCurrentDraw(null);
    setSelectedPlayer(null);
    setScreen('draft');
  };

  const handleRoll = () => {
    // Sorteia um time e ano aleatórios
    const randomTeam = BR_TEAMS[Math.floor(Math.random() * BR_TEAMS.length)];
    setCurrentDraw(randomTeam);
    setSelectedPlayer(null);
  };

  const handleReRollTeam = () => {
    if (reRolls <= 0) return;
    setReRolls(r => r - 1);
    handleRoll();
  };

  const handleReRollYear = () => {
    // Como os times são únicos por ano no nosso DB, re-roll de time/ano funciona escolhendo outro esquadrão completo
    if (reRolls <= 0) return;
    setReRolls(r => r - 1);
    handleRoll();
  };

  const handleSelectSlot = (slot) => {
    if (!selectedPlayer) return;
    
    setLineup(prev => ({
      ...prev,
      [slot]: {
        ...selectedPlayer,
        flag: currentDraw.flag,
        year: currentDraw.year
      }
    }));

    // Reseta o sorteio para a próxima rodada
    setCurrentDraw(null);
    setSelectedPlayer(null);
  };

  const handleStartSimulation = () => {
    setScreen('simulation');
  };

  const handleMatchWin = (userScore, oppScore, opponent) => {
    const matchRecord = {
      opponentName: opponent.name,
      opponentYear: opponent.year,
      opponentFlag: opponent.flag,
      userScore,
      oppScore,
      outcome: 'invicto'
    };
    
    setHistory(prev => [...prev, matchRecord]);
    setStreak(s => s + 1);
  };

  const handleMatchLoss = (userScore, oppScore, opponent) => {
    const matchRecord = {
      opponentName: opponent.name,
      opponentYear: opponent.year,
      opponentFlag: opponent.flag,
      userScore,
      oppScore,
      outcome: 'derrota'
    };
    
    setHistory(prev => [...prev, matchRecord]);
    setScreen('gameover');
  };

  const handleRestart = () => {
    setScreen('menu');
  };

  const isLineupComplete = () => {
    const expectedCount = 11;
    return Object.values(lineup).filter(Boolean).length === expectedCount;
  };

  return (
    <div className="app-layout">
      {/* Header global */}
      <header className="app-header">
        <div className="header-brand" onClick={handleRestart}>
          <span className="brand-logo">INVICTO</span>
          <h2>.club</h2>
        </div>
        <div className="header-stats">
          {screen === 'draft' && (
            <div className="draft-progress-bar">
              Escalação: <strong>{Object.values(lineup).filter(Boolean).length}/11</strong>
            </div>
          )}
          {screen === 'simulation' && (
            <div className="streak-badge-header">
              Sequência Invicta: <strong>{streak}</strong>
            </div>
          )}
        </div>
      </header>

      {/* Telas principais */}
      <main className="app-main-content">
        {screen === 'menu' && (
          <MainMenu
            formation={formation}
            setFormation={setFormation}
            playingStyle={playingStyle}
            setPlayingStyle={setPlayingStyle}
            onStart={handleStartGame}
          />
        )}

        {screen === 'draft' && (
          <div className="draft-screen-container">
            <div className="draft-left-col">
              <SoccerField
                formation={formation}
                lineup={lineup}
                activePlayer={selectedPlayer}
                onSelectSlot={handleSelectSlot}
              />
            </div>
            <div className="draft-right-col">
              <PlayerDraft
                formation={formation}
                lineup={lineup}
                currentDraw={currentDraw}
                onRoll={handleRoll}
                onReRollTeam={handleReRollTeam}
                onReRollYear={handleReRollYear}
                reRolls={reRolls}
                selectedPlayer={selectedPlayer}
                setSelectedPlayer={setSelectedPlayer}
                teamStats={teamStats}
                isComplete={isLineupComplete()}
              />
              
              {isLineupComplete() && (
                <button className="go-simulate-btn animate-pulse" onClick={handleStartSimulation}>
                  INICIAR SIMULAÇÃO DO INVICTO RUN ➔
                </button>
              )}
            </div>
          </div>
        )}

        {screen === 'simulation' && (
          <MatchEngine
            lineup={lineup}
            playingStyle={playingStyle}
            streak={streak}
            onMatchWin={handleMatchWin}
            onMatchLoss={handleMatchLoss}
          />
        )}

        {screen === 'gameover' && (
          <div className="gameover-container">
            <div className="gameover-card">
              <span className="gameover-badge">FIM DA SEQUÊNCIA</span>
              <h1>Você ficou {streak} {streak === 1 ? 'partida' : 'partidas'} invicto!</h1>
              
              <div className="gameover-stats-grid">
                <div className="stat-card">
                  <span className="stat-num">{teamStats.overall}</span>
                  <span className="stat-label">Rating Geral</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">{teamStats.att}</span>
                  <span className="stat-label">Força de Ataque</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">{teamStats.def}</span>
                  <span className="stat-label">Força de Defesa</span>
                </div>
              </div>

              {/* Histórico das partidas */}
              <div className="match-history-summary">
                <h3>Histórico da Campanha</h3>
                <div className="history-list">
                  {history.map((h, idx) => (
                    <div key={idx} className={`history-item ${h.outcome}`}>
                      <span className="history-result-badge">{h.outcome === 'invicto' ? '✓' : '✕'}</span>
                      <span className="history-match-text">
                        Seu Time {h.userScore} – {h.oppScore} {h.opponentFlag} {h.opponentName} ({h.opponentYear})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gameover-actions">
                <button className="play-again-btn" onClick={handleRestart}>
                  Jogar Novamente 🔄
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
