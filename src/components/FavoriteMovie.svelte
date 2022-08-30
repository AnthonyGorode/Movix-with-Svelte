<script lang="ts">
    import { Button } from 'sveltestrap';
	import { slide } from 'svelte/transition';

    export let poster_path: string;
    export let documentId: string;
    export let index: number;

    export let displayMovie;
    export let removeMovie;

    // const reloadImage = (pThis, poster_path) => {
    //     // To prevent this from being executed over and over
    //     pThis.onerror = null; 
        
    //     // Refresh the src attribute, which should make the
    //     // browsers reload the iamge.
    //     pThis.src = poster_path;
        
    //     console.log(pThis);

    //     return pThis;
    // }
</script>

<div class="block_image">
    <img
        on:click={() => displayMovie(documentId)}
        src="https://image.tmdb.org/t/p/w500{poster_path}" 
        alt="poster film"
        loading="lazy"
        in:slide
    >
    <Button outline color="danger" on:click={() => removeMovie(index)}>Supprimer</Button>
</div>

<style>
    .block_image {
        border: 1px solid rgba(0,0,0,.125);
        border-radius: 10px;
        box-shadow: 10px 5px 5px #483e3e;
        margin: 5px;
        cursor: pointer;
    }
    img {
        width: 300px;
        height: 360px;
        border-radius: 10px;

        background-size: cover;
        background-position: center;
        transition: all 0.5s ease;
    }
    img:hover {
        transform: scale(1.04);
    }
    .block_image > :global(button) {
        width: 300px;
        margin-top: 10px;
    }
</style>
