import { writable } from 'svelte/store';

export const isLogin = writable(false);

export const isLoading = writable(false);

export const homeNftList = writable([
	{
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/167f08459056401d8206cfc80b4e799e.png?style=st6',
		name: '凌霄殿',
		number: 413,
		all: 500,
		price: 999,
		createTime: '2023-01-12'
	},
	{
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/69d7a12d750b4070a9fb63925330b1f0.jpg?style=st6',
		name: '六合仙鹤',
		number: 241,
		all: 600,
		price: 1242,
		createTime: '2023-01-11'
	},
	{
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/34d0ca713b7044c7b301bc9ef9b6416e.png?style=st6',
		name: '冰雪神兽-冰雪天鹅',
		number: 413,
		all: 500,
		price: 999,
		createTime: '2023-01-10'
	},
	{
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/32c62138bb4b4255a55c70632fc23a99.png?style=st6',
		name: 'CyberBull',
		number: 53,
		all: 521,
		price: 531,
		createTime: '2023-01-09'
	},
	{
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/8f396502014f4ae8b875877d9ceff3d7.png?style=st6',
		name: '冰雪神兽-冰雪兔神',
		number: 4513,
		all: 5000,
		price: 499,
		createTime: '2023-01-09'
	},
	{
		img: 'https://static.ibox.art/file/oss/test/image/nft-goods/deafb429825f43d7975c941cd28cee38.png?style=st6',
		name: 'CyberRabbit',
		number: 1156,
		all: 6000,
		price: 80,
		createTime: '2023-01-07'
	}
]);

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
