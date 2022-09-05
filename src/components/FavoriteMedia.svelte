<script lang="ts">
    import { Button } from 'sveltestrap';
	import { slide } from 'svelte/transition';

    export let poster_path: string;
    export let documentId: string;
    export let index: number;

    export let title: string = "";
    export let fullName: string = "";
    export let typeMedia: string = "";

    export let displayMedia = (docId, media = "") => {};
    export let removeMedia = (doc_id) => {};
    export let removeMovie = (doc_id) => {};
    export let removeTv = (doc_id) => {};
    export let handleErrorImg = (pThis) => {};
</script>

<div class="block_image">
    <img
        on:click={() => displayMedia(documentId, typeMedia)}
        src="https://image.tmdb.org/t/p/w500{poster_path}"
        on:error={handleErrorImg}
        alt={(title) ? `${title} - poster` : `${fullName} - poster`}
        loading="lazy"
        in:slide
    >
    {#if fullName}
        <p id="full-name">{fullName}</p>
    {/if}
    {#if typeMedia == "movie"}
        <Button outline color="danger" on:click={() => removeMovie(index)}>Supprimer</Button>
    {:else if typeMedia == "tv"}
        <Button outline color="danger" on:click={() => removeTv(index)}>Supprimer</Button>
    {:else}
        <Button outline color="danger" on:click={() => removeMedia(index)}>Supprimer</Button>
    {/if}
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
    #full-name {
        text-align: center;
        margin-bottom: initial;
        font-size: 20px;
        font-weight: 900;
        color: white;
    }
</style>
