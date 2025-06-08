// js/animations/introAnimation.js
/**
 * Intro 頁面的動畫邏輯
 * 現在主要負責頁面整體的退場動畫
 */

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
    // 按鈕的噴濺動畫現在由點擊事件直接觸發
    // 這裡只負責處理整個頁面的過渡
    await pageExitAnimation(elements.introSection);
    return true;
}