// js/main.js
/**
 * 主控制器
 * 負責整體頁面流程控制、狀態管理與模組協調
 */

// 導入各個模組
import { initPreload } from './preload.js';
import { initIntro } from './intro.js';
import { initQuestions } from './questions.js';
import { initResult } from './result.js';
import { quizQuestions, quizResults } from './data/quizContent.js';

// 應用程式狀態
const AppState = {
    currentPage: 'preload',
    currentQuestion: 0,
    answers: [],
    scores: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0
    },
    isTransitioning: false
};

// DOM 元素快取
const elements = {
    pages: {},
    preload: {},
    intro: {},
    questions: {},
    result: {}
};

/**
 * 初始化 DOM 元素快取
 */
function initializeElements() {
    // 頁面元素
    elements.pages = {
        preload: document.getElementById('preload'),
        intro: document.getElementById('intro'),
        questions: document.getElementById('questions'),
        result: document.getElementById('result')
    };
    
    // Preload 相關元素
    elements.preload = {
        container: document.querySelector('.preload__container'),
        logo: document.querySelector('.preload__logo'),
        progressText: document.querySelector('.preload__progress-text')
    };
    
    // Intro 相關元素
    elements.intro = {
        startBtn: document.querySelector('.intro__start-btn'),
        title: document.querySelector('.intro__title'),
        description: document.querySelector('.intro__description')
    };
    
    // Questions 相關元素
    elements.questions = {
        bgImage: document.querySelector('.questions__bg-image'),
        currentNum: document.querySelector('.questions__current'),
        totalNum: document.querySelector('.questions__total'),
        progressFill: document.querySelector('.questions__progress-fill'),
        title: document.querySelector('.questions__title'),
        options: document.querySelector('.questions__options')
    };
    
    // Result 相關元素
    elements.result = {
        bgImage: document.querySelector('.result__bg-image'),
        title: document.querySelector('.result__title'),
        subtitle: document.querySelector('.result__subtitle'),
        description: document.querySelector('.result__description'),
        restartBtn: document.querySelector('.result__restart-btn')
    };
}

/**
 * 頁面切換函數
 * @param {string} targetPage - 目標頁面名稱
 * @param {number} delay - 延遲時間（毫秒）
 */
async function switchPage(targetPage, delay = 0) {
    if (AppState.isTransitioning) return;
    
    AppState.isTransitioning = true;
    
    // 延遲執行
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // 淡出當前頁面
    const currentPageElement = elements.pages[AppState.currentPage];
    if (currentPageElement) {
        currentPageElement.classList.remove('page--active');
    }
    
    // 等待淡出動畫完成
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 淡入目標頁面
    const targetPageElement = elements.pages[targetPage];
    if (targetPageElement) {
        targetPageElement.classList.add('page--active');
        AppState.currentPage = targetPage;
    }
    
    // 觸發頁面進入事件
    handlePageEnter(targetPage);
    
    AppState.isTransitioning = false;
}

/**
 * 處理頁面進入事件
 * @param {string} page - 進入的頁面名稱
 */
function handlePageEnter(page) {
    switch (page) {
        case 'intro':
            // 觸發 Intro 頁面動畫
            if (window.introPageEnter) {
                window.introPageEnter();
            }
            break;
        case 'questions':
            // 載入第一個問題
            loadQuestion(0);
            break;
        case 'result':
            // 顯示結果
            displayResult();
            break;
    }
}

/**
 * 載入問題
 * @param {number} questionIndex - 問題索引
 */
function loadQuestion(questionIndex) {
    if (questionIndex >= quizQuestions.length) {
        // 所有問題回答完畢，前往結果頁
        switchPage('result');
        return;
    }
    
    AppState.currentQuestion = questionIndex;
    const question = quizQuestions[questionIndex];
    
    // 更新進度
    elements.questions.currentNum.textContent = questionIndex + 1;
    elements.questions.totalNum.textContent = quizQuestions.length;
    elements.questions.progressFill.style.width = 
        `${((questionIndex + 1) / quizQuestions.length) * 100}%`;
    
    // 更新背景圖片
    const imagePath = `assets/images/question-bg-${questionIndex + 1}.webp`;
    if (window.updateQuestionBackground) {
        window.updateQuestionBackground(imagePath);
    } else {
        // 直接更新（如果動畫函數還未載入）
        elements.questions.bgImage.src = imagePath;
    }
    
    // 清空並載入問題內容
    elements.questions.title.textContent = '';
    elements.questions.options.innerHTML = '';
    
    // 使用動畫載入問題（將在 questions.js 中實現）
    if (window.loadQuestionWithAnimation) {
        window.loadQuestionWithAnimation(question, handleAnswer);
    }
}

