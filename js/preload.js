// js/preload.js
/**
 * Preload 頁面邏輯
 * 負責資源預載入和動畫執行
 */

import { loadSVG } from './utils/svgLoader.js';
import { runPreloadAnimation } from './animations/preloadAnimation.js';

// 需要預載入的資源清單
const RESOURCES = {
    images: [
        'assets/images/intro-background.webp',
        'assets/images/question-bg-1.webp',
        'assets/images/question-bg-2.webp',
        'assets/images/question-bg-3.webp',
        'assets/images/question-bg-4.webp',
        'assets/images/question-bg-5.webp',
        'assets/images/question-bg-6.webp',
        'assets/images/question-bg-7.webp',
        'assets/images/question-bg-8.webp',
        'assets/images/question-bg-9.webp',
        'assets/images/question-bg-10.webp',
        'assets/images/question-bg-11.webp',
    ],
    fonts: [
        // Google Fonts 會自動載入，但我們可以預先觸發
        'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap'
    ]
};

/**
 * 預載入圖片
 * @param {string} url - 圖片 URL
 * @returns {Promise} 載入完成的 Promise
 */
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
    });
}

/**
 * 預載入所有資源
 * @param {Function} onProgress - 進度回調函數
 * @returns {Promise} 所有資源載入完成的 Promise
 */
async function preloadResources(onProgress) {
    const totalResources = RESOURCES.images.length;
    let loadedCount = 0;
    
    // 載入所有圖片
    const imagePromises = RESOURCES.images.map(async (url) => {
        try {
            await preloadImage(url);
            loadedCount++;
            
            // 計算進度百分比
            const progress = Math.round((loadedCount / totalResources) * 100);
            if (onProgress) {
                onProgress(progress, loadedCount, totalResources);
            }
        } catch (error) {
            console.warn(`Failed to preload image: ${url}`, error);
            // 即使單個圖片載入失敗，也繼續執行
            loadedCount++;
        }
    });
    
    await Promise.all(imagePromises);
}

/**
 * 更新載入進度文字
 * @param {HTMLElement} progressElement - 進度文字元素
 * @param {number} progress - 進度百分比
 */
function updateProgressText(progressElement, progress) {
    if (progressElement) {
        progressElement.textContent = `載入中... ${progress}%`;
    }
}

/**
 * 初始化 Preload 頁面
 * @param {Object} elements - DOM 元素集合
 * @param {Function} onComplete - 完成回調函數
 */
export async function initPreload(elements, onComplete) {
    try {
        // 1. 載入 SVG Logo
        const logoWrapper = elements.logo?.parentElement;
        if (!logoWrapper) {
            throw new Error('Logo wrapper not found');
        }
        
        const svg = await loadSVG(
            'assets/svg/logo-amour-oracle.svg',
            logoWrapper,
            {
                className: 'preload__logo',
                attributes: {
                    'width': '200',
                    'height': '200',
                    'viewBox': '0 0 850.82 574.25'
                }
            }
        );
        
        // 2. 開始預載入資源和動畫（同時進行）
        const [animationComplete, resourcesComplete] = await Promise.all([
            // 執行 SVG 動畫
            runPreloadAnimation(svg),
            
            // 預載入資源
            preloadResources((progress) => {
                updateProgressText(elements.progressText, progress);
            })
        ]);
        
        // 3. 動畫和資源載入都完成後，觸發完成回調
        if (onComplete) {
            onComplete();
        }
        
    } catch (error) {
        console.error('Preload initialization failed:', error);
        
        // 即使出錯也要繼續，避免使用者卡在載入頁面
        if (onComplete) {
            setTimeout(onComplete, 1000);
        }
    }
}

/**
 * 手動觸發 Preload 完成
 * （用於開發測試）
 */
export function skipPreload() {
    const event = new CustomEvent('preloadComplete');
    document.dispatchEvent(event);
}

// 開發模式下的快捷鍵
if (window.location.hostname === 'localhost') {
    document.addEventListener('keydown', (e) => {
        // 按下 S 鍵跳過預載入
        if (e.key === 's' || e.key === 'S') {
            console.log('Skipping preload...');
            skipPreload();
        }
    });
}