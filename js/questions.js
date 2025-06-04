// js/questions.js
/**
 * Questions 頁面邏輯
 * 負責問題顯示、選項處理和進度管理
 */

import { quizQuestions } from './data/quizContent.js';

// 儲存元素引用和狀態
let elements = {};
let currentTyping = null;
let isTransitioning = false;

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
        this.isTyping = true;
        this.element.textContent = '';
        
        // 添加游標
        if (this.options.cursor) {
            this.cursorElement = document.createElement('span');
            this.cursorElement.className = 'ti-cursor';
            this.cursorElement.textContent = '|';
            this.element.appendChild(this.cursorElement);
        }
        
        this.type();
        return new Promise(resolve => {
            this.onComplete = resolve;
        });
    }
    
    type() {
        if (!this.isTyping || this.currentIndex >= this.text.length) {
            this.isTyping = false;
            // 移除游標
            if (this.cursorElement) {
                setTimeout(() => {
                    this.cursorElement.remove();
                }, 500);
            }
            if (this.onComplete) this.onComplete();
            return;
        }
        
        // 插入下一個字符
        const char = this.text[this.currentIndex];
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
        this.element.textContent = this.text;
        if (this.cursorElement) {
            this.cursorElement.remove();
        }
    }
}

/**
 * 載入並顯示問題
 * @param {Object} question - 問題對象
 * @param {Function} onOptionClick - 選項點擊回調
 */
async function loadQuestionWithAnimation(question, onOptionClick) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // 清除之前的打字效果
    if (currentTyping) {
        currentTyping.stop();
    }
    
    // 清空選項
    elements.options.innerHTML = '';
    
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
        
        optionElement.addEventListener('click', () => {
            if (isTransitioning) return;
            
            // 標記選中狀態
            optionElement.classList.add('option--selected');
            
            // 禁用其他選項
            const allOptions = elements.options.querySelectorAll('.option');
            allOptions.forEach(opt => {
                opt.style.pointerEvents = 'none';
            });
            
            // 觸發回調
            setTimeout(() => {
                onOptionClick(option, index);
            }, 500);
        });
        
        elements.options.appendChild(optionElement);
    });
    
    isTransitioning = false;
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
 * 執行問題轉場動畫
 * @returns {Promise} 動畫完成的 Promise
 */
function transitionToNextQuestion() {
    return new Promise(resolve => {
        // 添加退場類別
        const questionsSection = document.getElementById('questions');
        questionsSection.classList.add('questions--exiting');
        
        // 等待動畫完成
        setTimeout(() => {
            questionsSection.classList.remove('questions--exiting');
            resolve();
        }, 500);
    });
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
    
    // 監聽背景圖片更新
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