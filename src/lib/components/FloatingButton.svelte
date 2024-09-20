<script lang="ts">
	import { createEventDispatcher, SvelteComponent } from 'svelte';

	export let icon: typeof SvelteComponent<any>;

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('click');
	}
</script>

<button on:click={handleClick} class="bg-blue-400 drop-shadow-2xl p-5 rounded-full text-white"><svelte:component this={icon}></svelte:component></button>
