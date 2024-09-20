import { browser } from "$app/environment";
import { writable } from "svelte/store";

export function createPeopleStore() {
    const { subscribe, set, update } = writable([
        {
            name: "Player 1",
            key: 0,
        },
        {
            name: "Player 2",
            key: 1,
        },
        {
            name: "Player 3",
            key: 2,
        }
    ]);

    if(browser) {
        if(localStorage.getItem("people")) {
            set(JSON.parse(localStorage.getItem("people")!))
        }
    
        subscribe((people)=>{
            localStorage.setItem("people", JSON.stringify(people))
        })
    }
    

    return {
        subscribe,
        set,
        addPlayer: () => {
            update((players)=>[...players, {
                name: "Player",
                key: Date.now()
            }])
        },
        removePlayer: (i:number) => {
            update((players)=>players.toSpliced(i, 1))
        }
    }
}

export const people = createPeopleStore();

export const showPeopleButton = writable(true);