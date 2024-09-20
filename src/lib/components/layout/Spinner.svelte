<script lang="ts">
	import { people, showPeopleButton } from '$lib/stores/people';
	import { onMount } from 'svelte';
	import { fade, fly, scale, slide } from 'svelte/transition';
	import { Howl, Howler } from 'howler';
	import prompts from '../../data/prompts/default.json';
	import Button from '../ui/button/button.svelte';
	import { browser } from '$app/environment';

	let namesArray: any[] = [];
	let current = 0;
	let finished = false;
	let started = false;
	let chosen: null | 'truth' | 'dare' = null;
	let promptDisplay = '';
	let interval: number;
	let animDuration = 150;
	let intervalTime = 125;
	let finalName = $people[Math.floor(Math.random() * $people.length)];

	$: $showPeopleButton = !started || chosen !== null;

	$: {
		for (let i = 0; i < 10; i++) {
			namesArray = [...namesArray, ...$people];
		}
	}
	var sound = new Howl({
		src: ['/click.mp3'],
		autoplay: false,
		volume: 0.2
	});

	let _speechSynth: SpeechSynthesis;
	let _voices: Array<SpeechSynthesisVoice>;

	function next() {
		finished = false;
		current = 0;
		chosen = null;
		animDuration = 150;
		intervalTime = 125;
		finalName = $people[Math.floor(Math.random() * $people.length)];
		updateSpinner();
	}

	$: {
		if (browser) {
			if (chosen) {
				if (chosen === 'truth') {
					document.querySelector('meta[name="theme-color"]')!.setAttribute('content', '#3b82f6');
				} else {
					document.querySelector('meta[name="theme-color"]')!.setAttribute('content', '#ef4444');
				}
			} else {
				if (finished) {
					document.querySelector('meta[name="theme-color"]')!.setAttribute('content', '#3b82f6');
				} else {
					document.querySelector('meta[name="theme-color"]')!.setAttribute('content', '#fff');
				}
			}
		}
	}

	onMount(() => {
		function loadVoicesWhenAvailable(onComplete = () => {}) {
			_speechSynth = window.speechSynthesis;
			const voices = _speechSynth.getVoices();

			if (voices.length !== 0) {
				_voices = voices;
				onComplete();
			} else {
				return setTimeout(function () {
					loadVoicesWhenAvailable(onComplete);
				}, 100);
			}
		}
		loadVoicesWhenAvailable();
	});

	function updateSpinner() {
		if (current > 15) {
			if (namesArray[current] == finalName) {
				clearInterval(interval);
				setTimeout(() => (finished = true), 100);
				let utterance = new SpeechSynthesisUtterance(`${finalName.name}, truth or dare?`);
				_speechSynth.speak(utterance);
				return;
			}
		}
		console.log(_voices);
		current++;
		animDuration += 2;
		intervalTime += 3;
		sound.play();
		setTimeout(updateSpinner, intervalTime);
	}

	function promtMe(type: 'truth' | 'dare') {
		function randomPerson() {
			const filteredPeople = $people.filter((person) => person !== finalName);
			console.log(filteredPeople);
			const randomPersonIndex = Math.floor(Math.random() * filteredPeople.length);

			return filteredPeople[randomPersonIndex].name;
		}

		const replacements: {
			query: string;
			handler: Function;
		}[] = [
			{
				query: 'ranPerson',
				handler: randomPerson
			}
		];
		const filteredPromts = prompts.filter((prompt) => prompt.type == type);
		const randomIndex = Math.floor(Math.random() * filteredPromts.length);
		const randomPromt = filteredPromts[randomIndex];

		let toBepromtDisplay = randomPromt.prompt;

		replacements.forEach((replacement) => {
			toBepromtDisplay = toBepromtDisplay.replace(
				'?{' + replacement.query + '}',
				replacement.handler()
			);
		});

		chosen = type;

		let utterance = new SpeechSynthesisUtterance(toBepromtDisplay);
		_speechSynth.speak(utterance);

		promptDisplay = toBepromtDisplay;
	}
</script>

