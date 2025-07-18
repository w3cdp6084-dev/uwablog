// Bouncyクラス - ホバー状態管理
class Bouncy {
  constructor(elem) {
    this.focused_ = false;
    this.hovered_ = false;
    this.elem_ = elem;
  }

  get focusElement() {
    return this.elem_;
  }

  get focused() { 
    return this.focused_; 
  }
  
  set focused(value) {
    this.focused_ = value;
    this.applyActive_();
  }

  get hovered() { 
    return this.hovered_; 
  }
  
  set hovered(value) {
    this.hovered_ = value;
    this.applyActive_();
  }

  applyActive_() {
    if (this.focused || this.hovered) {
      this.elem_.classList.add('bouncy-active');
    } else {
      this.elem_.classList.remove('bouncy-active');
    }
  }
}

// タッチデバイス検出
function hasHover() {
  return window.matchMedia('(hover: hover)').matches;
}

// Vue Composable
export const useBouncy = () => {
  const bouncyInstances = [];
  
  const initBouncy = (container = document) => {
    // 既存のインスタンスをクリーンアップ
    const existingElements = Array.from(container.querySelectorAll('.bouncy'));
    const newInstances = [];
    
    existingElements.forEach(elem => {
      // 既にインスタンス化されているかチェック
      if (!elem.dataset.bouncyInit) {
        const bouncy = new Bouncy(elem);
        elem.dataset.bouncyInit = 'true';
        
        // ホバーサポートデバイスのみ
        if (hasHover()) {
          elem.addEventListener('mouseenter', () => {
            bouncy.hovered = true;
          });
          
          elem.addEventListener('mouseleave', () => {
            bouncy.hovered = false;
          });
          
          elem.addEventListener('pointermove', () => {
            if (!bouncy.hovered) {
              bouncy.hovered = true;
            }
          });
        }
        
        // フォーカスイベント（全デバイス）
        elem.addEventListener('focus', () => {
          bouncy.focused = true;
        });
        
        elem.addEventListener('blur', () => {
          bouncy.focused = false;
        });
        
        newInstances.push(bouncy);
      }
    });
    
    bouncyInstances.push(...newInstances);
    return newInstances;
  };
  
  // Safari検出
  const checkSafari = () => {
    if (typeof window !== 'undefined') {
      const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|chromium/i.test(navigator.userAgent);
      if (isSafari) {
        document.body.classList.add('safari');
      }
      
      // タッチデバイス検出
      if (!hasHover()) {
        document.body.classList.add('touch');
      }
    }
  };
  
  return {
    initBouncy,
    checkSafari,
    hasHover
  };
};