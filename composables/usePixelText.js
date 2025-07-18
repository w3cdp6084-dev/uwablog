// ピクセルテキストレンダリングシステム
import { onMounted, onUpdated } from 'vue'

// ピクセルフォント設定
const FONT_CONFIG = {
  height: 5,
  unitWidth: 3,
  charToKey: {
    '*': 'asterisk',
    '!': 'bang',
    ':': 'colon',
    ',': 'comma',
    '.': 'dot',
    '-': 'hyphen',
    '_': 'underscore',
    '/': 'slash',
    '#': 'sharp',
    '+': 'plus',
    '?': 'question',
    '>': 'gt',
    '<': 'lt',
    '(': 'lparen',
    ')': 'rparen'
  }
}

// 簡易的なピクセルテキストレンダラー
class PixelTextRenderer {
  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  createPixelText(text, options = {}) {
    const scale = options.scale || 1
    const trailing = options.trailing || 0
    
    // テキストサイズを計算
    const width = this.calculateTextWidth(text)
    const height = FONT_CONFIG.height
    
    // Canvas設定
    const dpr = window.devicePixelRatio
    this.canvas.width = (width + trailing) * scale * dpr
    this.canvas.height = height * scale * dpr
    
    // ピクセルフォントをシミュレート（実際にはマスク画像を使用）
    const maskUrl = this.createMaskImage()
    
    // DOM要素を作成
    const elem = document.createElement('div')
    elem.classList.add('pxtx', 'pxtx-rendered')
    elem.dataset.imageWidth = `${this.canvas.width}`
    elem.style.maskImage = `url(${maskUrl})`
    elem.style.webkitMaskImage = `url(${maskUrl})`
    elem.style.height = `calc(${height}px * var(--px-scale))`
    elem.style.width = `calc(${width}px * var(--px-scale))`
    elem.textContent = text
    
    return elem
  }

  calculateTextWidth(text) {
    let width = 0
    for (const char of text.toLowerCase()) {
      const key = FONT_CONFIG.charToKey[char] || char
      if (key === ' ') {
        width += FONT_CONFIG.unitWidth + 1
      } else if (key === '\n') {
        // 改行処理
        width = 0
      } else {
        // 通常文字（簡易計算）
        width += FONT_CONFIG.unitWidth + 1
      }
    }
    return Math.max(width - 1, 0)
  }

  createMaskImage() {
    // Base64エンコードされたマスク画像
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAFCAYAAACAcVaiAAAAGklEQVQIHWNgYGD4z8DAwMDAxAADTEwMAAALBAEAqM8W8wAAAABJRU5ErkJggg=='
  }
}

// ピクセルテキストをレンダリング
function renderPixelTexts(container) {
  const renderer = new PixelTextRenderer()
  
  container.querySelectorAll('.pxtx:not(.pxtx-rendered)').forEach(elem => {
    const text = elem.textContent || ''
    const scale = parseInt(getComputedStyle(elem).getPropertyValue('--px-scale')) || 1
    const trailing = parseInt(getComputedStyle(elem).getPropertyValue('--px-trailing')) || 0
    
    const pixelText = renderer.createPixelText(text, { scale, trailing })
    elem.parentElement?.replaceChild(pixelText, elem)
  })
}

// Vue Composable
export const usePixelText = () => {
  const initPixelText = (container = document) => {
    renderPixelTexts(container)
  }

  onMounted(() => {
    initPixelText()
  })

  onUpdated(() => {
    initPixelText()
  })

  return {
    initPixelText,
    renderPixelTexts
  }
}