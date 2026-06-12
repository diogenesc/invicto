import React from 'react';

const FORMATIONS = [
  { id: '4-3-3', name: '4-3-3', desc: 'Clássico com pontas rápidos e centroavante' },
  { id: '4-4-2', name: '4-4-2', desc: 'Equilíbrio no meio-campo e dupla de ataque' },
  { id: '3-5-2', name: '3-5-2', desc: 'Ala ofensivos e três zagueiros na cobertura' },
  { id: '4-2-3-1', name: '4-2-3-1', desc: 'Modernidade com meias criativos e pontas' }
];

const STYLES = [
  { id: 'balanced', name: 'Equilibrado', desc: 'Mantém as forças originais da equipe' },
  { id: 'attacking', name: 'Atacante', desc: 'Ataque +5% | Defesa -4% (Mais chances criadas)' },
  { id: 'defensive', name: 'Defensivo', desc: 'Defesa +5% | Ataque -4% (Jogo fechado e seguro)' }
];

const MODES = [
  { id: 'normal', name: 'Normal', desc: 'Atributos e médias visíveis durante todo o draft' },
  { id: 'craque', name: 'Modo Craque ✨', desc: 'Atributos e médias ocultos por 🔒 até fechar os 11 titulares' }
];

const CAMPAIGNS = [
  { id: 'streak', name: 'Sobrevivência (Invicto Run)', desc: 'Jogue partidas consecutivas até sofrer sua primeira derrota' },
  { id: 'league', name: 'Campeonato Brasileiro (Série A)', desc: 'Dispute uma liga completa de 38 rodadas com tabela de classificação' }
];

export default function MainMenu({
  formation,
  setFormation = () => {},
  playingStyle,
  setPlayingStyle = () => {},
  gameMode = 'normal',
  setGameMode = () => {},
  campaignMode = 'streak',
  setCampaignMode = () => {},
  onStart = () => {}
}) {
  return (
    <div className="menu-container">
      <div className="menu-logo">
        <div className="logo-badge">BRASILEIRÃO</div>
        <h1>INVICTO</h1>
        <p className="subtitle">Montador de Esquadrões Históricos</p>
      </div>

      <div className="menu-section">
        <h3>1. Escolha a Formação Tática</h3>
        <div className="options-grid">
          {FORMATIONS.map(f => (
            <button
              key={f.id}
              className={`menu-option-card ${formation === f.id ? 'active' : ''}`}
              onClick={() => setFormation(f.id)}
            >
              <div className="option-title">{f.name}</div>
              <div className="option-desc">{f.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="menu-section">
        <h3>2. Defina o Estilo de Jogo</h3>
        <div className="options-grid">
          {STYLES.map(s => (
            <button
              key={s.id}
              className={`menu-option-card ${playingStyle === s.id ? 'active' : ''}`}
              onClick={() => setPlayingStyle(s.id)}
            >
              <div className="option-title">{s.name}</div>
              <div className="option-desc">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="menu-section">
        <h3>3. Escolha o Modo de Jogo</h3>
        <div className="options-grid">
          {MODES.map(m => (
            <button
              key={m.id}
              className={`menu-option-card ${gameMode === m.id ? 'active' : ''}`}
              onClick={() => setGameMode(m.id)}
            >
              <div className="option-title">{m.name}</div>
              <div className="option-desc">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="menu-section">
        <h3>4. Escolha o Formato da Campanha</h3>
        <div className="options-grid">
          {CAMPAIGNS.map(c => (
            <button
              key={c.id}
              className={`menu-option-card ${campaignMode === c.id ? 'active' : ''}`}
              onClick={() => setCampaignMode(c.id)}
            >
              <div className="option-title">{c.name}</div>
              <div className="option-desc">{c.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button className="start-game-btn" onClick={onStart}>
        {campaignMode === 'league' ? 'INICIAR BRASILEIRÃO 🏆' : 'INICIAR INVICTO RUN 🎲'}
      </button>

      <div className="menu-footer">
        <p>Escale lendas e esquadrões clássicos de 2003 a 2025 para provar que você é o melhor estrategista do Brasileirão!</p>
      </div>
    </div>
  );
}
