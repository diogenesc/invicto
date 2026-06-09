import React, { useState, useEffect, useRef } from 'react';
import { generateOpponent, simulateMatch } from '../utils/simulator';

export default function MatchEngine({ lineup, playingStyle, streak, onMatchWin, onMatchLoss }) {
  const [opponent, setOpponent] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [minute, setMinute] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [speed, setSpeed] = useState(300); // ms por minuto virtual
  const [mode, setMode] = useState('auto'); // 'manual' (click to reveal) ou 'auto'

  const timerRef = useRef(null);
  const eventsEndRef = useRef(null);

  // Carrega o oponente no início
  useEffect(() => {
    const opp = generateOpponent();
    setOpponent(opp);
    
    // Simula a partida nos bastidores e guarda o resultado
    const res = simulateMatch(lineup, playingStyle, opp);
    setMatchResult(res);

    // Reset de estado
    setMinute(0);
    setVisibleEvents([]);
    setUserScore(0);
    setOppScore(0);
    setIsSimulating(false);
  }, [lineup, playingStyle, streak]);

  // Scrolla automaticamente para o final do log de eventos
  useEffect(() => {
    if (eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleEvents]);

  // Controle de simulação automática
  useEffect(() => {
    if (isSimulating && minute < 90 && matchResult) {
      timerRef.current = setTimeout(() => {
        const nextMin = minute + 1;
        setMinute(nextMin);

        // Verifica se há evento nesse minuto
        const ev = matchResult.events.find(e => e.minute === nextMin);
        if (ev) {
          setVisibleEvents(prev => [...prev, ev]);
          if (ev.type === 'goal_user') setUserScore(s => s + 1);
          if (ev.type === 'goal_opp') setOppScore(s => s + 1);
        }

        // Se chegou ao fim
        if (nextMin === 90) {
          setIsSimulating(false);
        }
      }, speed);
    }

    return () => clearTimeout(timerRef.current);
  }, [isSimulating, minute, matchResult, speed]);

  const handleStartAuto = () => {
    setMode('auto');
    setIsSimulating(true);
  };

  const handleManualStep = () => {
    setMode('manual');
    if (minute >= 90 || !matchResult) return;

    // Avança 5 minutos virtuais de cada vez no manual para não ficar exaustivo
    const targetMin = Math.min(minute + 5, 90);
    
    let nextEvents = [];
    let newUserGoals = 0;
    let newOppGoals = 0;

    for (let m = minute + 1; m <= targetMin; m++) {
      const ev = matchResult.events.find(e => e.minute === m);
      if (ev) {
        nextEvents.push(ev);
        if (ev.type === 'goal_user') newUserGoals++;
        if (ev.type === 'goal_opp') newOppGoals++;
      }
    }

    setMinute(targetMin);
    if (nextEvents.length > 0) {
      setVisibleEvents(prev => [...prev, ...nextEvents]);
      setUserScore(s => s + newUserGoals);
      setOppScore(s => s + newOppGoals);
    }
  };

  const handleFinishMatch = () => {
    if (userScore >= oppScore) {
      // Vitória ou empate mantém o time invicto
      onMatchWin(userScore, oppScore, opponent);
    } else {
      // Derrota encerra a campanha
      onMatchLoss(userScore, oppScore, opponent);
    }
  };

  if (!opponent || !matchResult) {
    return <div className="loading-match">Preparando partida...</div>;
  }

  const isCompleted = minute === 90;

  return (
    <div className="match-container">
      {/* Placar de Estádio */}
      <div className="match-scoreboard">
        <div className="scoreboard-title">
          RODADA {streak + 1} · INVICTO RUN
        </div>
        <div className="scoreboard-flex">
          <div className="score-team user">
            <span className="score-flag">🏆</span>
            <span className="score-name">Seu Time</span>
          </div>
          <div className="score-numbers">
            {userScore} – {oppScore}
            <div className={`score-minute ${isCompleted ? 'ended' : 'running'}`}>
              {isCompleted ? 'FIM' : `${minute}'`}
            </div>
          </div>
          <div className="score-team opponent">
            <span className="score-flag">{opponent.flag}</span>
            <span className="score-name">{opponent.name}</span>
            <span className="score-year">{opponent.year}</span>
          </div>
        </div>
      </div>

      {/* Controles de Simulação */}
      <div className="match-controls">
        {!isCompleted ? (
          <>
            <div className="control-group">
              <span className="control-label">Modo:</span>
              <div className="control-buttons-wrapper">
                <button
                  className={`control-btn ${mode === 'manual' ? 'active' : ''}`}
                  onClick={handleManualStep}
                >
                  Avançar +5' ➔
                </button>
                <button
                  className={`control-btn ${mode === 'auto' && isSimulating ? 'active' : ''}`}
                  onClick={handleStartAuto}
                >
                  Simular Automático
                </button>
              </div>
            </div>

            {mode === 'auto' && (
              <div className="control-group">
                <span className="control-label">Velocidade:</span>
                <div className="control-buttons-wrapper">
                  <button className={`speed-btn ${speed === 400 ? 'active' : ''}`} onClick={() => setSpeed(400)}>Lento</button>
                  <button className={`speed-btn ${speed === 200 ? 'active' : ''}`} onClick={() => setSpeed(200)}>Normal</button>
                  <button className={`speed-btn ${speed === 80 ? 'active' : ''}`} onClick={() => setSpeed(80)}>Rápido</button>
                  <button className={`speed-btn ${speed === 15 ? 'active' : ''}`} onClick={() => setSpeed(15)}>Ultra</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="match-completion-card">
            {userScore >= oppScore ? (
              <div className="outcome-alert success">
                🎉 INVICTO! Você sobreviveu à rodada!
              </div>
            ) : (
              <div className="outcome-alert failure">
                ✕ DERROTA! O oponente derrubou sua invencibilidade.
              </div>
            )}
            <button className="finish-match-btn" onClick={handleFinishMatch}>
              {userScore >= oppScore ? 'PROSSEGUIR RUN ➔' : 'VER RESULTADO FINAL ➔'}
            </button>
          </div>
        )}
      </div>

      {/* Feed da partida */}
      <div className="match-events-log">
        <h3>Lances do Jogo</h3>
        <div className="events-scroll">
          {visibleEvents.length === 0 && (
            <p className="no-events-text">Inicie a simulação para ver os lances minuto a minuto...</p>
          )}
          {visibleEvents.map((ev, idx) => (
            <div key={idx} className={`match-event-row ${ev.type}`}>
              {ev.text}
            </div>
          ))}
          {isCompleted && (
            <div className="match-event-row ended-notice">
              ⏱️ 90' - Apita o árbitro! Fim de jogo no Invicto Stadium!
            </div>
          )}
          <div ref={eventsEndRef} />
        </div>
      </div>
    </div>
  );
}
