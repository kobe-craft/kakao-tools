const term = document.getElementById('term');
const out = document.getElementById('out');
let locked = false, target = '';
const wait = ms => new Promise(r => setTimeout(r, ms));
const rnd = n => Math.floor(Math.random() * n);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function add(html, cls) {
  const d = document.createElement('div');
  d.className = 'l ' + (cls || '');
  d.innerHTML = html;
  out.appendChild(d);
  term.scrollTop = term.scrollHeight;
  return d;
}

// 연출 중에는 페이지 이탈/키 입력/우클릭 차단
window.addEventListener('beforeunload', e => { if (locked) { e.preventDefault(); e.returnValue = ''; } });
window.addEventListener('keydown', e => { if (locked) e.preventDefault(); }, true);
term.addEventListener('contextmenu', e => e.preventDefault());

// ───────── 전체 흐름 ─────────
async function run(url) {
  resetDamage(); locked = true; target = url;
  stopKey(); out.innerHTML = '';
  term.className = 'on shake';

  await errorTitle();     // ERROR 타이틀
  add('C:\\WEBSITE\\SYSTEM32&gt; FATAL EXCEPTION 0x0000DEAD', 'red');
  add('[!] 외부 링크 접근 감지: ' + esc(url), 'yel');
  add('[ERROR] 시스템이 불안정합니다. 페이지를 벗어날 수 없습니다.', 'red');
  await wait(800);
  for (const t of ['메모리 덤프 생성 중...', '커널 패닉 복구 시도...', '보안 모듈 재부팅...']) {
    add('C:\\&gt; ' + t); await wait(450);
  }
  const bar = add('');
  for (let i = 0; i <= 20; i++) {
    bar.textContent = 'LOADING [' + '#'.repeat(i) + '.'.repeat(20 - i) + '] ' + String(i * 5).padStart(3, ' ') + '%';
    await wait(110);
  }
  term.classList.remove('shake');
  await wait(400);

  add('');
  add('치명적 오류 신호 수신 중...', 'yel');
  await showWarn();       // ASCII 경고 삼각형
  await errorStorm();     // 에러 팝업 48개
  add('');
  await phoneDamage();    // 휴대폰 손상 연출
  leave();                // 링크로 이동
}

