# 🏆 Invicto · [invicto.club](https://invicto.club)

**Invicto** é um jogo de draft e simulação de futebol no navegador, inspirado em clássicos do estilo survival manager. O objetivo é montar um esquadrão imbatível sorteando jogadores históricos do Campeonato Brasileiro da era dos pontos corridos (2003 — 2025) e tentar se manter invicto pelo maior número de partidas consecutivas.

---

## 🇧🇷 Tema "Brazuca" e Experiência Mobile-First

* **Design Estilizado:** Interface nas cores verde floresta, amarelo canário e detalhes em azul royal, proporcionando uma atmosfera premium inspirada no futebol nacional.
* **Mobile-First:** Layout responsivo e controles adaptados para telas móveis e desktops, garantindo uma jogabilidade fluida em qualquer dispositivo.
* **Draft Dinâmico:** Sorteie clubes/anos históricos e escolha cirurgicamente os jogadores para preencher seu esquema tático (4-3-3, 4-4-2, 3-5-2 ou 4-2-3-1).
* **Simulação Minuto a Minuto:** Engine probabilística realista que calcula os ratings de ataque e defesa baseando-se nas formações táticas e no estilo de jogo (Equilibrado, Atacante ou Defensivo).

---

## 🛠️ Tecnologias Utilizadas

* **React** (Componentização da interface)
* **Vite** (Build tool rápida e servidor de desenvolvimento)
* **Vanilla CSS** (Estilos customizados e animações suaves)
* **Local Storage Persistence** (O progresso do draft é salvo automaticamente para evitar perda de dados com f5)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### 1. Clonar o repositório
```bash
git clone git@github.com:diogenesc/invicto.git
cd invicto
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Rodar em modo de desenvolvimento
```bash
npm run dev
```
O servidor estará disponível por padrão em `http://localhost:5173`.

### 4. Construir para produção
```bash
npm run build
```

---

## 📝 Regras do Jogo

1. **Escolha sua tática e estilo de jogo:** Defina a formação ideal para o seu elenco inicial.
2. **Rode o dado (Draft):** Obtenha um time clássico do Brasileirão de forma aleatória. Escolha um jogador e posicione-o na sua formação de acordo com a posição disponível.
3. **Re-rolls limitados:** Você tem 3 oportunidades de re-rolar o time ou o ano se o sorteio não for favorável.
4. **Inicie o Invicto Run:** Uma vez escalado os 11 titulares, inicie a simulação. A cada rodada, o simulador decidirá os gols minuto a minuto baseado na força do seu time vs. adversários reais do banco de dados histórico.
5. **Sobreviva:** A sequência acaba na primeira derrota! Quantas rodadas você consegue ficar invicto?
