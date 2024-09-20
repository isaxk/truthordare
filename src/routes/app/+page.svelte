<script lang="ts">
	import FloatingButton from '$lib/components/FloatingButton.svelte';
	import { Users, List } from 'lucide-svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import PeopleEditor from '$lib/components/layout/PeopleEditor.svelte';
	import Spinner from '$lib/components/layout/Spinner.svelte';
	import { people, showPeopleButton } from '$lib/stores/people';
	import { browser } from '$app/environment';

	let oldVal = '#fff';
	$: console.log(oldVal);

	function handleOpen(e) {
		console.log(e);
		if (browser) {
			if (e) {
				oldVal = document.querySelector('meta[name="theme-color"]')!.getAttribute('content') === "#000" ? oldVal :
					(document.querySelector('meta[name="theme-color"]')!.getAttribute('content') ?? '#fff');
				document.querySelector('meta[name="theme-color"]')!.setAttribute('content', '#000');
			} else {
				document.querySelector('meta[name="theme-color"]')!.setAttribute('content', oldVal);
			}
		}
	}
</script>

<div class="h-full flex flex-col m-auto">
	<div class="flex-grow flex items-center">
		{#key $people}
			<Spinner />
		{/key}
	</div>
	<div class="fixed bottom-0 w-full h-max p-4 flex justify-end pointer-events-none">
		<!-- <Drawer.Root>
			<Drawer.Trigger><FloatingButton icon={List} /></Drawer.Trigger>
			<Drawer.Content class="h-[90%]">
				<Drawer.Header>
					<Drawer.Title>Questions</Drawer.Title>
					<Drawer.Description>What questions do you want to see?</Drawer.Description>
				</Drawer.Header>
				<Drawer.Footer>
					<Drawer.Close>Done</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Root> -->

		{#if $showPeopleButton}
			<Drawer.Root onOpenChange={(e) => handleOpen(e)}>
				<Drawer.Trigger class="pointer-events-auto"><FloatingButton icon={Users} /></Drawer.Trigger>
				<Drawer.Content class="h-[90%]">
					<Drawer.Header>
						<Drawer.Title>Players</Drawer.Title>
						<Drawer.Description>Who's playing?</Drawer.Description>
					</Drawer.Header>
					<PeopleEditor />
					<Drawer.Footer>
						<Drawer.Close>Done</Drawer.Close>
					</Drawer.Footer>
				</Drawer.Content>
			</Drawer.Root>
		{/if}
	</div>
</div>