<div
	class="h-full flex flex-col w-full justify-center transition-all fixed m-auto inset-0 bg-white"
>
	{#if finished && !chosen}
		<div in:fly={{ x: -100, duration: 200, delay: 50 }} class="relative flex flex-col flex-grow">
			{#if chosen === 'truth'}
				<div class="text-3xl flex-grow flex items-center h-full" out:fade>{promptDisplay}</div>
			{:else if !chosen}
				<button
					on:click={() => promtMe('truth')}
					out:fade
					class="-rotate-3 absolute bottom-0 right-0 w-[200%] h-[200%] text-4xl font-medium text-left px-10 bg-blue-500 hover:bg-blue-600 transition-all text-white flex-grow"
				></button>
				<div
					class="p-20 z-20 absolute font-medium top-0 left-0 text-4xl -rotate-3 text-white pointer-events-none"
				>
					Truth
				</div>
			{/if}
		</div>
		<div class="h-10"></div>
	{/if}
	{#if started}
		<button
			in:fly={{ duration: 500, y: 200, delay: 0 }}
			class="w-full transition-all duration-200 {chosen !== null
				? 'absolute top-0 h-24 translate-y-0 ' + (chosen === 'truth' ? 'bg-blue-500' : 'bg-red-500')
				: 'top-1/2 h-10 -translate-y-1/2 duration-0'}"
			on:click={() => {
				_speechSynth.speak(new SpeechSynthesisUtterance(``));
			}}
		>
			<div class="relative h-full w-full">
				{#key current}
					<div
						class="absolute z-20 flex items-center justify-center h-full left-0 right-0 text-center
						{chosen != null ? 'text-white' : 'text-black'}
						{finished && !chosen ? '-rotate-3' : ''} {finished
							? 'text-6xl font-bold'
							: 'text-4xl font-medium'} transition-all delay-0 duration-300 w-full text-center"
						in:fly={{ y: 40, duration: animDuration }}
						out:fly={{ y: -40, duration: animDuration }}
					>
						{namesArray[current].name}
					</div>
				{/key}
			</div>
		</button>
	{:else}
		<button
			class="text-3xl font-bold"
			on:click={() => {
				setTimeout(updateSpinner, 0);
				started = true;
			}}>SPIN</button
		>
	{/if}
	{#if finished && !chosen}
		<div in:fly={{ x: 100, duration: 200, delay: 100 }} class="flex flex-col flex-grow relative">
			{#if chosen === 'dare'}
				<div class="text-3xl flex-grow flex items-center">{promptDisplay}</div>
			{:else if !chosen}
				<button
					on:click={() => promtMe('dare')}
					
					class="text-4xl absolute top-0 left-0 w-[200%] h-[200%] -rotate-3 font-medium text-right flex justify-end items-center px-10 bg-red-500 hover:bg-red-600 transition-all text-white flex-grow"
				>
				</button>
				<div
					class="px-20 py-32 z-20 absolute font-medium bottom-0 right-0 text-4xl -rotate-3 text-white pointer-events-none"
				>
					Dare
				</div>
			{/if}
		</div>
	{/if}
	{#if chosen}
		<div
			class="flex-grow flex items-center justify-center text-center px-4"
			in:fly={{ duration: 200, y: 100, delay: 100 }}
		>
			<div class="text-4xl">{promptDisplay}</div>
		</div>
		<div class="fixed bottom-0 left-0 right-0 flex justify-center items-center h-24 py-2">
			<Button
				on:click={() => next()}
				class="h-[80%] {chosen === 'truth'
					? 'bg-blue-500 hover:bg-blue-600'
					: 'bg-red-500 hover:bg-red-600'} rounded-full px-10 text-xl">Next</Button
			>
		</div>
	{/if}
</div>

<style>
	.top-btn {
		clip-path: polygon(
			0 0,
			/* left top */ 100% 0,
			/* right top */ 100% 90%,
			/* right bottom */ 0 100%,
			/* left bottom */ 0 90%
		);
	}
	.bottom-btn {
		clip-path: polygon(0 10%, 100% 0, 100% 100%, 0% 100%);
	}
</style>
