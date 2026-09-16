<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { dateKey, resolveScene, themeForTime } from './themes.js'

const route = resolveScene(window.location.pathname)
const now = ref(new Date())
const theme = computed(() => route.theme ?? themeForTime(now.value))
const date = computed(() => dateKey(now.value).replaceAll('-', '.'))
const weekday = computed(() => new Intl.DateTimeFormat('zh-CN', {
  weekday: 'long',
}).format(now.value))
const localTime = computed(() => new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
}).format(now.value))
const imageFailed = ref(false)
const paused = ref(false)
let timer
function updateDate() { now.value = new Date() }
function refreshOnVisible() { if (!document.hidden) updateDate() }

watch(theme, (value) => {
  imageFailed.value = false
  document.title = route.kind === 'missing' ? '未抵达的岛屿 · 晴屿' : `晴屿 · ${value.name}`
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value.color)
}, { immediate: true })

onMounted(() => {
  timer = window.setInterval(updateDate, 1000)
  document.addEventListener('visibilitychange', refreshOnVisible)
})
onUnmounted(() => {
  window.clearInterval(timer)
  document.removeEventListener('visibilitychange', refreshOnVisible)
})
</script>

<template>
  <div class="island" :class="[theme.id, { paused }]" :style="{ '--scene-position': theme.position }">
    <Transition name="scenery">
      <img v-if="!imageFailed" :key="theme.id" class="landscape" :src="`/themes/${theme.id}.webp?v=scene-subjects-2`"
        :alt="theme.alt" fetchpriority="high" decoding="async" @error="imageFailed = true" />
    </Transition>
    <div class="veil" aria-hidden="true"></div>
    <div class="atmosphere" aria-hidden="true">
      <span v-for="i in 12" :key="i" class="particle" :style="{
        '--i': i, '--x': `${(i * 29) % 100}%`, '--delay': `${-i * 2.7}s`,
      }"></span>
    </div>

    <header class="masthead">
      <div class="brand" aria-label="晴屿 HARU ISLE">
        <svg class="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="18.5" stroke="currentColor" stroke-opacity=".45" />
          <circle cx="25" cy="13" r="3" stroke="currentColor" />
          <path d="M8 25l8-10 8 10M19 25l5-6 8 6M8 29c4-3 7 3 12 0s8 2 12 0" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div><span class="brand-name">晴屿</span><span class="brand-subtitle">HARU ISLE</span></div>
      </div>
      <div class="date-stamp"><div class="calendar"><time :datetime="dateKey(now)">{{ date }}</time><span>{{ weekday }}</span></div><time class="local-clock" :datetime="now.toISOString()">当地时间 {{ localTime }}</time></div>
    </header>

    <main class="hero-copy" id="main">
      <p class="eyebrow">A LITTLE ISLAND OF YOUR OWN</p>
      <template v-if="route.kind !== 'missing'">
        <h1>晴<span>屿</span><i aria-hidden="true">。</i></h1>
        <div class="little-line" aria-hidden="true"></div>
        <p class="tagline" :key="theme.id">{{ theme.line }}</p>
        <p class="invitation">在这里，浪费一点美好的时间。</p>
      </template>
      <template v-else>
        <h1 class="missing-title">未抵达的岛屿</h1>
        <div class="little-line" aria-hidden="true"></div>
        <p class="tagline">这阵风，还没有吹向这里。</p>
        <p class="invitation">404 · 请确认你收到的地址</p>
      </template>
    </main>

    <footer class="shoreline">
      <div class="scene-label">
        <div class="scene-description">
          <p class="scene-kicker">{{ route.kind === 'scene' ? '此刻风景' : `${theme.period}风景` }}<span class="tiny-dot"></span>{{ theme.english }}</p>
          <p class="scene-name">{{ theme.name }}<span class="scene-divider">/</span><span class="scene-note">{{ theme.mood }}</span></p>
        </div>
      </div>
      <div class="shore-note"><span class="note-line" aria-hidden="true"></span><p>{{ theme.note }}</p><span class="tomorrow">{{ route.kind === 'live' ? '随你的当地时间，风景慢慢流转。' : '让这一刻，停留得久一点。' }}</span></div>
      <button class="motion-toggle" type="button" :aria-pressed="paused" :aria-label="paused ? '播放风景动效' : '暂停风景动效'" @click="paused = !paused">
        <svg v-if="!paused" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4v8M10 4v8" stroke="currentColor" stroke-width="1.5" /></svg>
        <svg v-else viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 4 6 4-6 4V4Z" stroke="currentColor" stroke-linejoin="round" /></svg>
      </button>
    </footer>
    <div class="frame" aria-hidden="true"></div>
  </div>
</template>
