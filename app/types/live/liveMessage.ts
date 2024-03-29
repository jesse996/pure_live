enum LiveMessageType {
	// 聊天
	chat = "chat",

	// 礼物,暂时不支持
	gift = "gift",

	// 在线人数
	online = "online",

	// 醒目留言
	superChat = "superChat",
}

export type LiveMessage = {
	// 消息类型
	type: LiveMessageType;

	// 用户名
	userName: string;

	// 信息
	message: string;

	// 数据
	// 单Type=Online时，Data为人气值(long)
	data: any;

	// 弹幕颜色
	color: LiveMessageColor;
};

class LiveMessageColor {
	r: number;
	g: number;
	b: number;

	constructor(r: number, g: number, b: number) {
		this.r = r;
		this.g = g;
		this.b = b;
	}

	static get white() {
		return new LiveMessageColor(255, 255, 255);
	}

	static numberToColor(intColor: number) {
		let obj = intColor.toString(16);

		let color = LiveMessageColor.white;
		if (obj.length === 4) {
			obj = `00${obj}`;
		}
		if (obj.length === 6) {
			const R = Number.parseInt(obj.substring(0, 2), 16);
			const G = Number.parseInt(obj.substring(2, 4), 16);
			const B = Number.parseInt(obj.substring(4, 6), 16);

			color = new LiveMessageColor(R, G, B);
		}
		if (obj.length === 8) {
			const R = Number.parseInt(obj.substring(2, 4), 16);
			const G = Number.parseInt(obj.substring(4, 6), 16);
			const B = Number.parseInt(obj.substring(6, 8), 16);
			//let A = parseInt(obj.substring(0, 2), 16);
			color = new LiveMessageColor(R, G, B);
		}

		return color;
	}

	toString() {
		return `#${this.r.toString(16).padStart(2, "0")}${this.g
			.toString(16)
			.padStart(2, "0")}${this.b.toString(16).padStart(2, "0")}`;
	}
}

export type LiveSuperChatMessage = {
	userName: string;
	face: string;
	message: string;
	price: number;
	startTime: Date;
	endTime: Date;
	backgroundColor: string;
	backgroundBottomColor: string;
};
