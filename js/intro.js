// js/intro.js
/**
 * Intro 頁面邏輯
 * 負責 SVG 標題載入和互動處理
 */

import { loadSVG } from './utils/svgLoader.js';
import { runIntroExitSequence } from './animations/introAnimation.js';
import { createButtonExplosion } from './utils/animations.js';

// 儲存元素引用
let elements = {};
let isAnimating = false;

/**
 * 載入並顯示 SVG 標題
 * @param {HTMLElement} titleContainer - 標題容器
 */
async function loadIntroTitle(titleContainer) {
    try {
        const svg = await loadSVG(
            'assets/svg/logo-amour-oracle.svg',
            titleContainer,
            {
                className: 'intro__title-logo',
                attributes: {
                    'viewBox': '0 0 850.82 574.25',
                    'preserveAspectRatio': 'xMidYMid meet'
                }
            }
        );
        
        // 為 SVG 路徑添加淡入效果
        const paths = svg.querySelectorAll('path');
        paths.forEach((path, index) => {
            path.style.animationDelay = `${index * 0.05}s`;
        });
        
        return svg;
    } catch (error) {
        console.error('Failed to load intro title:', error);
        // 如果載入失敗，顯示文字版本
        titleContainer.innerHTML = '<span style="color: var(--color-accent);">字裡行間的愛情智慧</span>';
    }
}

/**
 * 處理開始按鈕點擊
 * @param {Function} onComplete - 完成回調
 */
async function handleStartClick(onComplete) {
    if (isAnimating) return;
    isAnimating = true;
    
    try {
        // 禁用按鈕避免重複點擊
        elements.startBtn.disabled = true;
        
        // 只執行按鈕爆炸效果
        await createButtonExplosion(elements.startBtn);
        
        // 動畫開始後，稍微延遲一點再觸發頁面切換，讓效果更自然
        setTimeout(() => {
            if (onComplete) {
                onComplete();
            }
        }, 200); // 延遲 200ms

    } catch (error) {
        console.error('Intro start process failed:', error);
        // 即使動畫失敗也要繼續
        if (onComplete) {
            onComplete();
        }
    } finally {
        // isAnimating 和按鈕狀態會在頁面切換後由流程控制
    }
}

/**
 * 初始化 Intro 頁面
 * @param {Object} domElements - DOM 元素集合
 * @param {Function} onStartClick - 開始按鈕點擊回調
 */
export async function initIntro(domElements, onStartClick) {
    // 儲存元素引用
    elements = {
        intro: document.getElementById('intro'),
        title: domElements.title,
        startBtn: domElements.startBtn
    };
    
    // 載入 SVG 標題
    await loadIntroTitle(elements.title);
    
    // 設定事件監聽器
    elements.startBtn.addEventListener('click', () => {
        handleStartClick(onStartClick);
    });
    
    // 設定頁面進入函數
    window.introPageEnter = () => {
        // 重置按鈕狀態
        isAnimating = false;
        elements.startBtn.disabled = false;
        elements.startBtn.classList.remove('is-exploding');
        // 確保按鈕文字可見
        const startText = elements.startBtn.querySelector('.intro__start-text');
        if(startText) {
             startText.style.color = 'white';
        } else {
             elements.startBtn.style.color = 'white';
        }
        elements.startBtn.style.opacity = '1';
        elements.startBtn.style.transform = '';
    };
}

/**
 * 清理 Intro 頁面
 */
export function cleanupIntro() {
    // 移除事件監聽器
    if (elements.startBtn) {
        // 複製並替換節點以清除所有監聽器
        const newBtn = elements.startBtn.cloneNode(true);
        elements.startBtn.parentNode.replaceChild(newBtn, elements.startBtn);
        elements.startBtn = newBtn;
    }
    
    // 清除全域函數
    delete window.introPageEnter;
}