// js/animations/introAnimation.js
/**
 * Intro 頁面的動畫邏輯
 * 包含按鈕文字爆炸效果和頁面退場動畫
 */

/**
 * 創建文字爆炸效果
 * @param {HTMLElement} button - 按鈕元素
 * @param {HTMLElement} particlesContainer - 粒子容器
 * @returns {Promise} 動畫完成的 Promise
 */
export function createTextExplosion(button, particlesContainer) {
    return new Promise(resolve => {
        const buttonText = button.querySelector('.intro__start-text');
        const text = buttonText.textContent;
        const buttonRect = button.getBoundingClientRect();
        const centerX = buttonRect.left + buttonRect.width / 2;
        const centerY = buttonRect.top + buttonRect.height / 2;
        
        // 隱藏原始文字
        buttonText.style.opacity = '0';
        
        // 將文字分解為單個字符
        const characters = text.split('');
        const particles = [];
        
        // 為每個字符創建粒子
        characters.forEach((char, index) => {
            const particle = document.createElement('span');
            particle.className = 'particle';
            particle.textContent = char;
            
            // 設定初始位置（按鈕中心）
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            
            // 計算隨機的爆炸方向和距離
            const angle = (Math.PI * 2 * index) / characters.length + (Math.random() - 0.5) * 0.5;
            const distance = 200 + Math.random() * 300; // 200-500px 的距離
            const deltaX = Math.cos(angle) * distance;
            const deltaY = Math.sin(angle) * distance;
            const rotation = Math.random() * 720 - 360; // -360 到 360 度
            
            // 設定 CSS 變數供動畫使用
            particle.style.setProperty('--particle-x', `${deltaX}px`);
            particle.style.setProperty('--particle-y', `${deltaY}px`);
            particle.style.setProperty('--particle-rotate', `${rotation}deg`);
            
            // 添加隨機延遲，產生更自然的爆炸效果
            particle.style.animationDelay = `${Math.random() * 0.1}s`;
            
            particlesContainer.appendChild(particle);
            particles.push(particle);
        });
        
        // 清理粒子
        setTimeout(() => {
            particles.forEach(particle => particle.remove());
            resolve();
        }, 1500);
    });
}

/**
 * 執行按鈕放大模糊效果
 * @param {HTMLElement} button - 按鈕元素
 * @returns {Promise} 動畫完成的 Promise
 */
export function buttonScaleBlur(button) {
    return new Promise(resolve => {
        button.style.transition = `transform 1s cubic-bezier(0.4, 0, 0.2, 1),
                                  filter 1s cubic-bezier(0.4, 0, 0.2, 1),
                                  opacity 1s cubic-bezier(0.4, 0, 0.2, 1)`;
        
        requestAnimationFrame(() => {
            button.style.transform = 'scale(2)';
            button.style.filter = 'blur(20px)';
            button.style.opacity = '0';
        });
        
        setTimeout(resolve, 1000);
    });
}

/**
 * 執行頁面退場動畫
 * @param {HTMLElement} introSection - Intro 頁面元素
 * @returns {Promise} 動畫完成的 Promise
 */
export function pageExitAnimation(introSection) {
    return new Promise(resolve => {
        introSection.classList.add('intro--exiting');
        
        // 監聽動畫完成
        introSection.addEventListener('animationend', function handler() {
            introSection.removeEventListener('animationend', handler);
            introSection.classList.remove('intro--exiting');
            resolve();
        });
    });
}

/**
 * 執行完整的 Intro 退場序列
 * @param {Object} elements - DOM 元素集合
 * @returns {Promise} 動畫完成的 Promise
 */
export async function runIntroExitSequence(elements) {
    const { button, particlesContainer, introSection } = elements;
    
    // 1. 文字爆炸效果
    await createTextExplosion(button, particlesContainer);
    
    // 2. 按鈕放大模糊（與頁面退場同時進行）
    await Promise.all([
        buttonScaleBlur(button),
        pageExitAnimation(introSection)
    ]);
    
    return true;
}