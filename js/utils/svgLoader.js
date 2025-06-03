// js/utils/svgLoader.js
/**
 * SVG 載入工具模組
 * 負責載入和處理 SVG 檔案
 */

/**
 * 載入 SVG 檔案並插入到指定容器
 * @param {string} url - SVG 檔案路徑
 * @param {HTMLElement} container - 目標容器元素
 * @param {Object} options - 選項配置
 * @param {string} options.className - 要添加的 CSS 類別
 * @param {Object} options.attributes - 要設定的屬性
 * @param {boolean} options.preserveAspectRatio - 是否保持長寬比
 * @returns {Promise<SVGElement>} 返回 SVG 元素
 */
export async function loadSVG(url, container, options = {}) {
    try {
        // 載入 SVG 檔案
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load SVG: ${response.status}`);
        }
        
        const svgText = await response.text();
        
        // 清空容器並插入 SVG
        container.innerHTML = svgText;
        
        // 獲取 SVG 元素
        const svg = container.querySelector('svg');
        if (!svg) {
            throw new Error('No SVG element found in loaded content');
        }
        
        // 設定 CSS 類別
        if (options.className) {
            svg.classList.add(options.className);
        }
        
        // 設定屬性
        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                svg.setAttribute(key, value);
            });
        }
        
        // 設定 preserveAspectRatio
        if (options.preserveAspectRatio !== undefined) {
            svg.setAttribute('preserveAspectRatio', 
                options.preserveAspectRatio ? 'xMidYMid meet' : 'none');
        }
        
        // 準備 SVG 元素以供動畫使用
        prepareSVGForAnimation(svg);
        
        return svg;
        
    } catch (error) {
        console.error('Error loading SVG:', error);
        throw error;
    }
}

/**
 * 準備 SVG 元素以供動畫使用
 * @param {SVGElement} svg - SVG 元素
 */
function prepareSVGForAnimation(svg) {
    // 獲取所有路徑元素
    const paths = svg.querySelectorAll('path');
    
    paths.forEach((path, index) => {
        // 添加索引作為 data 屬性，方便動畫控制
        path.setAttribute('data-path-index', index);
        
        // 計算路徑長度（用於描邊動畫）
        const pathLength = path.getTotalLength();
        path.setAttribute('data-path-length', pathLength);
        
        // 設定初始狀態為隱藏（用於描邊動畫）
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
    });
}

/**
 * 獲取 SVG 中的所有路徑元素
 * @param {SVGElement} svg - SVG 元素
 * @returns {NodeList} 路徑元素列表
 */
export function getSVGPaths(svg) {
    return svg.querySelectorAll('path');
}

/**
 * 獲取 SVG 中的特定路徑元素
 * @param {SVGElement} svg - SVG 元素
 * @param {number} index - 路徑索引
 * @returns {SVGPathElement|null} 路徑元素
 */
export function getSVGPath(svg, index) {
    return svg.querySelector(`path[data-path-index="${index}"]`);
}

/**
 * 重置 SVG 到初始狀態
 * @param {SVGElement} svg - SVG 元素
 */
export function resetSVG(svg) {
    const paths = getSVGPaths(svg);
    
    paths.forEach(path => {
        const pathLength = path.getAttribute('data-path-length');
        
        // 重置描邊動畫
        path.style.strokeDashoffset = pathLength;
        
        // 重置填色
        path.style.fill = 'none';
        path.style.fillOpacity = '0';
        
        // 重置變形
        path.style.transform = 'none';
        path.style.opacity = '1';
    });
    
    // 重置 SVG 本身
    svg.style.transform = 'none';
    svg.style.opacity = '1';
    svg.style.filter = 'none';
}

/**
 * 創建 SVG 動畫序列輔助函數
 * @param {SVGElement} svg - SVG 元素
 * @returns {Object} 動畫控制物件
 */
export function createSVGAnimationController(svg) {
    const paths = getSVGPaths(svg);
    let animationQueue = [];
    let isPlaying = false;
    
    return {
        // 添加動畫到序列
        add(animationFunc, delay = 0) {
            animationQueue.push({ func: animationFunc, delay });
            return this;
        },
        
        // 播放動畫序列
        async play() {
            if (isPlaying) return;
            isPlaying = true;
            
            for (const { func, delay } of animationQueue) {
                if (delay > 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                await func(svg, paths);
            }
            
            isPlaying = false;
            animationQueue = [];
        },
        
        // 停止動畫
        stop() {
            isPlaying = false;
            animationQueue = [];
        },
        
        // 重置 SVG
        reset() {
            this.stop();
            resetSVG(svg);
        }
    };
}