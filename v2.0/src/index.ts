/**
 * v2.0 前端入口文件
 * 整合所有模块
 */

import { initLazyLoading } from '../js/banner.js';
import { initAnimations } from '../js/animations.js';
import { initForm } from '../js/form-validation.js';
import { initMap } from '../js/map.js';
import { initVideo } from '../js/video.js';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('广西旅游 v2.0 加载完成');

    // 初始化各模块
    initLazyLoading();
    initAnimations();
    initForm();
    initMap();
    initVideo();

    // PWA 更新检测
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        if (confirm('新版本可用，是否刷新？')) {
                            window.location.reload();
                        }
                    }
                });
            });
        });
    }
});

// 全局错误处理
window.addEventListener('error', (e) => {
    console.error('全局错误:', e.error);
});

// 网络状态监听
window.addEventListener('online', () => {
    console.log('网络已连接');
});

window.addEventListener('offline', () => {
    console.log('网络已断开');
});
