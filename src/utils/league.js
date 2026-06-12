import { BR_TEAMS } from '../data/database';

export function getTeamAttributes(team) {
  if (team.id === 'user') {
    return {
      att: team.att,
      def: team.def,
      overall: team.overall
    };
  }
  
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
    att: attCount > 0 ? Math.round(attSum / attCount) : 75,
    def: defCount > 0 ? Math.round(defSum / defCount) : 75,
    overall: Math.round(totalSum / team.squad.length)
  };
}

export function selectLeagueOpponents() {
  const shuffled = [...BR_TEAMS].sort(() => Math.random() - 0.5);
  const selected = [];
  const selectedClubs = new Set();
  
  for (const team of shuffled) {
    if (!selectedClubs.has(team.name)) {
      const attrs = getTeamAttributes(team);
      selected.push({
        id: team.id,
        name: team.name,
        year: team.year,
        flag: team.flag,
        squad: team.squad,
        att: attrs.att,
        def: attrs.def,
        overall: attrs.overall
      });
      selectedClubs.add(team.name);
    }
    if (selected.length === 19) break;
  }
  
  // Caso precise complementar
  if (selected.length < 19) {
    for (const team of shuffled) {
      if (!selected.some(t => t.id === team.id)) {
        const attrs = getTeamAttributes(team);
        selected.push({
          id: team.id,
          name: team.name,
          year: team.year,
          flag: team.flag,
          squad: team.squad,
          att: attrs.att,
          def: attrs.def,
          overall: attrs.overall
        });
      }
      if (selected.length === 19) break;
    }
  }
  
  return selected;
}

export function generateSchedule(teams) {
  const N = teams.length;
  const rounds = [];
  const tempTeams = [...teams];
  
  for (let r = 0; r < N - 1; r++) {
    const roundMatches = [];
    for (let i = 0; i < N / 2; i++) {
      const home = tempTeams[i];
      const away = tempTeams[N - 1 - i];
      
      if (r % 2 === 0) {
        roundMatches.push({ home, away });
      } else {
        roundMatches.push({ home: away, away: home });
      }
    }
    rounds.push(roundMatches);
    
    // Rotaciona (mantendo o primeiro fixo)
    tempTeams.splice(1, 0, tempTeams.pop());
  }
  
  // Turno de volta
  const secondHalf = rounds.map(rMatches => {
    return rMatches.map(m => ({ home: m.away, away: m.home }));
  });
  
  return [...rounds, ...secondHalf];
}

export function simulateCpuMatch(teamA, teamB) {
  const ratingsA = getTeamAttributes(teamA);
  const ratingsB = getTeamAttributes(teamB);
  
  const formA = Math.floor(Math.random() * 7) - 3;
  const formB = Math.floor(Math.random() * 7) - 3;
  
  const attA = ratingsA.att + formA;
  const defA = ratingsA.def + formA;
  const attB = ratingsB.att + formB;
  const defB = ratingsB.def + formB;
  
  const diffOverall = ratingsA.overall - ratingsB.overall;
  const volModA = Math.max(0.6, Math.min(1.4, 1 + (diffOverall * 0.015)));
  const volModB = Math.max(0.6, Math.min(1.4, 1 - (diffOverall * 0.015)));
  
  const baseChance = 0.012;
  const chanceA = Math.max(0.003, (baseChance * volModA) + (attA - defB) * 0.0006);
  const chanceB = Math.max(0.003, (baseChance * volModB) + (attB - defA) * 0.0006);
  
  let scoreA = 0;
  let scoreB = 0;
  
  for (let min = 1; min <= 90; min++) {
    if (Math.random() < chanceA) scoreA++;
    if (Math.random() < chanceB) scoreB++;
  }
  
  return { scoreA, scoreB };
}

export function sortStandings(standings) {
  return [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.name.localeCompare(b.name);
  });
}
