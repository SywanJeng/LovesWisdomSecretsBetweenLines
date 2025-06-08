// js/questions.js
/**
 * Questions 頁面邏輯
 * 負責問題顯示、選項處理和進度管理
 */

import { quizQuestions } from './data/quizContent.js';
import { createButtonExplosion } from './utils/animations.js';

// 儲存元素引用和狀態
let elements = {};
let currentTyping = null;
let isAnimating = false; // 用於防止在轉場動畫期間重複操作

/**
 * 簡單的打字效果實現
 * （如果不使用 TypeIt.js 的替代方案）
 */
class SimpleTypewriter {
    constructor(element, text, options = {}) {
        this.element = element;
        this.text = text;
        this.options = {
            speed: 50,
            cursor: true,
            ...options
        };
        this.currentIndex = 0;
        this.isTyping = false;
        this.cursorElement = null;
    }

    start() {
        return new Promise(resolve => {
            this.isTyping = true;
            this.element.textContent = '';

            // 添加游標
            if (this.options.cursor) {
                this.cursorElement = document.createElement('span');
                this.cursorElement.className = 'ti-cursor';
                this.cursorElement.textContent = '|';
                this.element.appendChild(this.cursorElement);
            }

            this.onComplete = resolve;
            this.type();
        });
    }

    type() {
        if (!this.isTyping || this.currentIndex >= this.text.length) {
            this.isTyping = false;
            // 移除游標
            if (this.cursorElement) {
                setTimeout(() => {
                    if (this.cursorElement) this.cursorElement.remove();
                    this.cursorElement = null;
                }, 500);
            }
            if (this.onComplete) this.onComplete();
            return;
        }

        // 插入下一個字符
        const char = this.text.charAt(this.currentIndex);
        const textNode = document.createTextNode(char);

        if (this.cursorElement) {
            this.element.insertBefore(textNode, this.cursorElement);
        } else {
            this.element.appendChild(textNode);
        }

        this.currentIndex++;

        // 計算下一個字符的延遲（標點符號延遲更長）
        const delay = /[，。？！]/.test(char) ? this.options.speed * 3 : this.options.speed;

        setTimeout(() => this.type(), delay);
    }

    stop() {
        this.isTyping = false;
        if (this.cursorElement) {
            this.cursorElement.remove();
            this.cursorElement = null;
        }
        this.element.textContent = this.text;
    }
}

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
    currentTyping = new SimpleTypewriter(
        elements.title,
        question.questionText,
        { speed: 40, cursor: true }
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
 * 執行問題轉場動畫 (不再需要手動觸發)
 */
function transitionToNextQuestion() {
    return Promise.resolve();
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
    window.loadQuestionWithAnimation = loadQuestionWithAnimation;
    window.transitionToNextQuestion = transitionToNextQuestion;
    window.updateQuestionBackground = updateBackgroundImage;
}

/**
 * 清理 Questions 頁面
 */
export function cleanupQuestions() {
    if (currentTyping) {
        currentTyping.stop();
    }

    // 清除全域函數
    delete window.loadQuestionWithAnimation;
    delete window.transitionToNextQuestion;
    delete window.updateQuestionBackground;
}