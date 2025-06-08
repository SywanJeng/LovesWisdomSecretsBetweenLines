// js/questions.js
/**
 * Questions 頁面邏輯
 * 負責問題顯示、選項處理和進度管理
 */

import { quizQuestions } from './data/quizContent.js';
import { createButtonExplosion, typeText } from './utils/animations.js';

// 儲存元素引用和狀態
let elements = {};
let currentTyping = null;
let isAnimating = false; // 用於防止在轉場動畫期間重複操作

/**
 * 載入並顯示問題
 * @param {Object} question - 問題對象
 * @param {Function} onOptionClick - 選項點擊回調
 */
async function loadQuestionWithAnimation(question, onOptionClick) {
    isAnimating = true;

    // 清除之前的打字效果
    if (currentTyping) {
        currentTyping.stop();
        currentTyping = null;
    }

    // 清空選項
    elements.options.innerHTML = '';
    const questionsSection = document.getElementById('questions');
    questionsSection.classList.remove('questions--exiting'); // 確保進入時不處於淡出狀態
    elements.title.style.opacity = '1';
    elements.options.style.opacity = '1';

    // 使用打字效果顯示問題
    currentTyping = typeText(
        elements.title,
        question.questionText,
        { speed: 40, cursor: true, cursorClassName: 'ti-cursor' } // Use existing cursor class if styled
    );

    await currentTyping.start();

    // 等待一小段時間後顯示選項
    await new Promise(resolve => setTimeout(resolve, 300));

    // 創建並顯示選項
    question.options.forEach((option, index) => {
        const optionElement = createOptionElement(option, index);

        optionElement.addEventListener('click', async () => {
            // 防止重複點擊
            if (isAnimating) return;
            isAnimating = true;

            // 禁用所有選項的點擊事件
            const allOptions = elements.options.querySelectorAll('.option');
            allOptions.forEach(opt => {
                opt.style.pointerEvents = 'none';
            });

            // 觸發噴濺動畫
            createButtonExplosion(optionElement);
            optionElement.classList.add('is-exploding');
            optionElement.style.pointerEvents = 'none'; // 防止再次點擊

            // 開始淡出問題和選項
            questionsSection.classList.add('questions--exiting');

            // 淡出後觸發回調
            const onTransitionEnd = () => {
                questionsSection.removeEventListener('transitionend', onTransitionEnd);
                onOptionClick(option, index);
                isAnimating = false;
            };
            questionsSection.addEventListener('transitionend', onTransitionEnd);
        });

        elements.options.appendChild(optionElement);
    });

    isAnimating = false;
}

/**
 * 創建選項元素
 * @param {Object} option - 選項對象
 * @param {number} index - 選項索引
 * @returns {HTMLElement} 選項元素
 */
function createOptionElement(option, index) {
    const button = document.createElement('button');
    button.className = 'option';
    button.textContent = option.text;
    button.setAttribute('data-option-index', index);

    // 如果是 Q9 且有 optionId，添加到 data 屬性
    if (option.optionId) {
        button.setAttribute('data-option-id', option.optionId);
    }

    return button;
}

/**
 * 更新背景圖片（帶過渡效果）
 * @param {string} imageSrc - 圖片路徑
 */
function updateBackgroundImage(imageSrc) {
    const bgImage = elements.bgImage;

    // 淡出當前圖片
    bgImage.style.opacity = '0';

    // 更換圖片並淡入
    setTimeout(() => {
        bgImage.src = imageSrc;
        bgImage.onload = () => {
            bgImage.style.opacity = '1';
        };
    }, 300);
}

/**
 * 初始化 Questions 頁面
 * @param {Object} domElements - DOM 元素集合
 */
export async function initQuestions(domElements) {
    // 儲存元素引用
    elements = domElements;

    // 設定全域函數供 main.js 調用
    // window.loadQuestionWithAnimation = loadQuestionWithAnimation;
    // window.transitionToNextQuestion = transitionToNextQuestion;
    // window.updateQuestionBackground = updateBackgroundImage;
    return {
        loadQuestionWithAnimation,
        // transitionToNextQuestion, // Removed
        updateQuestionBackground: updateBackgroundImage
    };
}

/**
 * 清理 Questions 頁面
 */
export function cleanupQuestions() {
    if (currentTyping && typeof currentTyping.stop === 'function') {
        currentTyping.stop();
        currentTyping = null; // Clear reference
    }

    // 清除全域函數
    // delete window.loadQuestionWithAnimation; // No longer needed
    // delete window.transitionToNextQuestion; // No longer needed
    // delete window.updateQuestionBackground; // No longer needed
}