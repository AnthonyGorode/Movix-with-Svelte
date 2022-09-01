<script lang="ts">
    import { scale, fade } from "svelte/transition";

    export let documentId: string;
    export let isFavorite: boolean;

    export let addMediaToFavorite;
    export let deleteMediaToFavorite;

    const animate = (node, args) =>
		args.cond ? scale(node, args) : fade(node, args);

</script>

{#if isFavorite}
    <button id="btn-added" on:click={ () => deleteMediaToFavorite(documentId) }>
        <img class="logo" src="/images/valid-logo.png" alt="logo valid" transition:animate={{ cond: isFavorite }} />
    </button>
{:else}
    <button id="btn-favorite" on:click= {() => addMediaToFavorite() }>
        <img class="logo" src="/images/plus-logo.png" alt="logo plus" />
    </button>
{/if}


<style>
    #btn-favorite, #btn-added {    
        border: 1px solid transparent;
        background-color: transparent;
    }
    #btn-added {
        width: 50px;
    }
    #btn-added img, #btn-favorite img {
        width: 50px!important;
        height: 50px!important;
        box-shadow: none!important;
    }
</style>