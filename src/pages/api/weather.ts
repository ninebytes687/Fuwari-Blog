import type { APIRoute } from "astro";

// 服务端环境变量，前端永远读不到！
const AMAP_WS_KEY = import.meta.env.PUBLIC_AMAP_WS_WEATHER_KEY || "";

export const GET: APIRoute = async ({ url }) => {
    // 1. 校验参数
    const city = url.searchParams.get("city")?.trim() || "";
    if (!city) return new Response(JSON.stringify({ error: "参数 city 不能为空" }), { status: 400 });

    // 2. 简单防刷：只允许我们自己的博客域名 / localhost 调用
    const referer = url.searchParams.get("ref") || "";
    const ua = url.searchParams.get("ua") || "";
    // 开发环境允许 localhost，生产环境填你自己的博客域名
    const allowedRefList = [
        "localhost",
        "127.0.0.1",
        "blog.ninebytes.cc.cd",   // ← 改成你自己的生产域名
        ".ninebytes.cc.cd",
    ];
    const refOk = !referer || allowedRefList.some((r) => referer.indexOf(r) >= 0);
    if (!refOk) return new Response(JSON.stringify({ error: "域名未授权" }), { status: 403 });

    // 3. 服务端请求高德（Key 只在这里，永远不会暴露给前端）
    try {
        const target = `https://restapi.amap.com/v3/weather/weatherInfo?key=${encodeURIComponent(AMAP_WS_KEY)}&city=${encodeURIComponent(city)}&extensions=all`;
        const resp = await fetch(target, {
            headers: {
                "User-Agent": ua || "Fuwari-Weather-Proxy/1.0",
                "Accept": "application/json",
            },
            signal: AbortSignal.timeout(10 * 1000),
        });
        if (!resp.ok) return new Response(JSON.stringify({ error: "高德 HTTP " + resp.status }), { status: 502 });
        const data = await resp.json();

        // 4. 只回传我们真正要的字段，不回传高德原始 info/infocode 等冗余，更省流量
        let result = { ok: false, maxTemp: "--", minTemp: "--", weather: "晴", isLive: false };
        if (data && String(data.status) === "1" && data.forecasts && data.forecasts[0]?.casts?.[0]) {
            const c = data.forecasts[0].casts[0];
            result = { ok: true, maxTemp: String(c.daytemp), minTemp: String(c.nighttemp), weather: String(c.dayweather || "晴"), isLive: false };
        }
        if (!result.ok) {
            // 预报失败自动降级实时
            const liveTarget = `https://restapi.amap.com/v3/weather/weatherInfo?key=${encodeURIComponent(AMAP_WS_KEY)}&city=${encodeURIComponent(city)}&extensions=base`;
            const liveResp = await fetch(liveTarget, { headers: { "User-Agent": ua || "Fuwari-Weather-Proxy/1.0" }, signal: AbortSignal.timeout(10 * 1000) });
            if (liveResp.ok) {
                const ld = await liveResp.json();
                if (String(ld.status) === "1" && ld.lives && ld.lives[0]) {
                    result = { ok: true, maxTemp: String(ld.lives[0].temperature), minTemp: String(ld.lives[0].temperature), weather: String(ld.lives[0].weather || "晴"), isLive: true };
                }
            }
        }
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": `public, max-age=${6 * 3600}, s-maxage=${6 * 3600}`, // 服务端 CDN 也缓存 6 小时，更省额度
            },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: "服务端请求失败", msg: (e as any).message || "" }), { status: 500 });
    }
};