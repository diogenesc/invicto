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
      const weight = slot === "GK" ? 2 : 1;
      defSum += p.force * weight;
      defCount += weight;
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
      const isGK = p.positions.includes("GOL");
      const weight = isGK ? 2 : 1;
      defSum += p.force * weight;
      defCount += weight;
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
  
  // Fator de oscilação do dia (entre -3 e +3 pontos de variação para cada equipe)
  const userForm = Math.floor(Math.random() * 7) - 3;
  const oppForm = Math.floor(Math.random() * 7) - 3;

  let oppAttVal = opponent.att;
  let oppDefVal = opponent.def;
  let oppOverallVal = opponent.overall;

  if (oppAttVal === undefined || oppDefVal === undefined || oppOverallVal === undefined) {
    let attSum = 0, defSum = 0;
    let attCount = 0, defCount = 0;
    let totalSum = 0;
    const squad = opponent.squad || [];

    squad.forEach(p => {
      totalSum += p.force;
      const isDef = p.positions.some(pos => ["GOL", "ZAG", "LD", "LE", "VOL"].includes(pos));
      if (isDef) {
        const isGK = p.positions.includes("GOL");
        const weight = isGK ? 2 : 1;
        defSum += p.force * weight;
        defCount += weight;
      } else {
        attSum += p.force;
        attCount++;
      }
    });

    oppAttVal = attCount > 0 ? Math.round(attSum / attCount) : 75;
    oppDefVal = defCount > 0 ? Math.round(defSum / defCount) : 75;
    oppOverallVal = squad.length > 0 ? Math.round(totalSum / squad.length) : 75;
  }

  let userAtt = userStats.att + userForm;
  let userDef = userStats.def + userForm;
  let oppAtt = oppAttVal + oppForm;
  let oppDef = oppDefVal + oppForm;

  // Ajusta por estilo de jogo do usuário
  if (userStyle === "attacking") {
    userAtt += 5;
    userDef -= 4;
  } else if (userStyle === "defensive") {
    userDef += 5;
    userAtt -= 4;
  }

  // Diferença de overall (meio-campo) afetando o volume de jogo (baseChance)
  const overallDiff = userStats.overall - oppOverallVal;
  const userVolMod = Math.max(0.6, Math.min(1.4, 1 + (overallDiff * 0.015)));
  const oppVolMod = Math.max(0.6, Math.min(1.4, 1 - (overallDiff * 0.015)));

  const baseChance = 0.012; // Chance base por minuto
  
  // Calcula a chance por minuto garantindo um piso mínimo (underdog floor) de 0.003
  const userGoalChance = Math.max(0.003, (baseChance * userVolMod) + (userAtt - oppDef) * 0.0006);
  const oppGoalChance = Math.max(0.003, (baseChance * oppVolMod) + (oppAtt - userDef) * 0.0006);

  const events = [];
  let userScore = 0;
  let oppScore = 0;

  // Mensagem de estado/forma inicial (minuto 0)
  let formText = "⚖️ Aquecimento concluído. A torcida canta alto e o jogo está prestes a começar!";
  if (userForm >= 2 && oppForm <= -2) {
    formText = "🔥 Pré-jogo: Seu time voa no aquecimento sob aplausos! O adversário parece nervoso e desorganizado.";
  } else if (userForm >= 2) {
    formText = "📈 Pré-jogo: Grande atmosfera! Seus jogadores demonstram muita confiança e entrosamento na preparação final.";
  } else if (userForm <= -2) {
    formText = "📉 Pré-jogo: Clima tenso! Erros bobos no aquecimento indicam que a equipe está sob forte pressão hoje.";
  } else if (oppForm >= 2) {
    formText = "⚠️ Pré-jogo: Olho neles! O time adversário faz um aquecimento impecável e focado sob vaias da torcida.";
  }

  events.push({
    minute: 0,
    type: "info",
    text: formText
  });

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
