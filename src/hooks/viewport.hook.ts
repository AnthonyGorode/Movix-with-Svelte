import { writable } from 'svelte/store';

let innerWidth: number = 0; 
let innerHeight: number = 0; 
export const innerWidthStore = writable(innerWidth);
export const innerHeightStore = writable(innerHeight);
