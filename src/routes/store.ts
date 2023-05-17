import { writable, type Writable } from 'svelte/store';
import { persisted } from 'svelte-local-storage-store';
interface NftItem {
	id: number;
	img: string;
	name: string;
	number: number;
	all: number;
	price: number;
	createTime: string;
	desc: string | undefined | null;
	checkStatus: number | undefined | null; // 0 审核中，1通过，2不通过
	creatorId: number;
	ownerId: number;
}

export const isLogin = persisted('isLogin', false);

export const isLoading = persisted('isLoading', false);

export const homeNftList = persisted<NftItem[]>('homeNftList', [
	{
		id: 1,
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/167f08459056401d8206cfc80b4e799e.png?style=st6',
		name: '凌霄殿',
		number: 413,
		all: 500,
		price: 999,
		createTime: '2023/01/12',
		checkStatus: 1,
		creatorId: 2,
		ownerId: 2,
		desc: ' 气是书说度先须种进效级治，近长十本都证严专科及取把，史车V求了内学消面医。 道程压积身边较指情好，算合些万适易什专，走影霸关作众矿包。速往么管数连铁他情活叫结道应，经很组走持八属S图族详发扯。 备矿真式中都器候青，验关的指图何厂，去治H管或完日。 题业门美证热走十极，而达制六形包验适，发于料生间办用装，该得五隶其形头。 劳华片西热其效由些许类，办管格理方受个量做，装带3三候秀坊何。 严理真斯期为须使需历，结变分带维情安指，电道该值青声L别。 自思重省正系子布发不想还，已切术表酸来利天适义维毛，验千丽只去面称Y奋而。'
	},
	{
		id: 2,
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/69d7a12d750b4070a9fb63925330b1f0.jpg?style=st6',
		name: '六合仙鹤',
		number: 241,
		all: 600,
		price: 1242,
		createTime: '2023/01/11',
		checkStatus: 1,
		creatorId: 2,
		ownerId: 2,
		desc: '    里由小传龙始运京原约，队统两元此电前记除，一元U直件应事论。 识都的放事复见进不，但飞称F则见。 表门权集命道看义入场外体低明，步即易体查则6外事详文只。 好治元元复队二五，同解的边有只飞口，斗届养邮范新。'
	},
	{
		id: 3,
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/34d0ca713b7044c7b301bc9ef9b6416e.png?style=st6',
		name: '冰雪神兽-冰雪天鹅',
		number: 413,
		all: 500,
		price: 999,
		createTime: '2023/01/10',
		checkStatus: 1,
		creatorId: 2,
		ownerId: 2,
		desc: '  严如现识研行构须口流府，业开三科说新点外拉，安之届秃层照吵豆治。 化县事研商周百年格系应达，权前就车参育花现展家联，压圆承别导走林交科包。 火理称声书也众需务市结象件给，元头成起电X抛厕旷管秀。'
	},
	{
		id: 4,
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/32c62138bb4b4255a55c70632fc23a99.png?style=st6',
		name: 'CyberBull',
		number: 53,
		all: 521,
		price: 531,
		createTime: '2023/01/09',
		checkStatus: 1,
		creatorId: 2,
		ownerId: 2,
		desc: '办思深子新市些整它文，造她术连口半向后史，王体C听阶求时维。 研按元资利直地则华，者使活I内运。 达着转易色合热往，存然他团没系，员百M走过养。 按型要所济利存农作阶色学，你角着强G旷该管芽。 育身细都华总备很，育步最育率作统少，北杏层否步价。 连转然政因员与十，构是很易派会东，化计孟医花工成。'
	},
	{
		id: 5,
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/8f396502014f4ae8b875877d9ceff3d7.png?style=st6',
		name: '冰雪神兽-冰雪兔神',
		number: 4513,
		all: 5000,
		price: 499,
		createTime: '2023/01/09',
		checkStatus: 1,
		creatorId: 2,
		ownerId: 2,
		desc: '克社车律称位你目，会做证子争次，是地-主需系。 个政四近线活斗当场照信万术较构物，复育导品革习复屈至坑3盛亲段。 想自看长生式江反广战群，别三动很日3居省过。 四便生因当社花何，风到集种系斯至，特建共方构报。'
	},
	{
		id: 6,
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/deafb429825f43d7975c941cd28cee38.png?style=st6',
		name: 'CyberRabbit',
		number: 1156,
		all: 6000,
		price: 80,
		createTime: '2023/01/07',
		checkStatus: 1,
		creatorId: 2,
		ownerId: 2,
		desc: '回广内角包高阶理设法，形身格专金越性积，好及-给抗千般节。 达真石现来查程治酸，包然可群主光主受，争切E奋建1更。 三件系放间林该支究多结引指，史将美定新承之积V收。 看王人已原斗数低级干，原本别否所海般。 际育着斯取转统程有，增回律资东原表今，规然孟表听I住。 公都军动同示把整书需计，许风场具维Y镰男平。'
	},
	{
		id: 7,
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/4bdc464cf48e45c7bc4d1637842faf6e.jpg?style=st6',
		number: 515,
		name: '舞琴',
		all: 1000,
		price: 1299,
		createTime: '2023/01/14',
		checkStatus: 1,
		creatorId: 2,
		ownerId: 1,
		desc: '对上导进布程提精，县再并适广没养，局参N在动和外。 件近与育三土表，果西信用么在构，织更帐员址。 消命识金第很全合便何力，求万政回放花不界难象，关难F系卖列管快发。 与用增着等确见维场，起风劳行矿争化文团，山否T号究芦族。'
	}
]);

