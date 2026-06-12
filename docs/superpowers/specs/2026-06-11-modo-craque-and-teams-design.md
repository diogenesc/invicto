# Design Spec: Modo Craque e Expansão de Times (32 Elencos)

Este documento especifica a implementação do "Modo Craque" (onde as forças/overalls dos jogadores são ocultados durante o draft) e a expansão da base de dados de times para 32 elencos históricos e recentes no jogo **Invicto**.

## 1. Modo Craque (Modo Especialista)

O Modo Craque permite ao jogador montar o time sem ver as forças/overalls individuais dos jogadores sorteados nem as médias de ataque, defesa e geral da equipe, revelando tudo apenas quando a escalação estiver 100% completa.

### Fluxo de Usuário
1. **Menu Inicial (`MainMenu.jsx`):**
   - Adicionada uma nova seção para escolha de modo de jogo (Card "Normal" vs Card "Modo Craque").
   - A seleção do modo de jogo é repassada para o `App.jsx` e persistida no `localStorage` sob o estado do jogo.

2. **Tela de Draft (`PlayerDraft.jsx` e `SoccerField.jsx`):**
   - Se o modo de jogo for "Craque" e o draft ainda não estiver completo:
     - As forças individuais dos jogadores na lista de sorteio aparecem como um ícone de cadeado (`🔒`).
     - As forças dos jogadores escalados nas posições do campo de futebol aparecem como `🔒`.
     - As médias do time (geral, ataque e defesa) no sumário/Box Score e cabeçalho aparecem como `??`.
     - As forças nas linhas preenchidas da tabela do Box Score aparecem como `🔒`.

3. **Fluxo de Revelação (Final do Draft):**
   - Ao escalar o 11º jogador (draft completo), surge um botão em destaque: **"REVELAR FORÇA DO TIME ✨"**.
   - Ao clicar no botão, os atributos ocultos são revelados na tela com um efeito de animação (ex: flip 3D nos cartões ou fade-in dinâmico) antes de liberar o botão "INICIAR SIMULAÇÃO".
   - Após a revelação, o fluxo segue normalmente para a simulação com os atributos visíveis.

---

## 2. Expansão da Base de Dados (32 Elencos)

Serão adicionados 16 novos times históricos e recentes ao arquivo `src/data/database.js`. Cada time terá uma escalação de 11 jogadores titulares com seus respectivos números, posições compatíveis, força/overall estimada e indicação se é uma lenda (`legend: true/false`).

### Novos Elencos Adicionados:
1. **Bahia (1988)** 🇧🇦 — Campeão Brasileiro (Bobô, Charles, Zé Carlos)
2. **Guarani (1978)** 🏹 — Campeão Brasileiro (Careca, Zenon)
3. **Criciúma (1991)** 🐯 — Campeão da Copa do Brasil com Felipão (Grizzo, Jairo Lenzi)
4. **Juventude (1999)** 🟢 — Campeão da Copa do Brasil (Christian, Capone)
5. **Vasco (2011)** 💢 — Vice Brasileiro e Campeão da Copa do Brasil (Diego Souza, Dedé, Fagner)
6. **Sport (2008)** 🦁 — Campeão da Copa do Brasil (Carlinhos Bala, Durval, Magrão)
7. **Paysandu (2003)** 🛩️ — Histórico na Libertadores (Iarley, Robgol)
8. **Chapecoense (2016)** 🟢 — Campeã da Sul-Americana (Danilo, Cleber Santana)
9. **Grêmio (2017)** 🔵 — Campeão da Libertadores (Luan, Arthur, Grohe, Geromel)
10. **Santos (2011)** 🐳 — Campeão da Libertadores (Neymar, Ganso, Elano, Danilo)
11. **Corinthians (2012)** 🦅 — Campeão do Mundo e da Liberta Invicto (Emerson Sheik, Paulinho, Cássio)
12. **Athletico-PR (2019)** 🌪️ — Campeão da Copa do Brasil (Bruno Guimarães, Rony, Santos)
13. **Fortaleza (2023)** 🦁 — Vice-Campeão da Sul-Americana (Lucero, Marinho, Tinga)
14. **Red Bull Bragantino (2021)** 🐂 — Vice-Campeão da Sul-Americana (Artur, Léo Ortiz)
15. **Ceará (2020)** 🏁 — Campeão da Copa do Nordeste (Vina, Sobral, Lima)
16. **Goiás (2005)** 🟢 — 3º Colocado no Brasileirão (Souza, Tabata, Harlei)

---

## 3. Alterações nos Arquivos

### `src/data/database.js`
- Adição dos 16 novos objetos de times com seus elencos no array `BR_TEAMS`.

### `src/App.jsx`
- Adicionar o estado `gameMode` (valores: `'normal'` ou `'craque'`), com persistência no `localStorage`.
- Passar o `gameMode` para o componente `MainMenu` (para seleção inicial) e `PlayerDraft` / `SoccerField` (para controle de ocultação).
- Controlar o estado de revelação `revealed` (booleano) que determina se a força do time já foi mostrada após o término do draft.

### `src/components/MainMenu.jsx`
- Inclusão da seção visual para escolha de modo de jogo (cards clicáveis com descrição do modo).

### `src/components/PlayerDraft.jsx`
- Ocultar a força do jogador nas cartas do pool de sorteio usando `🔒`.
- Ocultar forças nas linhas da tabela do sumário lateral com `🔒`.
- Ocultar as médias no Box Score (`??`).
- Adicionar o botão "REVELAR FORÇA DO TIME ✨" ao completar 11 jogadores e controlar a animação de revelação.

### `src/components/SoccerField.jsx`
- Ocultar a força no círculo do jogador escalado no campo de futebol, exibindo `🔒`.

---

## 4. Plano de Verificação

### Testes Manuais
1. **Verificação do Menu Inicial:**
   - Iniciar o jogo no modo Normal e verificar se tudo funciona como antes.
   - Iniciar o jogo no Modo Craque e verificar se a flag correta foi salva no `localStorage`.
2. **Verificação da Ocultação de Estatísticas:**
   - No draft do Modo Craque, validar que nenhuma força (nem individual nas cartas, nem média no sumário, nem no campo) é exibida numericamente.
   - Confirmar que os ícones `🔒` e `??` aparecem de forma consistente.
3. **Verificação do Botão de Revelação:**
   - Completar o draft de 11 jogadores.
   - Validar que o botão de Simulação fica travado e o botão de Revelação fica disponível.
   - Clicar em "Revelar Força do Time" e garantir que todos os números originais aparecem.
   - Garantir que a simulação funcione perfeitamente com os atributos revelados.
4. **Verificação da Expansão de Times:**
   - Rodar múltiplos drafts e garantir que os novos elencos (ex: Bahia 1988, Chapecoense 2016, Santos 2011) sejam sorteados corretamente e contenham os jogadores certos nas posições adequadas.
