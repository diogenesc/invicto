import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import SoccerField, { POSITION_COORDINATES } from './components/SoccerField';
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

  const generateShareImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // 1. Background (Forest Green Radial Gradient)
    const bgGrad = ctx.createRadialGradient(400, 400, 50, 400, 400, 600);
    bgGrad.addColorStop(0, '#115e3b');
    bgGrad.addColorStop(1, '#062416');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 800);

    // 2. Header
    // 2.1 Logo "INVICTO.club"
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('INVICTO', 40, 60);
    const logoWidth = ctx.measureText('INVICTO').width;
    ctx.fillStyle = '#00ff87';
    ctx.fillText('.club', 40 + logoWidth, 60);

    // 2.2 Gold Badge "🏆 FICOU X PARTIDAS INVICTO!"
    ctx.font = '800 20px system-ui, -apple-system, sans-serif';
    const badgeText = `🏆 FICOU ${streak} ${streak === 1 ? 'PARTIDA' : 'PARTIDAS'} INVICTO!`;
    const textWidth = ctx.measureText(badgeText).width;
    const badgeWidth = textWidth + 40;
    const badgeHeight = 50;
    const badgeX = 760 - badgeWidth;
    const badgeY = 35;

    // Draw gold badge background
    const goldGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY);
    goldGrad.addColorStop(0, '#eab308');
    goldGrad.addColorStop(1, '#ca8a04');
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 25);
    } else {
      // Fallback
      ctx.moveTo(badgeX + 25, badgeY);
      ctx.arcTo(badgeX + badgeWidth, badgeY, badgeX + badgeWidth, badgeY + badgeHeight, 25);
      ctx.arcTo(badgeX + badgeWidth, badgeY + badgeHeight, badgeX, badgeY + badgeHeight, 25);
      ctx.arcTo(badgeX, badgeY + badgeHeight, badgeX, badgeY, 25);
      ctx.arcTo(badgeX, badgeY, badgeX + badgeWidth, badgeY, 25);
    }
    ctx.fill();

    // Gold badge text
    ctx.fillStyle = '#052e16';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);

    // 3. Mini-Pitch
    const pitchX = 40;
    const pitchY = 150;
    const pitchWidth = 380;
    const pitchHeight = 580;

    // Pitch markings outer boundary
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.strokeRect(pitchX, pitchY, pitchWidth, pitchHeight);

    // Center line
    ctx.beginPath();
    ctx.moveTo(pitchX, pitchY + pitchHeight / 2);
    ctx.lineTo(pitchX + pitchWidth, pitchY + pitchHeight / 2);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(pitchX + pitchWidth / 2, pitchY + pitchHeight / 2, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Penalty areas
    ctx.strokeRect(pitchX + pitchWidth / 4, pitchY, pitchWidth / 2, 80);
    ctx.strokeRect(pitchX + pitchWidth / 4, pitchY + pitchHeight - 80, pitchWidth / 2, 80);

    // Goal areas
    ctx.strokeRect(pitchX + pitchWidth * 3/8, pitchY, pitchWidth / 4, 30);
    ctx.strokeRect(pitchX + pitchWidth * 3/8, pitchY + pitchHeight - 30, pitchWidth / 4, 30);

    // 4. Draw players from lineup
    const coords = POSITION_COORDINATES[formation] || POSITION_COORDINATES['4-3-3'];
    Object.keys(coords).forEach(slot => {
      const player = lineup[slot];
      if (!player) return;

      const relativeLeft = parseFloat(coords[slot].left) / 100;
      const relativeTop = parseFloat(coords[slot].top) / 100;

      const playerX = pitchX + relativeLeft * pitchWidth;
      const playerY = pitchY + relativeTop * pitchHeight;

      // Circular Badge background
      ctx.beginPath();
      ctx.arc(playerX, playerY, 20, 0, Math.PI * 2);

      if (player.legend) {
        const playerGoldGrad = ctx.createLinearGradient(playerX - 20, playerY - 20, playerX + 20, playerY + 20);
        playerGoldGrad.addColorStop(0, '#fef08a');
        playerGoldGrad.addColorStop(0.5, '#eab308');
        playerGoldGrad.addColorStop(1, '#854d0e');
        ctx.fillStyle = playerGoldGrad;
        ctx.fill();
        ctx.fillStyle = '#1e1b4b';
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.strokeStyle = '#00ff87';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#00ff87';
      }

      // Rating inside circle
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.fillText(player.force.toString(), playerX, playerY);

      // Player Name label below
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      // Stroke for readability
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.lineWidth = 3;
      ctx.strokeText(player.name, playerX, playerY + 24);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(player.name, playerX, playerY + 24);
    });

    // 5. Stats Badges on the right side
    const drawStatCard = (y, label, value) => {
      const x = 460;
      const w = 300;
      const h = 80;

      // Card background
      ctx.fillStyle = '#131926';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, w, h, 8);
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText(label.toUpperCase(), x + 20, y + h / 2);

      // Value
      ctx.textAlign = 'right';
      ctx.fillStyle = '#00ff87';
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
      ctx.fillText(value.toString(), x + w - 20, y + h / 2);
    };

    drawStatCard(150, 'Rating Geral', teamStats.overall);
    drawStatCard(245, 'Força de Ataque', teamStats.att);
    drawStatCard(340, 'Força de Defesa', teamStats.def);

    // 6. Last 5 match results
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('HISTÓRICO DA CAMPANHA', 460, 445);

    const lastMatches = history.slice(-5);
    const startRowY = 475;
    lastMatches.forEach((h, idx) => {
      const rowY = startRowY + idx * 45;
      const circleX = 460 + 15;
      const circleY = rowY + 15;

      // Circle badge for outcome
      ctx.beginPath();
      ctx.arc(circleX, circleY, 12, 0, Math.PI * 2);
      if (h.outcome === 'invicto') {
        ctx.fillStyle = 'rgba(0, 255, 135, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#00ff87';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#00ff87';
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓', circleX, circleY);
      } else {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✕', circleX, circleY);
      }

      // Match text
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '500 13px system-ui, -apple-system, sans-serif';

      const matchText = `Seu Time ${h.userScore} – ${h.oppScore} ${h.opponentFlag || ''} ${h.opponentName}`;
      ctx.fillText(matchText, 500, circleY);
    });

    // 7. Watermark / Credit
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillText('INVICTO.club • Monte sua escalação histórica', 760, 770);

    // Helper to download image as fallback
    const triggerDownload = () => {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `invicto-run-${streak}-vitorias.png`;
      link.href = dataUrl;
      link.click();
    };

    // Use Web Share API if supported, fallback to download
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          triggerDownload();
          return;
        }
        const file = new File([blob], `invicto-run-${streak}-vitorias.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: 'Minha Campanha no Invicto',
            text: `Fiquei ${streak} ${streak === 1 ? 'partida' : 'partidas'} invicto com meu time histórico no invicto.club! Desafie seus amigos!`,
          }).catch((err) => {
            console.error("Erro ao compartilhar", err);
            // Se o usuário cancelar ou fechar o menu de compartilhamento, não forçamos o download
          });
        } else {
          // Sem suporte para compartilhar arquivos (geralmente desktop), faz download
          triggerDownload();
        }
      }, 'image/png');
    } catch (e) {
      console.error("Erro ao converter canvas", e);
      triggerDownload();
    }
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
                <button className="share-btn" onClick={generateShareImage}>
                  Compartilhar Campanha 📸
                </button>
                <button className="play-again-btn" onClick={handleRestart}>
                  Jogar Novamente 🔄
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="app-footer">
        <p>Desenvolvido com ⚽ por <strong>diogenesc</strong></p>
        <a href="https://github.com/diogenesc/invicto" target="_blank" rel="noopener noreferrer" className="github-link-btn" title="Ver no GitHub">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span>GitHub</span>
        </a>
      </footer>
    </div>
  );
}
