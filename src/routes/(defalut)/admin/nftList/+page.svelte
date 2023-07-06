<script lang="ts">
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { homeNftList, mId, messages, userList } from '../../../store';

	let curImg = '';
	let curNftId = 0;
</script>

<slot />
