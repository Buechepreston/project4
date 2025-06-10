// —————————————————————————
// Game configuration per team
// —————————————————————————
const levels = [
  {
    name: 'Cavs I',
    spawnInterval: 1200,
    speed: 2,
    sprite:  'LebronRookie_.jpg',
    background: 'LebronRookie_Background.jpg'
  },
  {
    name: 'Heat',
    spawnInterval: 1000,
    speed: 3,
    sprite:  'Lebron_miami.jpg',
    background: 'Lebron_Miami_background.jpg'
  },
  {
    name: 'Cavs II',
    spawnInterval:  800,
    speed: 4,
    sprite:  'Lebron_cav.webp',
    background: 'Lebron_cavs_background.jpg'
  },
  {
    name: 'Lakers',
    spawnInterval:  600,
    speed: 5,
    sprite:  'Lebron_laker.jpg',
    background: null               // no custom bg provided
  }
];

// —————————————————————————
// State & DOM refs
// —————————————————————————
let score = 0, lives = 3, level = 0;
let spawnTimer = null, animFrame = null;

const gameArea = document.querySelector('.game-area');
const lebron   = document.getElementById('lebron');
const hudScore = document.getElementById('score');
const hudLives = document.getElementById('lives');
const hudLevel = document.getElementById('level');

// —————————————————————————
// Helpers
// —————————————————————————
function setLevelAssets() {
  const cfg = levels[level];
  // background
  if (cfg.background) {
    gameArea.style.background = `url('${cfg.background}') center/cover no-repeat`;
  } else {
    gameArea.style.background = '#eee';
  }
  // LeBron sprite
  lebron.style.backgroundImage = `url('${cfg.sprite}')`;
  hudLevel.textContent = cfg.name;
}

function moveTo(lane) {
  lebron.className = '';        // clear old lane
  lebron.classList.add(`lane-${lane}`);
}

// AABB collision
function isColliding(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return !(
    r1.right  < r2.left  ||
    r1.left   > r2.right ||
    r1.bottom < r2.top   ||
    r1.top    > r2.bottom
  );
}

// —————————————————————————
// Input
// —————————————————————————
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  moveTo('left');
  if (e.key === 'ArrowUp')    moveTo('center');
  if (e.key === 'ArrowRight') moveTo('right');
});

// —————————————————————————
// Spawning defenders
// —————————————————————————
function spawnDefender() {
  const lanes = ['left','center','right'];
  const lane  = lanes[Math.floor(Math.random()*3)];
  const d     = document.createElement('div');
  d.className = `defender lane-${lane}`;
  gameArea.append(d);
}

// —————————————————————————
// Main loop: move defenders, check collision/dunk
// —————————————————————————
function update() {
  const cfg = levels[level];
  const rimY = gameArea.clientHeight - 100;  // ~300px

  document.querySelectorAll('.defender').forEach(d => {
    // 1) Move it down
    d.style.top = d.offsetTop + cfg.speed + 'px';

    // 2) Collision?
    if (isColliding(d, lebron)) {
      lives--;
      hudLives.textContent = lives;
      d.remove();
      return;  // skip dunk check
    }

    // 3) Dunk?
    if (d.offsetTop >= rimY) {
      score++;
      hudScore.textContent = score;
      d.remove();
    }
  });

  // 4) Level-up?
  const nextTarget = 5 * (level + 1);
  if (score >= nextTarget && level < levels.length - 1) {
    clearInterval(spawnTimer);
    level++;
    setLevelAssets();
    spawnTimer = setInterval(spawnDefender, levels[level].spawnInterval);
  }

  // 5) Game Over?
  if (lives <= 0) {
    clearInterval(spawnTimer);
    cancelAnimationFrame(animFrame);
    alert(`🏁 Game Over! Final Score: ${score}`);
    return;
  }

  animFrame = requestAnimationFrame(update);
}

// —————————————————————————
// Kick it all off
// —————————————————————————
function startGame() {
  setLevelAssets();
  moveTo('center');
  hudScore.textContent = score;
  hudLives.textContent = lives;

  spawnTimer = setInterval(spawnDefender, levels[level].spawnInterval);
  animFrame  = requestAnimationFrame(update);
}

// start!
startGame();
