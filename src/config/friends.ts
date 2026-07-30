export interface FriendLink {
	name: string;        // 博客名称
	url: string;         // 博客链接
	avatar: string;      // 头像图片 URL
	description: string; // 一句话描述
}

export const friendLinks: FriendLink[] = [
	{
		name: "芹香のblog",
		url: "https://blog.serikawa.top",
		avatar: "https://imgs.977958.xyz/uploads//684dac2732bba_.jpg",
		description: "芹香のblog，一个游戏站点兼信息技术交流小站，欢迎来玩♡",
	},
];