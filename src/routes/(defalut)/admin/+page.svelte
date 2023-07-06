<script lang="ts">
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { homeNftList, mId, messages } from '../../store';
	$: needCheck = $homeNftList.filter((item) => item.checkStatus == 0);

	// const popupFeatured1: PopupSettings = {
	// 	// Represents the type of event that opens/closed the popup
	// 	event: 'click',
	// 	// Matches the data-popup value on your popup element
	// 	target: 'popupFeatured12',
	// 	// Defines which side of your trigger the popup will appear
	// 	placement: 'bottom'
	// };

	let curImg = '';
	let curNftId = 0;
</script>

<slot />
