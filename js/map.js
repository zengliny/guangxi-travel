/**
 * 地图模块 - 按需加载
 * 版本: 2.0
 * 日期: 2026-04-12
 */

// ==================== 地图初始化 ====================
export async function initMap() {
    // 检查是否已加载
    if (window.BMapGL) {
        initBaiduMap();
        return;
    }

    // 动态加载百度地图API
    const script = document.createElement('script');
    script.src = 'https://api.map.baidu.com/api?v=3.0&ak=YOUR_API_KEY&callback=initBaiduMap';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // 全局回调函数
    window.initBaiduMap = initBaiduMap;
}

// ==================== 百度地图初始化 ====================
export function initBaiduMap() {
    // 检查地图容器
    const mapContainer = document.getElementById('baidu-map');
    if (!mapContainer) return;

    // 检查API密钥
    if (!mapContainer.dataset.ak) {
        console.warn('百度地图API密钥未配置');
        mapContainer.innerHTML = '<p>地图加载失败，请配置API密钥</p>';
        return;
    }

    try {
        // 创建地图实例
        const map = new BMapGL.Map(mapContainer);
        const centerPoint = new BMapGL.Point(108.367, 22.817); // 北海坐标

        // 初始化地图
        map.centerAndZoom(centerPoint, 13);
        map.enableScrollWheelZoom(true);
        map.enableDoubleClickZoom(true);

        // 添加控件
        map.addControl(new BMapGL.NavigationControl());
        map.addControl(new BMapGL.ScaleControl());
        map.addControl(new BMapGL.OverviewMapControl());

        // 添加标记
        const markers = [
            { name: '涠洲岛', point: [109.165, 21.5333], address: '北海市涠洲岛' },
            { name: '德天瀑布', point: [106.825, 22.3583], address: '崇左市大新县' },
            { name: '阳朔', point: [110.443, 24.8067], address: '桂林市阳朔县' },
            { name: '银滩', point: [109.152, 21.4833], address: '北海市银海区' }
        ];

        markers.forEach(marker => {
            const point = new BMapGL.Point(marker.point[0], marker.point[1]);
            const markerObj = new BMapGL.Marker(point);
            map.addOverlay(markerObj);

            // 添加信息窗口
            const content = `<div style="padding:10px;"><h3>${marker.name}</h3><p>${marker.address}</p></div>`;
            const infoWindow = new BMapGL.InfoWindow(content);

            markerObj.addEventListener('click', function() {
                map.openInfoWindow(infoWindow, point);
            });
        });

        // 添加点击事件
        map.addEventListener('click', function(e) {
            console.log('点击位置:', e.point.lng, e.point.lat);
        });

    } catch (error) {
        console.error('地图初始化失败:', error);
        mapContainer.innerHTML = '<p>地图加载失败，请稍后重试</p>';
    }
}

// ==================== 获取当前位置 ====================
export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('浏览器不支持地理定位');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                reject('无法获取位置信息: ' + error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

// ==================== 导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMap,
        initBaiduMap,
        getCurrentLocation
    };
}
