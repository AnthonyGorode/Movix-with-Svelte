import { writable } from 'svelte/store';

let authValues: {uid: any, displayName: any, email: any, data: any} = {uid: null, displayName: null, email: null, data: null}
export const authStore = writable(authValues);
