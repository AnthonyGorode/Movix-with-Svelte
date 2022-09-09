import { writable } from 'svelte/store';

export const authStore = writable({uid: null});