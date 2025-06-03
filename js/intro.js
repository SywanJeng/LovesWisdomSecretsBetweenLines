// js/intro.js
/**
 * Intro 頁面邏輯
 * 負責 SVG 標題載入和互動處理
 */

import { loadSVG } from './utils/svgLoader.js';
import { runIntroExitSequence } from './animations/introAnimation.js';

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
        
        // 執行退場動畫序列
        await runIntroExitSequence({
            button: elements.startBtn,
            particlesContainer: elements.particles,
            introSection: elements.intro
        });
        
        // 觸發完成回調
        if (onComplete) {
            onComplete();
        }
    } catch (error) {
        console.error('Intro exit animation failed:', error);
        // 即使動畫失敗也要繼續
        if (onComplete) {
            onComplete();
        }
    } finally {
        isAnimating = false;
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
        startBtn: domElements.startBtn,
        particles: document.querySelector('.intro__particles')
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
        elements.startBtn.disabled = false;
        elements.startBtn.style.transform = '';
        elements.startBtn.style.filter = '';
        elements.startBtn.style.opacity = '';
        
        // 重置按鈕文字
        const buttonText = elements.startBtn.querySelector('.intro__start-text');
        if (buttonText) {
            buttonText.style.opacity = '1';
        }
    };
}

/**
 * 清理 Intro 頁面
 */
export function cleanupIntro() {
    // 移除事件監聽器
    if (elements.startBtn) {
        elements.startBtn.removeEventListener('click', handleStartClick);
    }
    
    // 清除全域函數
    delete window.introPageEnter;
}