import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "NineBytes Blog", // 网站标题
	subtitle: "owo", // 网站副标题
	lang: "en", // 语言代码，例如 'en'、'zh_CN'、'ja' 等
	themeColor: {
		hue: 345, // 主题色的默认色相，范围 0 到 360。例如：红色 0、青色 200、蓝色 250、粉色 345
		fixed: false, // 是否对访客隐藏主题色选择器
	},
	banner: {
		enable: false,
		src: "/banner.png", // 相对于 /src 目录；如果以 '/' 开头则相对于 /public 目录
		position: "center", // 等同于 object-position，仅支持 'top'、'center'、'bottom'，默认为 'center'
		credit: {
			enable: false, // 是否显示横幅图片的版权信息
			text: "", // 要显示的版权文字
			url: "", // （可选）指向原作品或作者主页的链接
		},
	},
	toc: {
		enable: true, // 是否在文章右侧显示目录
		depth: 2, // 目录中显示的最大标题层级，范围 1 到 3
	},
	favicon: [
		// 留空以使用默认网站图标
		 {
		   src: '/icon.ico',    // 网站图标的路径，相对于 /public 目录
		//   theme: 'light',              // （可选）仅当你有亮色/暗色模式不同的图标时才设置，可选 'light' 或 'dark'
		//   sizes: '32x32',              // （可选）仅当你有不同尺寸的图标时才设置
		 }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "Friends",
			url: "/friends/",
		},
		LinkPreset.About,
		{
			name: "Status",
			url: "https://stats.uptimerobot.com/WeknJyR7fh",
			external: true,
		},
		{
			name: "Umami",
			url: "https://cloud.umami.is/share/1RUeIPnsi9lRbOUS",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/profile.png", // 相对于 /src 目录；如果以 '/' 开头则相对于 /public 目录
	name: "NineBytes",
	bio: "偏我来时不逢春",
	links: [
		{
			name: "Email",
			icon: "fa6-solid:envelope",
			url: "mailto:ninebytes@ninbytes.cc.cd",
		},
		{
			name: "Bilibili",
			icon: "simple-icons:bilibili",
			url: "https://space.bilibili.com/1968552375/",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/ninebytes687",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 注意：某些样式（例如背景色）会被覆盖，详见 astro.config.mjs 文件。
	// 请选择暗色主题，因为当前博客模板只支持暗色代码块背景
	theme: "github-dark",
};