<script lang="ts">
	import { people } from '$lib/stores/people';
	import { Pencil, Trash2, Plus } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import PersonListItem from './PersonListItem.svelte';
	import { flip } from 'svelte/animate';
</script>

<div class="flex flex-col px-4 gap-1 h-[90%]">
	{#each $people as player, i (player.key)}
		<div animate:flip={{duration:150}}>
			<PersonListItem {i} bind:name={player.name} />
		</div>
	{/each}
    <div class="flex-grow"></div>
	<Button variant="ghost" on:click={people.addPlayer}>Add Player</Button>
</div>
