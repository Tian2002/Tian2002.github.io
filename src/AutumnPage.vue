<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { standalonePages } from './pages.js'

const artwork = '/festivals/autumn.webp'
const letter = ref(null)
const keepsake = ref(null)
const received = ref(false)
const paused = ref(false)
const celebrating = ref(false)
const saving = ref(false)
const poster = ref('')
const saveError = ref('')
const imageFailed = ref(false)
let celebrationTimer

onMounted(() => {
  const page = standalonePages.find((item) => item.kind === 'autumn')
  document.title = page.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', page.description)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#102536')
})
onUnmounted(() => window.clearTimeout(celebrationTimer))

function receiveLetter() {
  received.value = true
  letter.value.close()
  celebrating.value = true
  window.clearTimeout(celebrationTimer)
  celebrationTimer = window.setTimeout(() => { celebrating.value = false }, 4200)
}

function closeOnBackdrop(event) {
  if (event.target !== event.currentTarget) return
  const bounds = event.currentTarget.getBoundingClientRect()
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
    event.currentTarget.close()
  }
}

async function createKeepsake() {
  if (saving.value) return
  if (poster.value) { keepsake.value.showModal(); return }
  saving.value = true
  saveError.value = ''
  try {
    await document.fonts.ready
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1440
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas unavailable')
    ctx.fillStyle = '#102536'
    ctx.fillRect(0, 0, 1080, 1440)
    const picture = new Image()
    picture.src = artwork
    try {
      await picture.decode()
      const scale = Math.max(1080 / picture.width, 880 / picture.height)
      const width = picture.width * scale
      ctx.drawImage(picture, 1080 - width, 0, width, picture.height * scale)
    } catch {
      // A failed illustration still produces a complete, readable greeting card.
      ctx.fillStyle = '#f7d796'
      ctx.beginPath(); ctx.arc(800, 170, 90, 0, Math.PI * 2); ctx.fill()
    }
    const shade = ctx.createLinearGradient(0, 350, 0, 890)
    shade.addColorStop(0, '#10253600'); shade.addColorStop(1, '#102536')
    ctx.fillStyle = shade; ctx.fillRect(0, 350, 1080, 540)
    const serif = '"Songti SC", "STSong", "SimSun", serif'
    ctx.fillStyle = '#fff3d9'
    ctx.font = `70px ${serif}`
    ctx.fillText('把月亮寄给你。', 85, 748)
    ctx.fillStyle = '#ecd2a5'
    ctx.font = '22px sans-serif'
    ctx.fillText('中 秋 · 国 庆  /  一 封 秋 日 来 信', 90, 810)
    ctx.fillStyle = '#f5eddd'; ctx.fillRect(0, 880, 1080, 560)
    ctx.fillStyle = '#4c524b'; ctx.font = `30px ${serif}`
    ctx.fillText('给屏幕前的你：', 90, 966)
    ctx.font = `38px ${serif}`
    ctx.fillText('愿这个假期，有人相见，也有闲暇。', 90, 1055)
    ctx.font = `28px ${serif}`
    ctx.fillText('出门的话，一路好风景；', 90, 1142)
    ctx.fillText('留在家的话，睡几个踏实的懒觉。', 90, 1194)
    ctx.fillStyle = '#8c6a4f'; ctx.font = `26px ${serif}`
    ctx.fillText('中秋快乐，国庆假期快乐。', 90, 1293)
    ctx.font = '20px sans-serif'
    ctx.fillText('晴屿 HARU ISLE', 90, 1370)
    ctx.textAlign = 'right'
    ctx.fillText('一个惦记你的朋友', 990, 1370)
    poster.value = canvas.toDataURL('image/png')
    keepsake.value.showModal()
  } catch {
    saveError.value = '纪念卡暂时没能生成，请再试一次。'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="autumn-page" :class="{ 'autumn-paused': paused }">
    <img v-if="!imageFailed" class="autumn-art" :src="artwork" alt="月光下的秋夜露台：桂花、茶与月饼，一只橘猫在椅子上熟睡，远处小城亮着灯。" fetchpriority="high" @error="imageFailed = true" />
    <div class="autumn-shade" aria-hidden="true"></div>
    <div class="autumn-border" aria-hidden="true"></div>
    <div class="autumn-petals" aria-hidden="true">
      <i v-for="i in 9" :key="i" :style="{ '--x': `${(i * 17) % 100}%`, '--delay': `${-i * 2.8}s`, '--duration': `${16 + i}s` }"></i>
    </div>

    <header class="autumn-header">
      <div class="autumn-brand"><span class="autumn-brand-icon" aria-hidden="true">☾</span><span>晴屿<small>HARU ISLE</small></span></div>
      <div class="autumn-edition"><span>中秋 · 国庆</span><small>一封秋日来信</small></div>
    </header>

    <main class="autumn-main">
      <div class="autumn-intro">
        <p class="autumn-eyebrow"><span></span> A LITTLE MOON, JUST FOR YOU</p>
        <h1 class="autumn-title">把月亮<br />寄给你<span>。</span></h1>
        <p class="autumn-subtitle">愿这个假期，<br class="autumn-mobile-break" />有人相见，也有闲暇。</p>
        <div class="autumn-invitation">
          <button class="autumn-envelope" type="button" aria-label="拆开给你的信" @click="letter.showModal()">
            <span class="envelope-paper" aria-hidden="true"><span class="envelope-to">TO YOU</span><span class="envelope-line"></span></span>
            <span class="envelope-fold" aria-hidden="true"></span>
            <span class="envelope-seal" aria-hidden="true">月</span>
          </button>
          <div class="autumn-invitation-copy">
            <p>{{ received ? '这份月光，已经属于你。' : '有一封给你的信' }}</p>
            <button class="autumn-text-button" type="button" @click="letter.showModal()">{{ received ? '再读一遍' : '轻轻拆开' }} <span aria-hidden="true">↗</span></button>
          </div>
        </div>
        <div class="autumn-save-area" v-if="received">
          <button class="autumn-save-link" type="button" :disabled="saving" @click="createKeepsake">{{ saving ? '正在装好这份月光…' : '保存一张秋日纪念卡 ↓' }}</button>
          <p class="autumn-error" role="status">{{ saveError }}</p>
        </div>
      </div>
    </main>

    <footer class="autumn-footer">
      <p><span class="autumn-footer-dot"></span>给屏幕前的你</p>
      <p class="autumn-footer-poem" aria-live="polite">{{ received ? '愿你所到之处，都有好风景。' : '无论相隔多远，今晚共享这一片月光。' }}</p>
      <button class="autumn-motion" type="button" :aria-pressed="paused" :aria-label="paused ? '播放飘花动效' : '暂停飘花动效'" @click="paused = !paused">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path v-if="paused" d="m7 5 8 5-8 5Z" stroke="currentColor" /><path v-else d="M7 5v10M13 5v10" stroke="currentColor" stroke-width="1.5" /></svg>
      </button>
    </footer>

    <div v-if="celebrating" class="autumn-fireworks" aria-hidden="true">
      <div v-for="burst in 3" :key="burst" class="autumn-burst" :style="{ '--burst': burst }"><i v-for="ray in 16" :key="ray" :style="{ '--angle': `${ray * 22.5}deg` }"></i></div>
    </div>

    <dialog ref="letter" class="autumn-letter" aria-labelledby="letter-heading" @click="closeOnBackdrop">
      <button class="autumn-close" type="button" aria-label="合上信件" @click="letter.close()">×</button>
      <div class="letter-topline"><span>晴屿来信</span><span>AUTUMN LETTER</span></div>
      <div class="letter-moon" aria-hidden="true">☾</div>
      <p class="letter-recipient">给屏幕前的你：</p>
      <h2 id="letter-heading">见字如晤，秋日安好。</h2>
      <div class="letter-body">
        <p>最近大家都忙，见面的次数少了。<br />好在还有节日，提醒我们问一句近况。</p>
        <p>借着这轮月亮，把祝福送到你身边。<br />中秋快乐，也祝你国庆假期快乐。</p>
        <p>出门的话，一路好风景；<br />留在家的话，睡几个踏实的懒觉。</p>
        <p>愿你有团聚的热闹，也有独处的自在。<br />等有空了，我们再一起吃饭。</p>
      </div>
      <div class="letter-signature"><span>一个惦记你的朋友</span><small>写于有月亮的秋天</small></div>
      <button class="letter-receive" type="button" @click="receiveLetter">收下这份祝福 <span aria-hidden="true">♡</span></button>
      <p class="letter-footnote">月光会替我，多陪你一会儿。</p>
    </dialog>

    <dialog ref="keepsake" class="autumn-keepsake" aria-labelledby="keepsake-heading" @click="closeOnBackdrop">
      <button class="autumn-close" type="button" aria-label="关闭纪念卡" @click="keepsake.close()">×</button>
      <h2 id="keepsake-heading">留住这一份月光</h2>
      <p>手机上可以长按图片保存</p>
      <img v-if="poster" :src="poster" alt="秋日纪念卡：把月亮寄给你，愿这个假期，有人相见，也有闲暇。一个惦记你的朋友。" />
      <a class="letter-receive" :href="poster" download="把月亮寄给你.png">下载纪念卡 ↓</a>
    </dialog>
  </div>
</template>

<style scoped>
.autumn-page{--cream:#f9edcf;--gold:#e4bf80;position:relative;isolation:isolate;min-height:800px;min-height:max(800px,100svh);display:flex;flex-direction:column;overflow:hidden;background:#102536;color:var(--cream)}
.autumn-art,.autumn-shade,.autumn-border,.autumn-petals{position:absolute;pointer-events:none}
.autumn-art{z-index:-4;inset:0;width:100%;height:100%;object-fit:cover;object-position:65% center}
.autumn-shade{z-index:-3;inset:0;background:linear-gradient(90deg,#091b2b73,transparent 67%),linear-gradient(0deg,#081824d9,transparent 26%,transparent 85%,#0b1e3033)}
.autumn-border{z-index:-1;inset:18px;border:1px solid #ebd3a526}
.autumn-header{display:flex;align-items:center;justify-content:space-between;padding:44px 5.5vw 0}
.autumn-brand{display:flex;gap:12px;align-items:center;font:23px var(--serif);letter-spacing:.18em}
.autumn-brand-icon{display:grid;place-items:center;font:35px var(--serif);width:43px;height:43px;border:1px solid #dfc89566;border-radius:50%;letter-spacing:0}
.autumn-brand small{display:block;font:8px sans-serif;letter-spacing:.25em;margin-top:7px;opacity:.65}
.autumn-edition{text-align:right;font-size:12px;letter-spacing:.22em}.autumn-edition small{display:block;font-size:10px;letter-spacing:.16em;margin-top:9px;opacity:.65}
.autumn-main{display:flex;align-items:center;flex:1;padding:48px 9vw 42px}
.autumn-intro{width:580px;max-width:100%;animation:autumn-arrive 1.2s ease-out both}
.autumn-eyebrow{display:flex;align-items:center;gap:13px;font-size:9px;letter-spacing:.24em;color:var(--gold);margin-bottom:29px}
.autumn-eyebrow span{height:1px;width:28px;background:var(--gold);opacity:.7}
.autumn-title{font:400 clamp(64px,6.6vw,102px)/1.35 var(--serif);letter-spacing:.09em;text-shadow:0 2px 28px #07162433;margin:0}
.autumn-title span{color:var(--gold);margin:0;letter-spacing:0}
.autumn-subtitle{font:17px/2 var(--serif);letter-spacing:.15em;margin-top:25px;color:#e3dfd3}
.autumn-mobile-break{display:none}
.autumn-invitation{display:flex;align-items:center;gap:28px;margin-top:42px}
.autumn-envelope{position:relative;width:154px;height:98px;flex-shrink:0;border:0;border-radius:3px;background:#e9d8b6;box-shadow:0 8px 32px #06121d66;transform:rotate(-7deg);cursor:pointer;transition:transform .3s,box-shadow .3s;padding:0}
.autumn-envelope:hover{transform:rotate(-3deg) translateY(-5px);box-shadow:0 13px 34px #06121d80}
.envelope-paper{position:absolute;inset:0;overflow:hidden;border:1px solid #b3956133;border-radius:3px;background:linear-gradient(145deg,#f6e8cf,#ddc8a0)}
.envelope-to{position:absolute;bottom:12px;left:12px;font:7px Georgia,serif;letter-spacing:.22em;color:#9a805e}.envelope-line{position:absolute;right:11px;bottom:15px;width:27px;height:1px;background:#ae937133}
.envelope-paper:before,.envelope-paper:after{content:'';position:absolute;top:24px;width:100px;height:100px;border:1px solid #baa17955;transform:rotate(42deg)}.envelope-paper:before{left:-56px}.envelope-paper:after{right:-56px;transform:rotate(-42deg)}
.envelope-fold{position:absolute;inset:0;clip-path:polygon(0 0,100% 0,50% 62%);background:linear-gradient(#f6e7cd,#e7d4b0);filter:drop-shadow(0 1px 1px #82705b)}
.envelope-seal{position:absolute;left:calc(50% - 16px);top:42px;display:grid;place-items:center;width:33px;height:33px;border:3px double #be735c;border-radius:50%;background:#994e3c;color:#e1b595;font:15px var(--serif);box-shadow:0 2px 5px #62422c55}
.autumn-invitation-copy p{font:14px var(--serif);letter-spacing:.08em;margin-bottom:14px}
.autumn-text-button,.autumn-save-link{background:none;border:0;padding:6px 0;color:var(--gold);font-size:11px;letter-spacing:.15em;cursor:pointer}.autumn-text-button span{margin-left:12px;font-size:16px}.autumn-text-button:hover,.autumn-save-link:hover{color:#fff4d6}
.autumn-save-area{margin-top:24px}.autumn-save-link{border-bottom:1px solid #d8be8055;padding-bottom:8px}.autumn-save-link:disabled{opacity:.65;cursor:wait}.autumn-error{font-size:12px;margin-top:8px}
.autumn-footer{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:0 5.5vw 37px;font-size:10px;letter-spacing:.15em;color:#ecdfc2b3}
.autumn-footer>p:first-child{display:flex;align-items:center;gap:10px}.autumn-footer-dot{width:4px;height:4px;border-radius:50%;background:#dbb275;box-shadow:0 0 8px #dbb27588}.autumn-footer-poem{font:12px var(--serif);letter-spacing:.12em}
.autumn-motion{width:42px;height:42px;border:1px solid #d4c39755;border-radius:50%;background:#11263855;display:grid;place-items:center;cursor:pointer}.autumn-motion svg{width:18px;height:18px}
.autumn-page button:focus-visible,.autumn-page a:focus-visible{outline:2px solid var(--gold);outline-offset:6px}
.autumn-petals{inset:0;z-index:-1;overflow:hidden}.autumn-petals i{position:absolute;top:-20px;left:var(--x);width:4px;height:7px;border-radius:70% 20% 65% 30%;background:#e8b46099;animation:autumn-fall var(--duration) var(--delay) linear infinite}
.autumn-paused *{animation-play-state:paused!important}
.autumn-fireworks{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:2}.autumn-burst{position:absolute;left:calc(45% + var(--burst)*12%);top:calc(45% - var(--burst)*7%)}.autumn-burst i{position:absolute;width:3px;height:3px;border-radius:50%;background:#ffcf82;opacity:0;box-shadow:0 0 6px #f3c87a;animation:autumn-spark 2.4s calc(var(--burst)*.35s) ease-out both;--reach:100px}
.autumn-letter,.autumn-keepsake{color:#424e47;border:1px solid #dfd2bb;background:#f8f0df;border-radius:5px;padding:42px 48px 26px;width:min(560px,calc(100% - 32px));max-height:calc(100svh - 40px);overflow:auto;box-shadow:0 30px 120px #040e1b88}
.autumn-letter[open],.autumn-keepsake[open]{animation:autumn-letter-in .4s ease-out}
.autumn-letter::backdrop,.autumn-keepsake::backdrop{background:#061625ad;backdrop-filter:blur(7px)}
.autumn-close{position:absolute;right:12px;top:10px;width:44px;height:44px;border:0;background:transparent;color:#7b786b;font:28px sans-serif;cursor:pointer}
.letter-topline{display:flex;justify-content:space-between;border-bottom:1px solid #c9b99b80;padding-bottom:17px;margin-right:12px;font-size:9px;letter-spacing:.15em;color:#928570}
.letter-moon{font:42px var(--serif);color:#b48b48;text-align:center;margin:17px 0 10px}.letter-recipient{font:14px var(--serif);letter-spacing:.06em}
.autumn-letter h2{font:400 25px/1.6 var(--serif);letter-spacing:.05em;margin:16px 0 20px}
.letter-body{font:15px/1.95 var(--serif);letter-spacing:.025em}.letter-body p+p{margin-top:17px}.letter-signature{text-align:right;font:14px/1.8 var(--serif);margin-top:23px}.letter-signature small{display:block;font-size:10px;color:#948b7d;margin-top:4px}
.letter-receive{display:flex;align-items:center;justify-content:center;gap:16px;width:100%;padding:14px 20px;margin-top:27px;border:1px solid #7b8c7b;border-radius:2px;background:#344d46;color:#f7ecd7;font-size:13px;letter-spacing:.12em;text-decoration:none;cursor:pointer}.letter-receive:hover{background:#263e38}.letter-receive span{font-size:17px}.letter-footnote{text-align:center;font-size:10px;color:#958c7a;margin-top:14px;letter-spacing:.1em}
.autumn-keepsake{text-align:center;padding:30px 24px 24px;width:min(460px,calc(100% - 32px))}.autumn-keepsake h2{font:400 23px var(--serif);margin:4px 0 12px}.autumn-keepsake p{font-size:12px;color:#817b70;margin-bottom:20px}.autumn-keepsake img{display:block;width:auto;max-width:100%;height:auto;max-height:60svh;margin:auto;box-shadow:0 4px 18px #64513326}.autumn-keepsake .letter-receive{margin-top:20px}
@keyframes autumn-arrive{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}
@keyframes autumn-fall{0%{transform:translate(0,-20px) rotate(0);opacity:0}10%{opacity:.65}90%{opacity:.4}100%{transform:translate(-150px,105vh) rotate(420deg);opacity:0}}
@keyframes autumn-letter-in{from{opacity:0;transform:translateY(20px) rotate(-1deg)}to{opacity:1;transform:translateY(0) rotate(0)}}
@keyframes autumn-spark{0%{opacity:0;transform:rotate(var(--angle)) translateY(0)}15%{opacity:1}100%{opacity:0;transform:rotate(var(--angle)) translateY(var(--reach))}}
@media(min-width:1700px){.autumn-main{padding-left:12vw}.autumn-header{padding-top:55px}.autumn-footer{padding-bottom:48px}}
@media(max-width:900px){.autumn-main{padding-left:7vw}.autumn-art{object-position:65% center}.autumn-shade{background:linear-gradient(90deg,#081c2b99,transparent 90%),linear-gradient(0deg,#081824d9,transparent 32%)}.autumn-title{font-size:76px}.autumn-footer-poem{font-size:10px}}
@media(max-width:600px){
  .autumn-page{min-height:max(800px,100svh)}.autumn-border{inset:10px}.autumn-header{padding:28px 27px 0}.autumn-brand{font-size:20px;gap:9px}.autumn-brand-icon{width:35px;height:35px;font-size:29px}.autumn-brand small{font-size:6px}.autumn-edition{font-size:10px}.autumn-edition small{font-size:9px}
  .autumn-art{object-position:73% center}.autumn-shade{background:linear-gradient(180deg,#091d3144,transparent 20%,#0a203596 39%,#091d30c9 65%,#091c2bdb)}
  .autumn-main{align-items:flex-start;padding:175px 34px 30px}.autumn-intro{width:100%}.autumn-eyebrow{font-size:8px;letter-spacing:.14em;gap:10px;margin-bottom:22px}.autumn-eyebrow span{width:18px}.autumn-title{font-size:62px;line-height:1.28;letter-spacing:.08em}.autumn-subtitle{font-size:15px;line-height:1.95;letter-spacing:.08em;margin-top:21px}.autumn-mobile-break{display:block}
  .autumn-invitation{margin-top:31px;gap:23px}.autumn-envelope{width:125px;height:81px}.envelope-seal{top:32px;width:30px;height:30px;font-size:13px;left:calc(50% - 15px)}.envelope-to{font-size:6px;bottom:10px}.autumn-invitation-copy p{font-size:12px;letter-spacing:.015em}.autumn-text-button{font-size:10px}.autumn-save-area{margin-top:20px}.autumn-save-link{font-size:11px}
  .autumn-footer{padding:15px 28px 27px;flex-wrap:wrap;gap:13px;font-size:9px}.autumn-footer-poem{order:3;width:100%;font-size:10px;letter-spacing:.05em}.autumn-motion{width:38px;height:38px}.autumn-burst{left:calc(12% + var(--burst)*20%);top:calc(31% - var(--burst)*4%)}.autumn-burst i{--reach:70px}
  .autumn-letter{padding:33px 25px 24px}.letter-topline{font-size:8px;margin-right:22px}.letter-moon{font-size:35px;margin:13px 0 8px}.autumn-letter h2{font-size:22px;margin:14px 0 17px}.letter-body{font-size:14px;line-height:1.95}.letter-body p+p{margin-top:15px}.letter-signature{font-size:13px}.letter-receive{margin-top:24px}
}
@media(max-width:360px){.autumn-main{padding-left:27px;padding-right:27px}.autumn-title{font-size:57px}.autumn-invitation{gap:17px}.autumn-envelope{width:115px}.autumn-letter{padding-left:21px;padding-right:21px}.letter-body{font-size:13px}}
@media(max-height:540px) and (min-width:601px){.autumn-page{min-height:540px}.autumn-header{padding-top:27px}.autumn-main{padding-top:25px;padding-bottom:25px}.autumn-title{font-size:56px;line-height:1.15}.autumn-eyebrow{margin-bottom:13px}.autumn-subtitle{margin-top:15px;font-size:14px}.autumn-invitation{margin-top:22px}.autumn-envelope{width:120px;height:77px}.envelope-seal{top:30px}.autumn-footer{padding-bottom:23px}}
@media(prefers-reduced-motion:reduce){.autumn-page *{animation:none!important;transition:none!important}.autumn-petals,.autumn-fireworks,.autumn-motion{display:none}}
</style>
