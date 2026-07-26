export interface FriendLink {
	name: string;        // 博客名称
	url: string;         // 博客链接
	avatar: string;      // 头像图片 URL
	description: string; // 一句话描述
}

export const friendLinks: FriendLink[] = [
	// ====== 在这里添加你的友链 ======
	{
		name: "示例博客一",
		url: "https://example.com",
		avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix",
		description: "这是第一个示例博客的描述",
	},
];