import { BR_TEAMS } from '../data/database';

export function getTeamRatings(lineup) {
  const players = Object.values(lineup).filter(Boolean);
  if (players.length === 0) return { att: 50, def: 50, overall: 50 };

  let defSum = 0, defCount = 0;
  let attSum = 0, attCount = 0;
  let totalSum = 0;

  players.forEach(p => {
    totalSum += p.force;
  });

  Object.keys(lineup).forEach(slot => {
    const p = lineup[slot];
    if (!p) return;
    
    // Mapeamento dos slots do campo baseados em sua natureza defensiva/ofensiva
    if (["GK", "LB", "RB", "CB1", "CB2", "CB3", "DM", "VOL", "VOL1", "VOL2"].includes(slot)) {
      defSum += p.force;
      defCount++;
    } else {
      attSum += p.force;
      attCount++;
    }
  });

  const att = attCount > 0 ? Math.round(attSum / attCount) : 70;
  const def = defCount > 0 ? Math.round(defSum / defCount) : 70;
  const overall = Math.round(totalSum / players.length);

  return { att, def, overall };
}

export function generateOpponent(excludeIds = []) {
  const available = BR_TEAMS.filter(t => !excludeIds.includes(t.id));
  const pool = available.length > 0 ? available : BR_TEAMS;
  const team = pool[Math.floor(Math.random() * pool.length)];
  
  let attSum = 0, defSum = 0;
  let attCount = 0, defCount = 0;
  let totalSum = 0;

  team.squad.forEach(p => {
    totalSum += p.force;
    const isDef = p.positions.some(pos => ["GOL", "ZAG", "LD", "LE", "VOL"].includes(pos));
    if (isDef) {
      defSum += p.force;
      defCount++;
    } else {
      attSum += p.force;
      attCount++;
    }
  });

  return {
    id: team.id,
    name: team.name,
    year: team.year,
    flag: team.flag,
    att: attCount > 0 ? Math.round(attSum / attCount) : 75,
    def: defCount > 0 ? Math.round(defSum / defCount) : 75,
    overall: Math.round(totalSum / team.squad.length),
    squad: team.squad
  };
}

export function simulateMatch(userLineup, userStyle, opponent) {
  const userStats = getTeamRatings(userLineup);
  
  let userAtt = userStats.att;
  let userDef = userStats.def;
  let oppAtt = opponent.att;
  let oppDef = opponent.def;

  // Ajusta por estilo de jogo do usuário
  if (userStyle === "attacking") {
    userAtt += 5;
    userDef -= 4;
  } else if (userStyle === "defensive") {
    userDef += 5;
    userAtt -= 4;
  }

  const baseChance = 0.012; // Chance base por minuto
  const userGoalChance = baseChance + (userAtt - oppDef) * 0.0006;
  const oppGoalChance = baseChance + (oppAtt - userDef) * 0.0006;

  const events = [];
  let userScore = 0;
  let oppScore = 0;

  // Filtra jogadores elegíveis para fazer gols no time do usuário (meio-campistas e atacantes)
  const userScorersPool = Object.entries(userLineup)
    .filter(([slot, p]) => p && !["GOL", "LD", "LE", "ZAG", "CB", "CB1", "CB2"].includes(slot))
    .map(([_, p]) => p);

  // Se o pool de goleadores do usuário estiver vazio, pega qualquer jogador de linha
  const userBackupPool = Object.values(userLineup).filter(p => p && !p.positions.includes("GOL"));

  for (let min = 1; min <= 90; min++) {
    const rollUser = Math.random();
    const rollOpp = Math.random();

    if (rollUser < userGoalChance) {
      userScore++;
      
      // Escolhe o autor do gol do usuário
      let scorer = "Jogador";
      if (userScorersPool.length > 0) {
        // Da peso maior para posições como CA
        const weights = userScorersPool.map(p => p.positions.includes("CA") ? 3 : p.positions.includes("MEI") || p.positions.includes("PD") || p.positions.includes("PE") ? 2 : 1);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let randomWeight = Math.random() * totalWeight;
        let selectedIndex = 0;
        for (let i = 0; i < userScorersPool.length; i++) {
          randomWeight -= weights[i];
          if (randomWeight <= 0) {
            selectedIndex = i;
            break;
          }
        }
        scorer = userScorersPool[selectedIndex].name;
      } else if (userBackupPool.length > 0) {
        scorer = userBackupPool[Math.floor(Math.random() * userBackupPool.length)].name;
      }

      events.push({
        minute: min,
        type: "goal_user",
        text: `⚽ ${min}' - GOL DO TIME DO USUÁRIO! ${scorer} balança as redes!`,
        scorer: scorer
      });
    } else if (rollOpp < oppGoalChance) {
      oppScore++;

      // Escolhe autor do gol do oponente
      const oppScorersPool = opponent.squad.filter(p => !p.positions.includes("GOL"));
      let scorer = "Jogador";
      if (oppScorersPool.length > 0) {
        const weights = oppScorersPool.map(p => p.positions.includes("CA") ? 3 : p.positions.includes("MEI") || p.positions.includes("PD") || p.positions.includes("PE") ? 2 : 1);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let randomWeight = Math.random() * totalWeight;
        let selectedIndex = 0;
        for (let i = 0; i < oppScorersPool.length; i++) {
          randomWeight -= weights[i];
          if (randomWeight <= 0) {
            selectedIndex = i;
            break;
          }
        }
        scorer = oppScorersPool[selectedIndex].name;
      }

      events.push({
        minute: min,
        type: "goal_opp",
        text: `⚽ ${min}' - Gol do ${opponent.name}! ${scorer} marca para o adversário.`,
        scorer: scorer
      });
    } else if (Math.random() < 0.04) {
      const isUser = Math.random() > 0.5;
      if (isUser) {
        const players = Object.values(userLineup).filter(p => p && !p.positions.includes("GOL"));
        const pName = players.length > 0 ? players[Math.floor(Math.random() * players.length)].name : "Jogador";
        events.push({
          minute: min,
          type: "miss",
          text: `💥 ${min}' - Quase! ${pName} finaliza forte de fora da área e a bola raspa a trave!`
        });
      } else {
        const oppPlayers = opponent.squad.filter(p => !p.positions.includes("GOL"));
        const pName = oppPlayers.length > 0 ? oppPlayers[Math.floor(Math.random() * oppPlayers.length)].name : "Jogador";
        events.push({
          minute: min,
          type: "miss",
          text: `🧤 ${min}' - Defesaça! O goleiro voa no ângulo para espalmar a finalização de ${pName}!`
        });
      }
    }
  }

  return {
    userScore,
    oppScore,
    events
  };
}