export interface UserInfo {
	id: number;
	name: string;
	chianAddress: string;
	avatar: string;
	following: number[];
	phone?: string;
	profile?: string;
	role?: string;
	pubKey?: string;
	priKey?: string;
	lastLoginTime?: string;
	createTime?: string;
}

//未审核藏品
export const userList = persisted<UserInfo[]>('userList', [
	{
		id: 1,
		name: 'jesse',
		chianAddress: '0x1234567890',
		phone: '1234567890',
		avatar:
			'https://static.ibox.art/file/oss/test/image/portrait/bfa8ba3852e9408ebab82341ead7c74e.jpg',
		following: [3],
		profile: '哈哈哈',
		role: 'admin',
		pubKey: '0x1234567890',
		priKey: '0x1234567890',
		lastLoginTime: '2023/05/13',
		createTime: '2023/01/01'
	},
	{
		id: 2,
		name: '马大哈',
		chianAddress: '0x145578194012',
		avatar:
			'https://static.ibox.art/file/oss/test/image/nft-goods/9fb9a8293a3941a7861f856638dade4d.png',
		following: [3],
		profile: '哈哈哈',
		phone: '1234567890',
		role: 'admin',
		pubKey: '0x1234567890',
		priKey: '0x7389123712',
		lastLoginTime: '2023/04/01',
		createTime: '2023/01/01'
	},
	{
		id: 3,
		name: '小雨',
		chianAddress: '0x151982813',
		avatar:
			'https://static.ibox.art/file/oss/test/image/portrait/3842ff4f575e44a0bd42db5a798ddd99.png?style=st',
		following: [],
		profile: '哈哈哈',
		phone: '1234567890',
		role: 'admin',
		pubKey: '0x1241a241231',
		priKey: '0x56345242341',
		lastLoginTime: '2023/04/02',
		createTime: '2023/01/01'
	}
]);

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const nftId = persisted('nftId', 7);

interface Message {
	id: number;
	messages: string;
	nftId: number;
	hasRead: boolean;
	isPass: boolean;
}
export const messages = persisted<Message[]>('message', [
	// {
	// 	id: 1,
	// 	messages: '您的藏品已经审核通过',
	// 	isPass: true,
	// 	nftId: 1,
	// 	hasRead: false
	// }
]);

export const mId = persisted('mId', 1);

export const balance = persisted('balance', 5234);

export interface Order {
	id: number;
	nftId: number;
	sellerId: number;
	price: number;
	createTime: string;
}

export const orderId = persisted('orderId', 1);
export const orderHistory = persisted<Order[]>('orderHistory', []);