// ───────── ERROR 타이틀 (폭이 일정한 '#' 문자만 사용) ─────────
const FONT = {
  E: ['####', '#...', '###.', '#...', '####'],
  R: ['###.', '#..#', '###.', '#.#.', '#..#'],
  O: ['.##.', '#..#', '#..#', '#..#', '.##.']
};
const TITLE = 'ERROR';
function titleLines() {
  const rows = [];
  for (let r = 0; r < 5; r++) {
    let s = '';
    for (const ch of TITLE) s += FONT[ch][r].replace(/#/g, '##').replace(/\./g, '  ') + '  ';
    rows.push(s.replace(/\s+$/, ''));
  }
  return rows;
}
async function errorTitle() {
  const base = titleLines(), W = 48;
  const pre = document.createElement('pre');
  pre.className = 'ka e1';
  pre.style.fontSize = 'min(calc((100vw - 28px) / ' + (W * 0.62).toFixed(1) + '), 16px)';
  pre.style.width = 'max-content';
  pre.style.margin = '6px auto 12px';
  out.appendChild(pre);
  for (let f = 0; f < 14; f++) {          // 처음 1초: 글리치로 흔들리다가 안정
    const amp = Math.max(0, 7 - f / 2);
    pre.textContent = base.map(l => (amp > 0 && rnd(3) === 0) ? ' '.repeat(rnd(Math.floor(amp * 2) + 1)) + l : l).join('\n');
    await wait(70);
  }
  pre.textContent = base.join('\n');
}

// ───────── ASCII 경고 삼각형 ─────────
const WW = 41, WH = 22, WCX = 20;
const WTEXT = 'C R I T I C A L   E R R O R';

function drawWarn(t) {
  const ph = t % 64;
  const ch = Array.from({ length: WH }, () => Array(WW).fill(' '));
  const cl = Array.from({ length: WH }, () => Array(WW).fill(''));
  const put = (r, c, x, k) => { if (r >= 0 && r < WH && c >= 0 && c < WW) { ch[r][c] = x; cl[r][c] = k; } };

  // 정상 → 삼각형 소멸(글자만) → 깨진 글리치 → 글자만 → 복귀
  let tri = true, tl = WTEXT.length, shifts = 0, shards = false;
  if (ph >= 24 && ph < 27) { tri = false; tl = 5; }
  else if (ph >= 27 && ph < 31) { shards = true; shifts = 7; tl = 19; }
  else if (ph >= 31 && ph < 34) { tri = false; }
  else if (ph >= 34 && ph < 37) { shifts = 4; }
  else if (rnd(14) === 0) { shifts = 2; }
  const k = ((t >> 2) & 1) ? 'e1' : 'e2';

  if (tri) {
    for (let r = 0; r <= 15; r++) {
      const hw = 1 + r * 17 / 15, L = Math.round(WCX - hw), R = Math.round(WCX + hw), row = r + 3;
      if (r >= 14) { for (let c = L; c <= R; c++) put(row, c, '#', k); }
      else { put(row, L, '#', k); put(row, L + 1, '#', k); put(row, R, '#', k); put(row, R - 1, '#', k); }
    }
    for (let r = 8; r <= 13; r++) for (let c = 19; c <= 21; c++) put(r, c, '#', k);
    for (let c = 19; c <= 21; c++) put(15, c, '#', k);
  }
  if (shards) {
    for (let i = 0; i < 7; i++) {
      const row = rnd(4), c0 = WCX - 16 + rnd(26), len = 2 + rnd(9);
      for (let c = 0; c < len; c++) put(row, c0 + c, rnd(3) ? '#' : '/', 'e1');
    }
    for (let i = 0; i < 10; i++) put(3 + rnd(16), rnd(WW), ' ', '');
  }
  for (let i = 0; i < shifts; i++) {
    const r = 3 + rnd(16), dx = rnd(17) - 8;
    const sh = a => a.map((_, c) => a[c - dx] === undefined ? ' ' : a[c - dx]);
    const sc = cl[r].map((_, c) => cl[r][c - dx] === undefined ? '' : cl[r][c - dx]);
    ch[r] = sh(ch[r]); cl[r] = sc;
  }
  const c0 = WCX - Math.floor(WTEXT.length / 2);
  for (let i = 0; i < tl; i++) if (WTEXT[i] !== ' ') put(20, c0 + i, WTEXT[i], 'e1');

  let html = '';
  for (let r = 0; r < WH; r++) {
    let cur = '', run = '';
    const flush = () => { if (run) html += cur ? '<span class="' + cur + '">' + run + '</span>' : run; run = ''; };
    for (let c = 0; c < WW; c++) {
      if (cl[r][c] !== cur) { flush(); cur = cl[r][c]; }
      run += ch[r][c];
    }
    flush();
    html += '\n';
  }
  return html;
}

let keyTimer = null;
function stopKey() { clearInterval(keyTimer); keyTimer = null; }

async function showWarn() {
  stopKey();
  const pre = document.createElement('pre');
  pre.className = 'ka';
  pre.style.fontSize = 'min(calc((100vw - 28px) / ' + (WW * 0.62).toFixed(1) + '), 15px)';
  out.appendChild(pre);
  let t = 25;
  keyTimer = setInterval(() => { t++; pre.innerHTML = drawWarn(t); }, 110);
  term.scrollTop = term.scrollHeight;
  await wait(4200);
}

// ───────── 에러 팝업창 폭주 ─────────
async function errorStorm(custom, count) {
  const layer = document.getElementById('pops');
  const msgs = ['CRITICAL_PROCESS_DIED', '메모리 접근 오류가 발생했습니다', 'SYSTEM32 파일이 손상되었습니다', 'KERNEL PANIC - 복구 불가', '연결이 강제 종료되었습니다', '보안 모듈이 응답하지 않습니다', 'UNEXPECTED_STORE_EXCEPTION', '디스크 읽기 실패 (sector 0x00A1)', 'STACK OVERFLOW DETECTED', 'ACCESS_VIOLATION at 0x7FFE', '인증 토큰이 만료되었습니다', 'DRIVER_IRQL_NOT_LESS_OR_EQUAL', '알 수 없는 프로세스가 실행 중입니다', '방화벽이 비활성화되었습니다'];
  const N = count || 48;   // 팝업 개수
  for (let i = 0; i < N; i++) {
    const d = document.createElement('div');
    d.className = 'pop' + (rnd(5) === 0 ? ' warn' : '');
    const w = Math.min(window.innerWidth * 0.72, 250);
    d.style.width = w + 'px';
    d.style.left = rnd(Math.max(1, window.innerWidth - w)) + 'px';
    d.style.top = rnd(Math.max(1, window.innerHeight - 100)) + 'px';
    const hex = ('00000000' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16)).slice(-8).toUpperCase();
    d.innerHTML = '<div class="pt"><span>' + (rnd(2) ? 'ERROR' : 'FATAL') + ' 0x' + hex + '</span><b>X</b></div><div class="pb">' + (custom || msgs)[rnd((custom || msgs).length)] + '</div><div class="pk">[ 확인 ]  [ 취소 ]</div>';
    layer.appendChild(d);
    if (i % 6 === 0 && navigator.vibrate) { try { navigator.vibrate(20); } catch (e) {} }
    await wait(Math.max(35, 260 - i * 6));   // 점점 빨라짐
  }
  await wait(900);
  layer.style.background = '#ff2433';        // 빨간 플래시 후 전부 제거
  await wait(120);
  layer.style.background = '';
  layer.innerHTML = '';
}

