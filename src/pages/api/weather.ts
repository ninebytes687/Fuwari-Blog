import type { APIRoute } from "astro";

// 服务端环境变量
const AMAP_WS_KEY = import.meta.env.PUBLIC_AMAP_WS_WEATHER_KEY || "";

export const GET: APIRoute = async ({ url }) => {
    // 1. 校验参数
    const city = url.searchParams.get("city")?.trim() || "";
    if (!city) {
        return new Response(
            JSON.stringify({ error: "参数 city 不能为空" }), 
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // 2. 检查 Key 是否配置
    if (!AMAP_WS_KEY) {
        console.error('❌ 未配置 PUBLIC_AMAP_WS_WEATHER_KEY');
        return new Response(
            JSON.stringify({ error: "服务器未配置高德API Key" }), 
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // 3. 服务端请求高德（Key 只在这里，永远不会暴露给前端）
    try {
        console.log(`🌤️ 查询城市 ${city} 的天气...`);
        
        const target = `https://restapi.amap.com/v3/weather/weatherInfo?key=${encodeURIComponent(AMAP_WS_KEY)}&city=${encodeURIComponent(city)}&extensions=all&output=JSON`;
        
        const resp = await fetch(target, {
            headers: {
                "User-Agent": "Fuwari-Weather-Proxy/1.0",
                "Accept": "application/json",
            },
            signal: AbortSignal.timeout(10 * 1000),
        });

        if (!resp.ok) {
            console.error(`❌ 高德API返回错误: ${resp.status}`);
            return new Response(
                JSON.stringify({ error: `高德 HTTP ${resp.status}` }), 
                { status: 502, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const data = await resp.json();
        console.log('📊 高德返回:', data);

        // 4. 解析并返回精简数据
        let result = { ok: false, maxTemp: "--", minTemp: "--", weather: "晴", isLive: false };
        
        if (data && String(data.status) === "1" && data.forecasts && data.forecasts[0]?.casts?.[0]) {
            const c = data.forecasts[0].casts[0];
            result = { 
                ok: true, 
                maxTemp: String(c.daytemp), 
                minTemp: String(c.nighttemp), 
                weather: String(c.dayweather || "晴"), 
                isLive: false 
            };
            console.log(`✅ 预报数据: ${c.dayweather}, ${c.daytemp}°C / ${c.nighttemp}°C`);
        }
        
        if (!result.ok) {
            // 预报失败自动降级实时天气
            console.log('⚠️ 预报失败，尝试实时天气...');
            const liveTarget = `https://restapi.amap.com/v3/weather/weatherInfo?key=${encodeURIComponent(AMAP_WS_KEY)}&city=${encodeURIComponent(city)}&extensions=base&output=JSON`;
            const liveResp = await fetch(liveTarget, { 
                headers: { "User-Agent": "Fuwari-Weather-Proxy/1.0" }, 
                signal: AbortSignal.timeout(10 * 1000) 
            });
            
            if (liveResp.ok) {
                const ld = await liveResp.json();
                if (String(ld.status) === "1" && ld.lives && ld.lives[0]) {
                    result = { 
                        ok: true, 
                        maxTemp: String(ld.lives[0].temperature), 
                        minTemp: String(ld.lives[0].temperature), 
                        weather: String(ld.lives[0].weather || "晴"), 
                        isLive: true 
                    };
                    console.log(`✅ 实时数据: ${ld.lives[0].weather}, ${ld.lives[0].temperature}°C`);
                }
            }
        }

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "public, max-age=21600", // 缓存6小时
                "Access-Control-Allow-Origin": "*", // 允许跨域（手机端需要）
            },
        });
        
    } catch (e: any) {
        console.error('❌ 天气查询异常:', e.message);
        return new Response(
            JSON.stringify({ error: "服务端请求失败", msg: e.message || "" }), 
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};