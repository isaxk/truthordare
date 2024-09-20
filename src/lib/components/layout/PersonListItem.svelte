<script lang="ts">
	import { people } from '$lib/stores/people';
	import { Pencil, Trash2, Check } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { fade, slide } from 'svelte/transition';

	export let i: number;
	export let name: string;

	let editMode = false;
</script>

<div class="py-2 px-2 border rounded flex items-center gap-1" transition:slide={{ duration: 150 }}>
	{#if editMode}
		<form class="flex gap-1 flex-grow" in:fade={{duration:150}}>
			<Input bind:value={name} class="flex-grow" autofocus on:blur={() => (editMode = false)}/>
			<Button type="submit" variant="ghost" on:click={() => (editMode = false)}><Check size={14} /></Button>
		</form>
	{:else}
		<div class="flex-grow text-lg pl-2">
			{name}
		</div>
		<div>
			<Button
				variant="ghost"
				on:click={() => {
					editMode = true;
				}}><Pencil size={14} /></Button
			>
			<Button
				variant="ghost"
				on:click={() => {
					people.removePlayer(i);
				}}><Trash2 size={14} /></Button
			>
		</div>
	{/if}
</div>