// ───────── 휴대폰 손상 연출 ─────────
let dmgTimer = null;
function resetDamage() {
  clearInterval(dmgTimer);
  const c = document.getElementById('dmg');
  c.getContext('2d').clearRect(0, 0, c.width, c.height);
  document.getElementById('hud').style.display = 'none';
  document.getElementById('blk').style.display = 'none';
  term.style.clipPath = ''; term.style.transition = ''; term.style.filter = '';
}

async function phoneDamage() {
  const c = document.getElementById('dmg'), ctx = c.getContext('2d'), hud = document.getElementById('hud');
  const W = c.width = window.innerWidth, H = c.height = window.innerHeight;
  const dev = ['배터리 온도가 너무 높습니다 (78°C)', '디스플레이 패널 손상 감지', '저장공간이 손상되었습니다', '터치 센서 응답 없음', '시스템 UI가 중지되었습니다', '카메라 모듈 연결 끊김', '스피커 과부하 - 손상 위험', '메인보드 전압 이상', '기기가 곧 종료됩니다', '충전 포트에 이상 전류 감지'];
  errorStorm(dev, 26);   // 상태창 팝업을 동시에 띄움
  hud.style.display = 'block';
  term.classList.add('shake');
  if (navigator.vibrate) { try { navigator.vibrate([200, 60, 200, 60, 500]); } catch (e) {} }

  // 금 가는 경로 생성 (충격점에서 바깥으로 퍼짐)
  const ox = W * (0.35 + Math.random() * 0.3), oy = H * (0.25 + Math.random() * 0.3);
  const segs = [];
  const grow = (x, y, a, gen) => {
    const n = 10 + rnd(14);
    for (let i = 0; i < n && x > -20 && x < W + 20 && y > -20 && y < H + 20; i++) {
      const len = 8 + Math.random() * 22, na = a + (Math.random() - 0.5) * 0.6;
      const nx = x + Math.cos(na) * len, ny = y + Math.sin(na) * len;
      segs.push([x, y, nx, ny, gen]);
      x = nx; y = ny; a = na;
      if (gen < 3 && Math.random() < 0.16) grow(x, y, a + (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.7), gen + 1);
    }
  };
  for (let k = 0; k < 9; k++) grow(ox, oy, (k / 9) * Math.PI * 2 + Math.random() * 0.4, 0);
  segs.sort((a, b) => Math.hypot(a[0] - ox, a[1] - oy) - Math.hypot(b[0] - ox, b[1] - oy));

  const g0 = ctx.createRadialGradient(ox, oy, 0, ox, oy, 45);
  g0.addColorStop(0, 'rgba(255,255,255,.7)'); g0.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g0; ctx.fillRect(ox - 45, oy - 45, 90, 90);

  const bar = (v, n) => { const f = Math.max(0, Math.min(n, Math.round(v / 100 * n))); return '#'.repeat(f) + '.'.repeat(n - f); };
  const D = 6500, t0 = Date.now();   // D: 연출 시간(ms)
  let drawn = 0, lastBlob = 0;
  await new Promise(res => {
    dmgTimer = setInterval(() => {
      const el = Date.now() - t0, p = Math.min(1, el / D);

      // 액정 금
      const upto = Math.floor(segs.length * Math.min(1, p * 1.3));
      ctx.lineCap = 'round';
      for (; drawn < upto; drawn++) {
        const s = segs[drawn];
        ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 3.2 - s[4] * 0.6;
        ctx.beginPath(); ctx.moveTo(s[0] + 1, s[1] + 1); ctx.lineTo(s[2] + 1, s[3] + 1); ctx.stroke();
        ctx.strokeStyle = s[4] ? 'rgba(215,230,255,.75)' : 'rgba(255,255,255,.95)'; ctx.lineWidth = 1.7 - s[4] * 0.4;
        ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); ctx.stroke();
      }
      // 액정 데드라인
      if (rnd(100) < 25 + p * 45) {
        ctx.fillStyle = ['#ff00ff', '#00ff66', '#00e5ff', '#ffffff', '#000000', '#ff2433'][rnd(6)];
        ctx.globalAlpha = 0.85;
        ctx.fillRect(rnd(W), rnd(2) ? 0 : rnd(H), 1 + rnd(5), rnd(2) ? H : rnd(H * 0.6));
        ctx.globalAlpha = 1;
      }
      // 액정 번짐(잉크 얼룩)
      if (p > 0.3 && el - lastBlob > 450) {
        lastBlob = el;
        const bx = ox + (Math.random() - 0.5) * W * 0.7, by = oy + (Math.random() - 0.5) * H * 0.5, br = 50 + rnd(90);
        const col = rnd(2) ? '110,0,200' : '0,170,90';
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, 'rgba(' + col + ',.7)'); g.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.fillStyle = g; ctx.fillRect(bx - br, by - br, br * 2, br * 2);
      }
      term.style.filter = rnd(10) === 0 ? 'invert(1)' : '';   // 가끔 반전 깜빡임

      // 기기 상태창
      const j = () => Math.random() * 3 - 1.5;
      const temp = 31 + p * 47 + j(), cpu = Math.min(100, 18 + p * 100 + j() * 3), sto = Math.min(100, p * 89 + Math.abs(j()));
      hud.style.color = p > 0.45 ? '#ff5560' : '#ffd23b';
      hud.textContent = '[ DEVICE STATUS ]\n' +
        'BATTERY ' + temp.toFixed(1) + 'C [' + bar((temp - 25) / 55 * 100, 16) + '] ' + (temp > 60 ? 'OVERHEAT' : 'WARM') + '\n' +
        'CPU     ' + cpu.toFixed(0) + '% [' + bar(cpu, 16) + ']\n' +
        'STORAGE CORRUPT ' + sto.toFixed(0) + '% [' + bar(sto, 12) + ']\n' +
        'DISPLAY DEAD PX ' + Math.floor(p * p * 48210).toLocaleString() + '\n' +
        'TOUCH   ' + (p < 0.3 ? 'OK' : (rnd(2) ? 'GHOST TOUCH' : 'NO RESPONSE')) +
        (p > 0.8 ? '\n>> SHUTDOWN IMMINENT <<' : '');
      if (p >= 1) { clearInterval(dmgTimer); res(); }
    }, 50);
  });

  // 강제 종료: 화면이 선으로 줄어들며 꺼짐
  term.classList.remove('shake'); term.style.filter = '';
  await wait(600);
  document.getElementById('blk').style.display = 'block';
  term.style.transition = 'clip-path .3s ease-in';
  term.style.clipPath = 'inset(49% 0 49% 0)';
  await wait(330);
  term.style.clipPath = 'inset(49.6% 49.6% 49.6% 49.6%)';
  await wait(1500);
}

// ───────── 이동 / 링크 가로채기 ─────────
function leave() {
  stopKey();
  locked = false;
  location.href = target;
  setTimeout(() => { term.classList.remove('on'); resetDamage(); }, 1500); // 이동이 막혔을 때 대비
}

// 외부 사이트로 나가는 http(s) 링크만 가로챔 (내부 링크, #앵커, mailto 등은 그대로 동작)
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a || locked) return;
  if (!/^https?:$/.test(a.protocol)) return;
  if (a.origin === location.origin) return;
  e.preventDefault();
  run(a.href);
});