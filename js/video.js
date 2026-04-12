/**
 * 视频模块 - 按需加载
 * 版本: 2.0
 * 日期: 2026-04-12
 */

// ==================== 视频懒加载 ====================
export function initVideo() {
    if (!('IntersectionObserver' in window)) {
        return;
    }

    const videoElements = document.querySelectorAll('[data-video]');

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const videoSrc = video.dataset.video;

                // 创建iframe
                const iframe = document.createElement('iframe');
                iframe.src = videoSrc;
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.frameBorder = '0';
                iframe.allowFullscreen = true;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

                video.innerHTML = '';
                video.appendChild(iframe);
                videoObserver.unobserve(video);
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.01
    });

    videoElements.forEach(video => {
        videoObserver.observe(video);
    });
}

// ==================== 视频播放统计 ====================
export function trackVideoPlay(videoId, videoTitle) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'video_play', {
            event_category: 'engagement',
            event_label: `${videoId}: ${videoTitle}`,
            value: 1
        });
    }

    // 保存到本地存储
    const watchedVideos = JSON.parse(localStorage.getItem('watched_videos') || '[]');
    watchedVideos.push({
        videoId,
        videoTitle,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('watched_videos', JSON.stringify(watchedVideos));
}

// ==================== 视频完成统计 ====================
export function trackVideoComplete(videoId, videoTitle) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'video_complete', {
            event_category: 'engagement',
            event_label: `${videoId}: ${videoTitle}`,
            value: 1
        });
    }
}

// ==================== 导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initVideo,
        trackVideoPlay,
        trackVideoComplete
    };
}