/**
 * 處理答案選擇
 * @param {Object} option - 選擇的選項
 * @param {number} optionIndex - 選項索引
 */
function handleAnswer(option, optionIndex) {
    // 記錄答案
    AppState.answers.push({
        questionId: quizQuestions[AppState.currentQuestion].id,
        optionIndex: optionIndex,
        option: option
    });
    
    // 累加分數
    Object.keys(option.scores).forEach(trait => {
        AppState.scores[trait] += option.scores[trait];
    });
    
    // 處理 Q9 決勝題的特殊邏輯
    if (quizQuestions[AppState.currentQuestion].id === 'Q9' && option.optionId) {
        AppState.q9Choice = option.optionId;
    }
    
    // 載入下一題
    setTimeout(() => {
        loadQuestion(AppState.currentQuestion + 1);
    }, 500);
}

/**
 * 計算並顯示結果
 */
function displayResult() {
    // 計算最終結果
    const finalResult = calculateFinalResult();
    
    // 顯示結果內容
    if (window.displayResultContent) {
        window.displayResultContent(finalResult, elements.result);
    }
}

/**
 * 計算最終結果
 * @returns {Object} 結果對象
 */
function calculateFinalResult() {
    // 找出分數最高的特質
    let maxScore = 0;
    let topTraits = [];
    
    Object.entries(AppState.scores).forEach(([trait, score]) => {
        if (score > maxScore) {
            maxScore = score;
            topTraits = [trait];
        } else if (score === maxScore) {
            topTraits.push(trait);
        }
    });
    
    // 如果有多個最高分，使用 Q9 決勝
    let finalTrait = topTraits[0];
    if (topTraits.length > 1 && AppState.q9Choice) {
        const q9Trait = AppState.q9Choice.split('_')[1];
        if (topTraits.includes(q9Trait)) {
            finalTrait = q9Trait;
        }
    }
    
    // 檢查是否為特殊結果（均衡型）
    const uniqueScores = new Set(Object.values(AppState.scores));
    if (uniqueScores.size === 1) {
        return quizResults.SPECIAL_RESULT;
    }
    
    return quizResults[finalTrait];
}

/**
 * 重置應用程式狀態
 */
function resetAppState() {
    AppState.currentQuestion = 0;
    AppState.answers = [];
    AppState.scores = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    AppState.q9Choice = null;
}

/**
 * 初始化應用程式
 */
async function init() {
    // 初始化 DOM 元素
    initializeElements();
    
    // 初始化各個模組
    await initPreload(elements.preload, () => switchPage('intro', 1000));
    await initIntro(elements.intro, () => switchPage('questions'));
    await initQuestions(elements.questions);
    await initResult(elements.result, () => {
        resetAppState();
        switchPage('intro');
    });
    
    // 設定全域事件監聽器
    setupGlobalEventListeners();
}

/**
 * 設定全域事件監聽器
 */
function setupGlobalEventListeners() {
    // 防止頁面刷新時的資料遺失提醒
    window.addEventListener('beforeunload', (e) => {
        if (AppState.currentPage === 'questions' && AppState.answers.length > 0) {
            e.preventDefault();
            e.returnValue = '您的測驗進度將會遺失，確定要離開嗎？';
        }
    });
    
    // 監聽鍵盤事件（用於開發測試）
    if (window.location.hostname === 'localhost') {
        document.addEventListener('keydown', (e) => {
            // 按下數字鍵 1-4 快速切換頁面（開發用）
            if (e.key >= '1' && e.key <= '4') {
                const pages = ['preload', 'intro', 'questions', 'result'];
                switchPage(pages[parseInt(e.key) - 1]);
            }
        });
    }
}

// 當 DOM 載入完成後初始化應用程式
document.addEventListener('DOMContentLoaded', init);

// 匯出必要的函數供其他模組使用
export { AppState, switchPage, loadQuestion, handleAnswer };