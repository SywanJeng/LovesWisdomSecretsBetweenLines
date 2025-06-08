// js/utils/animations.js
/**
 * 通用動畫函數模組
 * 提供可重用的動畫效果
 */

/**
 * 淡入效果
 * @param {HTMLElement} element - 目標元素
 * @param {number} duration - 動畫時長（毫秒）
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {Promise} 動畫完成的 Promise
 */
export function fadeIn(element, duration = 300, delay = 0) {
    return new Promise(resolve => {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            
            element.addEventListener('transitionend', function handler() {
                element.removeEventListener('transitionend', handler);
                resolve();
            });
        }, delay);
    });
}

/**
 * 淡出效果
 * @param {HTMLElement} element - 目標元素
 * @param {number} duration - 動畫時長（毫秒）
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {Promise} 動畫完成的 Promise
 */
export function fadeOut(element, duration = 300, delay = 0) {
    return new Promise(resolve => {
        element.style.transition = `opacity ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.opacity = '0';
            
            element.addEventListener('transitionend', function handler() {
                element.removeEventListener('transitionend', handler);
                resolve();
            });
        }, delay);
    });
}

/**
 * 淡入並向上移動
 * @param {HTMLElement} element - 目標元素
 * @param {number} distance - 移動距離（像素）
 * @param {number} duration - 動畫時長（毫秒）
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {Promise} 動畫完成的 Promise
 */
export function fadeInUp(element, distance = 20, duration = 500, delay = 0) {
    return new Promise(resolve => {
        element.style.opacity = '0';
        element.style.transform = `translateY(${distance}px)`;
        element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            element.addEventListener('transitionend', function handler(e) {
                if (e.propertyName === 'opacity') {
                    element.removeEventListener('transitionend', handler);
                    resolve();
                }
            });
        }, delay);
    });
}

/**
 * 淡入並向下移動
 * @param {HTMLElement} element - 目標元素
 * @param {number} distance - 移動距離（像素）
 * @param {number} duration - 動畫時長（毫秒）
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {Promise} 動畫完成的 Promise
 */
export function fadeInDown(element, distance = 20, duration = 500, delay = 0) {
    return new Promise(resolve => {
        element.style.opacity = '0';
        element.style.transform = `translateY(-${distance}px)`;
        element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            element.addEventListener('transitionend', function handler(e) {
                if (e.propertyName === 'opacity') {
                    element.removeEventListener('transitionend', handler);
                    resolve();
                }
            });
        }, delay);
    });
}

/**
 * 縮放淡入
 * @param {HTMLElement} element - 目標元素
 * @param {number} startScale - 起始縮放比例
 * @param {number} duration - 動畫時長（毫秒）
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {Promise} 動畫完成的 Promise
 */
export function scaleIn(element, startScale = 0.8, duration = 500, delay = 0) {
    return new Promise(resolve => {
        element.style.opacity = '0';
        element.style.transform = `scale(${startScale})`;
        element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
            
            element.addEventListener('transitionend', function handler(e) {
                if (e.propertyName === 'transform') {
                    element.removeEventListener('transitionend', handler);
                    resolve();
                }
            });
        }, delay);
    });
}

/**
 * 搖晃效果
 * @param {HTMLElement} element - 目標元素
 * @param {number} intensity - 搖晃強度（像素）
 * @param {number} duration - 動畫時長（毫秒）
 * @returns {Promise} 動畫完成的 Promise
 */
export function shake(element, intensity = 10, duration = 500) {
    return new Promise(resolve => {
        const keyframes = [
            { transform: 'translateX(0)' },
            { transform: `translateX(-${intensity}px)` },
            { transform: `translateX(${intensity}px)` },
            { transform: `translateX(-${intensity / 2}px)` },
            { transform: `translateX(${intensity / 2}px)` },
            { transform: 'translateX(0)' }
        ];
        
        const animation = element.animate(keyframes, {
            duration: duration,
            easing: 'ease-out'
        });
        
        animation.onfinish = resolve;
    });
}

/**
 * 脈動效果
 * @param {HTMLElement} element - 目標元素
 * @param {number} scale - 最大縮放比例
 * @param {number} duration - 動畫時長（毫秒）
 * @returns {Animation} 動畫對象（可用於停止）
 */
export function pulse(element, scale = 1.05, duration = 1000) {
    const keyframes = [
        { transform: 'scale(1)' },
        { transform: `scale(${scale})` },
        { transform: 'scale(1)' }
    ];
    
    return element.animate(keyframes, {
        duration: duration,
        easing: 'ease-in-out',
        iterations: Infinity
    });
}

/**
 * 文字逐字顯示
 * @param {HTMLElement} element - 目標元素
 * @param {string} text - 要顯示的文字
 * @param {Object} options - 選項
 * @param {number} options.speed - 每個字的延遲（毫秒），預設 50
 * @param {boolean} options.cursor - 是否顯示游標，預設 true
 * @param {string} options.cursorChar - 游標字符，預設 '|'
 * @param {string} options.cursorClassName - 游標 CSS class，預設 'typing-cursor'
 * @returns {Object} 包含 start 和 stop 方法的控制器
 */
export function typeText(element, text, options = {}) {
    const defaults = {
        speed: 50,
        cursor: true,
        cursorChar: '|',
        cursorClassName: 'typing-cursor',
    };
    const settings = { ...defaults, ...options };

    let timerId = null;
    let charIndex = 0;
    let cursorElement = null;
    let animationPromise = null;
    let resolvePromise = null;

    function typeCharacter() {
        if (charIndex < text.length) {
            const char = text.charAt(charIndex);
            // Insert char before cursor if cursor exists
            if (cursorElement) {
                element.insertBefore(document.createTextNode(char), cursorElement);
            } else {
                element.appendChild(document.createTextNode(char));
            }
            charIndex++;
            // Speed up for punctuation
            const delay = /[，。？！]/.test(char) ? settings.speed * 3 : settings.speed;
            timerId = setTimeout(typeCharacter, delay);
        } else {
            if (cursorElement) {
                // Keep cursor blinking for a bit, then remove
                setTimeout(() => {
                    if (cursorElement) cursorElement.remove();
                    cursorElement = null;
                    if (resolvePromise) resolvePromise();
                }, 500);
            } else {
                 if (resolvePromise) resolvePromise();
            }
        }
    }

    function start() {
        animationPromise = new Promise(resolve => {
            resolvePromise = resolve;
            element.textContent = ''; // Clear previous content
            charIndex = 0;

            if (settings.cursor) {
                cursorElement = document.createElement('span');
                cursorElement.className = settings.cursorClassName;
                cursorElement.textContent = settings.cursorChar;
                element.appendChild(cursorElement);
            }
            typeCharacter();
        });
        return animationPromise;
    }

    function stop() {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
        element.textContent = text; // Display full text
        if (cursorElement) {
            cursorElement.remove();
            cursorElement = null;
        }
        if (resolvePromise) {
            // Resolve if not already resolved, indicating completion (or interruption)
            resolvePromise();
        }
    }

    return {
        start,
        stop,
    };
}

/**
 * 按鈕文字噴濺效果（全新強化版 - V3 - 原地爆炸）
 * @param {HTMLElement} button - 目標按鈕元素
 * @returns {Promise} 動畫完成的 Promise
 */
export function createButtonExplosion(button) {
    return new Promise(resolve => {
        const originalText = button.textContent;
        const characters = originalText.split('');
        
        // 1. 為了測量，將每個字元用 span 包起來
        button.innerHTML = characters.map(char =>
            // 使用相對定位，以便 getBoundingClientRect 能夠準確工作
            `<span class="exploding-char" style="display: inline-block;">${char}</span>`
        ).join('');

        // 2. 確保瀏覽器已渲染新的 span，然後獲取它們的位置
        requestAnimationFrame(() => {
            const charSpans = button.querySelectorAll('.exploding-char');
            const positions = Array.from(charSpans).map(span => span.getBoundingClientRect());

            // 3. 隱藏原始按鈕的文字（現在是 span），並觸發按鈕背景的淡出
            button.style.color = 'transparent';
            button.style.textShadow = 'none';
            button.classList.add('is-exploding');

            // 4. 根據測量好的位置，創建粒子
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'particles-container';
            document.body.appendChild(particlesContainer);

            characters.forEach((char, index) => {
                if (char.trim() === '') return;

                const pos = positions[index];
                if (!pos) return;

                const particle = document.createElement('span');
                particle.className = 'particle';
                particle.textContent = char;

                // 將粒子的初始位置設定為對應字元的精確位置
                particle.style.left = `${pos.left}px`;
                particle.style.top = `${pos.top}px`;
                
                // 計算隨機的爆炸方向和距離
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * (window.innerWidth / 3) + (window.innerWidth / 6);
                const deltaX = Math.cos(angle) * distance;
                const deltaY = Math.sin(angle) * distance;
                const rotation = Math.random() * 720 - 360;
                
                // 將這些值傳遞給 CSS 動畫
                particle.style.setProperty('--particle-x', `${deltaX}px`);
                particle.style.setProperty('--particle-y', `${deltaY}px`);
                particle.style.setProperty('--particle-rotate', `${rotation}deg`);

                particlesContainer.appendChild(particle);
            });

            // 5. 動畫結束後進行清理
            setTimeout(() => {
                particlesContainer.remove();
                // 為了讓按鈕可以重用（例如重新測驗），我們恢復它的原始狀態
                if (button) {
                    button.innerHTML = originalText;
                    button.style.color = '';
                    button.style.textShadow = '';
                }
                resolve();
            }, 1500); // 動畫時長為 1.5s
        });
    });
}

/**
 * 並行執行多個動畫
 * @param {...Function} animations - 動畫函數列表
 * @returns {Promise} 所有動畫完成的 Promise
 */
export function parallel(...animations) {
    return Promise.all(animations.map(fn => fn()));
}

/**
 * 序列執行多個動畫
 * @param {...Function} animations - 動畫函數列表
 * @returns {Promise} 所有動畫完成的 Promise
 */
export async function sequence(...animations) {
    for (const animation of animations) {
        await animation();
    }
}

/**
 * 創建動畫序列控制器
 * @returns {Object} 動畫控制器
 */
export function createAnimationQueue() {
    const queue = [];
    let isPlaying = false;
    
    return {
        add(animationFn, delay = 0) {
            queue.push({ fn: animationFn, delay });
            return this;
        },
        
        async play() {
            if (isPlaying) return;
            isPlaying = true;
            
            for (const { fn, delay } of queue) {
                if (delay > 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                await fn();
            }
            
            isPlaying = false;
            queue.length = 0;
        },
        
        clear() {
            queue.length = 0;
            isPlaying = false;
        }
    };
}