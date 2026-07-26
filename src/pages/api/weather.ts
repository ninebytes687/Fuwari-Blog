import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
    // 从服务器环境变量读取 Key（永远不暴露给前端）
    const AMAP_KEY = import.meta.env.AMAP_KEY;
    
    if (!AMAP_KEY) {
        return new Response(
            JSON.stringify({ error: '服务器未配置高德 API Key' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // 获取查询参数
    const adcode = url.searchParams.get('city');
    
    if (!adcode) {
        return new Response(
            JSON.stringify({ error: '缺少城市参数' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        // 在服务器端请求高德 API（Key 不暴露给用户）
        const response = await fetch(
            `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}&city=${adcode}&extensions=all&output=JSON`
        );
        
        const data = await response.json();
        
        // 返回天气数据（不包含 API Key）
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=1800' // 缓存30分钟
            }
        });
        
    } catch (error) {
        console.error('天气查询失败:', error);
        return new Response(
            JSON.stringify({ error: '天气服务暂时不可用' }),
            { status: 502, headers: { 'Content-Type': 'application/json' } }
        );
    }
};