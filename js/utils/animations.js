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
 * @param {number} delay - 每個字的延遲（毫秒）
 * @returns {Promise} 動畫完成的 Promise
 */
export function typeText(element, text, delay = 50) {
    return new Promise(resolve => {
        element.textContent = '';
        const chars = text.split('');
        let index = 0;
        
        const timer = setInterval(() => {
            if (index < chars.length) {
                element.textContent += chars[index];
                index++;
            } else {
                clearInterval(timer);
                resolve();
            }
        }, delay);
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