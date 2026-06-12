# Plano de Implementação: Modo Brasileirão Pontos Corridos

Este plano descreve o desenvolvimento e integração do novo modo de pontos corridos de 38 rodadas ("Campeonato Brasileiro - Série A") no jogo **Invicto**.

---

## Alterações Propostas

### 1. Novo Módulo Utilitário de Liga
#### [NEW] [league.js](file:///home/diogenesc/code/invicto/src/utils/league.js)
Criar funções auxiliares para gerenciar a lógica do campeonato:
* `selectLeagueOpponents()`: Seleciona 19 elencos históricos de `BR_TEAMS` com nomes de clubes únicos.
* `generateSchedule(teams)`: Gera 38 rodadas (turno e returno) usando o algoritmo round-robin.
* `simulateCpuMatch(teamA, teamB)`: Simula de forma justa a pontuação de partidas entre computadores, mantendo a consistência com as fórmulas de atributos do jogo.
* `sortStandings(standings)`: Ordena a tabela pelos critérios oficiais de desempate da CBF.

---

### 2. Componentes de Interface da Liga
#### [NEW] [LeagueHub.jsx](file:///home/diogenesc/code/invicto/src/components/LeagueHub.jsx)
Painel central do campeonato exibindo:
* A tabela de classificação glassmorphic, colorindo as zonas de Libertadores (G-4 em verde) e Rebaixamento (Z-4 em vermelho).
* O card do próximo confronto do jogador com um botão de ação.
* Os resultados de todas as outras partidas da rodada simulada.

#### [NEW] [LeagueEnd.jsx](file:///home/diogenesc/code/invicto/src/components/LeagueEnd.jsx)
Tela final exibindo a coroação do Campeão (com animação de confetes), vaga na Libertadores, permanência ou rebaixamento à Série B, além da tabela de classificação final completa.

---

### 3. Modificações em Componentes Existentes
#### [MODIFY] [MainMenu.jsx](file:///home/diogenesc/code/invicto/src/components/MainMenu.jsx)
* Adicionar seção de seleção de "Formato do Jogo" (Sobrevivência Invicto vs Campeonato Brasileiro 38 Rodadas).
* Propagar as alterações por meio das propriedades `campaignMode` e `setCampaignMode`.

#### [MODIFY] [MatchEngine.jsx](file:///home/diogenesc/code/invicto/src/components/MatchEngine.jsx)
* Adaptar o botão de fim de partida para exibir "AVANÇAR RODADA ➔" no modo campeonato.
* Ajustar os callbacks `onMatchWin` e `onMatchLoss` para passar o placar final e deixar que o `App.jsx` controle o fluxo no modo campeonato (no Brasileirão, perder não encerra o campeonato imediatamente).

#### [MODIFY] [App.jsx](file:///home/diogenesc/code/invicto/src/App.jsx)
* Controlar novos estados da liga:
  * `campaignMode`: `'streak'` ou `'league'`.
  * `leagueOpponents`: lista de oponentes selecionados.
  * `leagueStandings`: tabela de classificação.
  * `leagueSchedule`: lista das 38 rodadas geradas.
  * `currentRound`: rodada ativa (0 a 37).
* Persistir todos os estados no `localStorage` sob a chave clássica de salvamento.
* Controlar a navegação para as novas telas `'league_hub'` e `'league_end'`.
* Simular as outras 9 partidas no momento em que o usuário conclui sua partida da rodada.

#### [MODIFY] [index.css](file:///home/diogenesc/code/invicto/src/index.css)
Adicionar estilos de layout e design para:
* Tabela classificatória e linhas com destaque visual.
* Cores indicativas de G-4 e Z-4.
* Confetes em animação CSS para a comemoração do campeão.
* Cards de confrontos e botões de campeonato.

---

## Plano de Verificação

### Testes Automatizados
* Rodar `npm run build` para certificar que o bundle do React/Vite constrói sem qualquer erro de sintaxe.

### Verificação Manual
1. **Seleção e Draft:** Iniciar no modo Campeonato Brasileiro, montar o time e verificar se o campeonato é criado com 19 oponentes únicos.
2. **Simulação da Liga:** Avançar rodadas jogando/simulando e confirmar se a tabela é atualizada de acordo com os resultados da rodada e os outros 9 jogos simulados.
3. **Persistência:** Recarregar a aba a meio do campeonato e confirmar que a tabela e a rodada atual continuam no mesmo estado.
4. **Fim do Campeonato:** Concluir as 38 rodadas e verificar o comportamento da tela final (título, Libertadores ou rebaixamento).
