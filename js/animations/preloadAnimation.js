// js/animations/preloadAnimation.js
/**
 * Preload 頁面的 SVG 動畫邏輯
 * 包含描邊動畫、填色動畫、放大模糊消失效果
 */

import { createSVGAnimationController, getSVGPaths } from '../utils/svgLoader.js';

/**
 * 執行描邊動畫
 * @param {SVGElement} svg - SVG 元素
 * @param {NodeList} paths - 路徑元素列表
 * @returns {Promise} 動畫完成的 Promise
 */
function strokeAnimation(svg, paths) {
    return new Promise(resolve => {
        let completedPaths = 0;
        const totalPaths = paths.length;
        
        paths.forEach((path, index) => {
            const pathLength = path.getAttribute('data-path-length');
            
            // 設定初始樣式
            path.style.fill = 'none';
            path.style.stroke = '#ff6b6b';
            path.style.strokeWidth = '2';
            path.style.strokeDasharray = pathLength;
            path.style.strokeDashoffset = pathLength;
            
            // 延遲動畫，產生流暢的描邊效果
            setTimeout(() => {
                path.style.transition = `stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)`;
                path.style.strokeDashoffset = '0';
                
                // 監聽動畫完成
                path.addEventListener('transitionend', function handler(e) {
                    if (e.propertyName === 'stroke-dashoffset') {
                        completedPaths++;
                        path.removeEventListener('transitionend', handler);
                        
                        if (completedPaths === totalPaths) {
                            resolve();
                        }
                    }
                });
            }, index * 100); // 每個路徑延遲 100ms
        });
    });
}

/**
 * 執行填色動畫
 * @param {SVGElement} svg - SVG 元素
 * @param {NodeList} paths - 路徑元素列表
 * @returns {Promise} 動畫完成的 Promise
 */
function fillAnimation(svg, paths) {
    return new Promise(resolve => {
        let completedPaths = 0;
        const totalPaths = paths.length;
        
        paths.forEach((path, index) => {
            // 延遲動畫
            setTimeout(() => {
                path.style.transition = `fill 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                                        fill-opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)`;
                path.style.fill = '#ff6b6b';
                path.style.fillOpacity = '1';
                
                // 監聽動畫完成
                path.addEventListener('transitionend', function handler(e) {
                    if (e.propertyName === 'fill-opacity') {
                        completedPaths++;
                        path.removeEventListener('transitionend', handler);
                        
                        if (completedPaths === totalPaths) {
                            // 填色完成後，移除描邊
                            paths.forEach(p => {
                                p.style.transition = 'stroke-opacity 0.3s ease-out';
                                p.style.strokeOpacity = '0';
                            });
                            
                            setTimeout(resolve, 300);
                        }
                    }
                });
            }, index * 50); // 每個路徑延遲 50ms
        });
    });
}

/**
 * 執行放大模糊消失動畫
 * @param {SVGElement} svg - SVG 元素
 * @param {NodeList} paths - 路徑元素列表
 * @returns {Promise} 動畫完成的 Promise
 */
function scaleBlurFadeAnimation(svg, paths) {
    return new Promise(resolve => {
        // 設定 SVG 容器的過渡效果
        svg.style.transition = `transform 1.5s cubic-bezier(0.4, 0, 0.2, 1),
                                opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1),
                                filter 1.5s cubic-bezier(0.4, 0, 0.2, 1)`;
        
        // 設定初始變形原點為中心
        svg.style.transformOrigin = 'center center';
        
        // 執行動畫
        requestAnimationFrame(() => {
            svg.style.transform = 'scale(1.5)';
            svg.style.opacity = '0';
            svg.style.filter = 'blur(20px)';
        });
        
        // 監聽動畫完成
        svg.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'opacity') {
                svg.removeEventListener('transitionend', handler);
                resolve();
            }
        });
    });
}

/**
 * 創建並返回 Preload 動畫控制器
 * @param {SVGElement} svg - SVG 元素
 * @returns {Object} 動畫控制器
 */
export function createPreloadAnimation(svg) {
    const controller = createSVGAnimationController(svg);
    
    // 定義動畫序列
    controller
        .add(strokeAnimation, 500)      // 延遲 500ms 後開始描邊動畫
        .add(fillAnimation, 500)        // 描邊完成後延遲 500ms 開始填色
        .add(scaleBlurFadeAnimation, 800); // 填色完成後延遲 800ms 開始消失動畫
    
    return controller;
}

/**
 * 執行完整的 Preload 動畫序列
 * @param {SVGElement} svg - SVG 元素
 * @returns {Promise} 動畫完成的 Promise
 */
export async function runPreloadAnimation(svg) {
    const controller = createPreloadAnimation(svg);
    await controller.play();
    return true;
}

/**
 * 獲取動畫總時長（用於預估）
 * @returns {number} 總時長（毫秒）
 */
export function getAnimationDuration() {
    // 描邊動畫: 500ms 延遲 + 1500ms 動畫 + 路徑間延遲
    // 填色動畫: 500ms 延遲 + 800ms 動畫
    // 消失動畫: 800ms 延遲 + 1500ms 動畫
    // 總計約: 6-7 秒
    return 7000;
}