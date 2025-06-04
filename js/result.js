// js/result.js
/**
 * Result 頁面邏輯
 * 負責顯示測驗結果
 */

import { quizResults } from './data/quizContent.js';

// 特質名稱對應
const TRAIT_NAMES = {
    A: '思辨抽離',
    B: '情感共鳴',
    C: '人文觀察',
    D: '自我敘事',
    E: '即興演出'
};

// 儲存元素引用
let elements = {};

/**
 * 顯示結果內容
 * @param {Object} result - 結果對象
 * @param {Object} domElements - DOM 元素集合
 */
function displayResultContent(result, domElements) {
    // 更新標題和副標題
    domElements.title.textContent = result.title;
    domElements.subtitle.textContent = result.subtitle;
    
    // 更新描述（支援多段落）
    domElements.description.innerHTML = result.description
        .split('\n\n')
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');
    
    // 顯示特質圖表
    displayTraitsChart(result.bookTraits, domElements);
    
    // 顯示相似和互補書籍
    if (result.similarAndComplementaryBooks) {
        // 特殊結果的處理
        displaySpecialBooks(result.similarAndComplementaryBooks, domElements);
    } else {
        // 一般結果
        displaySimilarBooks(result.similarBooks, domElements.similarBooks);
        displayComplementaryBooks(result.complementaryPerspectives, domElements.complementary);
    }
    
    // 設定背景圖片（可以根據結果類型選擇不同的圖片）
    // 暫時使用 intro 背景，或者可以創建專門的結果背景圖
    domElements.bgImage.src = 'assets/images/intro-background.webp';
    
    // 觸發動畫
    setTimeout(() => {
        animateTraitBars();
    }, 1500);
}

/**
 * 顯示特質圖表
 * @param {Object} bookTraits - 特質分數對象
 * @param {Object} domElements - DOM 元素集合
 */
function displayTraitsChart(bookTraits, domElements) {
    const traitsContainer = domElements.traits;
    
    // 添加標題
    traitsContainer.innerHTML = '<h3 class="result__traits-title">你的情感特質圖譜</h3>';
    
    // 創建圖表容器
    const chartContainer = document.createElement('div');
    chartContainer.className = 'traits__chart';
    
    // 按分數排序特質
    const sortedTraits = Object.entries(bookTraits)
        .sort((a, b) => b[1] - a[1]);
    
    // 為每個特質創建條狀圖
    sortedTraits.forEach(([trait, value]) => {
        const traitItem = createTraitBar(trait, value);
        chartContainer.appendChild(traitItem);
    });
    
    traitsContainer.appendChild(chartContainer);
}

/**
 * 創建特質條狀圖項目
 * @param {string} trait - 特質代碼
 * @param {number} value - 特質分數
 * @returns {HTMLElement} 特質項目元素
 */
function createTraitBar(trait, value) {
    const item = document.createElement('div');
    item.className = 'trait__item';
    
    const label = document.createElement('div');
    label.className = 'trait__label';
    label.textContent = TRAIT_NAMES[trait];
    
    const barContainer = document.createElement('div');
    barContainer.className = 'trait__bar-container';
    
    const bar = document.createElement('div');
    bar.className = 'trait__bar';
    bar.setAttribute('data-value', value);
    bar.style.width = '0%'; // 初始寬度為0，等待動畫
    
    const valueText = document.createElement('span');
    valueText.className = 'trait__value';
    valueText.textContent = value;
    
    barContainer.appendChild(bar);
    barContainer.appendChild(valueText);
    
    item.appendChild(label);
    item.appendChild(barContainer);
    
    return item;
}

/**
 * 觸發特質條動畫
 */
function animateTraitBars() {
    const bars = document.querySelectorAll('.trait__bar');
    bars.forEach(bar => {
        const value = parseFloat(bar.getAttribute('data-value'));
        const maxValue = 5; // 最大值為5
        const percentage = (value / maxValue) * 100;
        
        requestAnimationFrame(() => {
            bar.style.width = `${percentage}%`;
        });
    });
}

/**
 * 顯示相似書籍
 * @param {Array} books - 書籍列表
 * @param {HTMLElement} container - 容器元素
 */
function displaySimilarBooks(books, container) {
    container.innerHTML = `
        <h3 class="books__title">與你相似的書籍</h3>
        <ul class="books__list">
            ${books.map(book => `<li class="books__item">${book}</li>`).join('')}
        </ul>
    `;
}

/**
 * 顯示互補書籍
 * @param {Array} books - 書籍列表
 * @param {HTMLElement} container - 容器元素
 */
function displayComplementaryBooks(books, container) {
    container.innerHTML = `
        <h3 class="books__title">與你互補的書籍</h3>
        <ul class="books__list">
            ${books.map(book => `<li class="books__item">${book}</li>`).join('')}
        </ul>
    `;
}

/**
 * 顯示特殊結果的書籍
 * @param {string} content - 特殊內容
 * @param {Object} domElements - DOM 元素集合
 */
function displaySpecialBooks(content, domElements) {
    // 將內容分割並分別顯示
    const paragraphs = content.split('\n\n');
    const description = paragraphs[0];
    const booksList = paragraphs.slice(1).join('\n');
    
    // 在相似書籍區域顯示描述
    domElements.similarBooks.innerHTML = `
        <h3 class="books__title">你的獨特之處</h3>
        <p style="font-size: var(--font-size-sm); color: var(--color-neutral-light); margin-bottom: var(--spacing-md);">
            ${description}
        </p>
    `;
    
    // 在互補區域顯示書籍列表
    domElements.complementary.innerHTML = `
        <h3 class="books__title">所有書籍都與你有緣</h3>
        <ul class="books__list">
            ${booksList.split('\n').map(book => `<li class="books__item">${book}</li>`).join('')}
        </ul>
    `;
}

/**
 * 初始化 Result 頁面
 * @param {Object} domElements - DOM 元素集合
 * @param {Function} onRestart - 重新開始回調
 */
export async function initResult(domElements, onRestart) {
    // 儲存元素引用
    elements = domElements;
    
    // 設定全域函數供 main.js 調用
    window.displayResultContent = displayResultContent;
    
    // 綁定重新開始按鈕
    elements.restartBtn.addEventListener('click', () => {
        // 重置結果內容
        resetResultContent();
        
        // 觸發回調
        if (onRestart) {
            onRestart();
        }
    });
}

/**
 * 重置結果內容
 */
function resetResultContent() {
    // 清空所有內容
    elements.title.textContent = '';
    elements.subtitle.textContent = '';
    elements.description.innerHTML = '';
    elements.traits.innerHTML = '';
    elements.similarBooks.innerHTML = '';
    elements.complementary.innerHTML = '';
}

/**
 * 清理 Result 頁面
 */
export function cleanupResult() {
    // 清除全域函數
    delete window.displayResultContent;
}