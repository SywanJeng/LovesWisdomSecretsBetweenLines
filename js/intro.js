// js/intro.js
/**
 * Intro 頁面邏輯
 * 負責 SVG 標題載入和互動處理
 */

import { loadSVG } from './utils/svgLoader.js';
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
function handleStartClick(onComplete) {
    if (isAnimating) return;
    isAnimating = true;

    try {
        // 禁用按鈕避免重複點擊
        elements.startBtn.disabled = true;
        elements.startBtn.style.pointerEvents = 'none';

        // 觸發按鈕爆炸效果
        createButtonExplosion(elements.startBtn);
        elements.startBtn.classList.add('is-exploding');

        // 開始淡出 Intro 頁面
        elements.intro.classList.add('intro--exiting');

        // 動畫結束後觸發頁面切換
        // 【修正】將 'transitionend' 改為 'animationend'
        const onAnimationEnd = () => {
            elements.intro.removeEventListener('animationend', onAnimationEnd);
            if (onComplete) {
                onComplete();
            }
        };
        elements.intro.addEventListener('animationend', onAnimationEnd);

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
        elements.startBtn.style.pointerEvents = 'auto';
        elements.intro.classList.remove('intro--exiting');
        elements.intro.style.opacity = '1'; // 確保再次進入時可見
    };
}

/**
 * 清理 Intro 頁面
 */
export function cleanupIntro() {
    // 移除事件監聽器
    if (elements.startBtn) {
        const newBtn = elements.startBtn.cloneNode(true);
        elements.startBtn.parentNode.replaceChild(newBtn, elements.startBtn);
        elements.startBtn = newBtn;
    }

    // 清除全域函數
    delete window.introPageEnter;
}