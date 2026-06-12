# Spec: Modo Brasileirão Pontos Corridos

Este documento especifica a mecânica, visual e regras do novo modo de campeonato de pontos corridos com 38 rodadas no **Invicto**.

## 1. Escopo e Objetivos
Permitir ao usuário jogar uma liga completa de 38 rodadas baseada no Campeonato Brasileiro da Série A.
O jogador montará seu elenco via draft clássico e, em vez de jogar até perder (modo Invicto Run), disputará uma tabela contra 19 adversários históricos selecionados aleatoriamente a partir da base de dados do jogo.

---

## 2. Fluxo e Mecânicas de Jogo

### 2.1. Seleção da Campanha
No menu inicial, o usuário escolherá entre:
* **Sobrevivência (Invicto Run):** Manter a sequência invicta pelo maior número de partidas possível.
* **Campeonato Brasileiro:** Campeonato de 38 rodadas com tabela de classificação.

### 2.2. Inicialização do Campeonato
Quando o Brasileirão começar:
1. O jogo seleciona 19 adversários de `BR_TEAMS` com nomes de clubes únicos para evitar esquadrões do mesmo clube (ex: não misturar Flamengo 2019 e 2009 na mesma liga).
2. É gerado um calendário completo de 38 rodadas (19 jogos de ida + 19 de volta) usando o algoritmo de round-robin (Chaveamento Berger).
3. A tabela de classificação é inicializada com todos os 20 times com 0 pontos.

### 2.3. Simulação dos Jogos da Rodada
Em cada rodada:
* O usuário joga sua partida usando a tela clássica de simulação (`MatchEngine`).
* Os outros 9 confrontos da rodada são simulados automaticamente em segundo plano.
* A simulação dos oponentes utiliza suas forças de ataque, defesa, overall e um fator de oscilação randômico.

### 2.4. Atualização da Classificação
A tabela de classificação será ordenada pelos seguintes critérios da CBF:
1. Pontos ganhos (3 por vitória, 1 por empate)
2. Número de vitórias
3. Saldo de gols (gols marcados menos gols sofridos)
4. Gols pró (gols marcados)
5. Ordem alfabética (como desempate final)

---

## 3. Interface e Telas

### 3.1. League Hub (`screen === 'league_hub'`)
Uma tela central que exibe:
* **Tabela de Classificação:** Uma tabela estilizada com efeito de vidro (glassmorphism) contendo as posições, equipes e estatísticas (P, J, V, E, D, GP, GC, SG).
  * Marcadores visuais: G-4 em verde (classificados para a Libertadores) e Z-4 em vermelho (zona de rebaixamento).
* **Card da Próxima Partida:** Detalhes da próxima partida do usuário (equipe, ano e bandeira do adversário) com o botão para ir a campo.
* **Painel da Rodada:** Resultados de todos os confrontos da rodada atual.

### 3.2. Fim do Campeonato (`screen === 'league_end'`)
Quando a 38ª rodada for concluída, exibe:
* O resultado final da campanha do jogador:
  * **Campeão 🏆:** Se terminar em 1º lugar.
  * **Libertadores:** Se terminar no G-4.
  * **Série B:** Se terminar no Z-4.
  * **Fim de temporada:** Se terminar em posições intermediárias.
* A tabela final de classificação.
* Botão para reiniciar e voltar ao menu.

---

## 4. Persistência
Toda a tabela, rodadas pendentes e resultados de partidas serão persistidos no `localStorage` por meio do estado central em `App.jsx`, garantindo que o jogador possa fechar o navegador e continuar a liga de onde parou.
