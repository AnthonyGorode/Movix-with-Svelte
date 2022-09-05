<script>
    import { Link } from "svelte-navigator";
    import { scale } from "svelte/transition";
	import { slide } from 'svelte/transition';

    export let media;
    export let typeMedia;
</script>

<div 
    id="block-film-first" 
    style="background-image:url(https://image.tmdb.org/t/p/original{media.backdrop_path});"
    in:slide
    out:scale={{delay: 200}}
>
    <div style="display: flex;justify-content: center;color: white;width: 100vh; height: 100%;align-items: center;">
        <div id="block-details">
            <h1 id="title-details">
                { (typeMedia == "movie") ? media.title : media.name}
            </h1>
            <hr>
            <div id="content-details">
                <p>{media.vote_average.toFixed(1)}/10</p>
                {#if typeMedia == "movie"}
                    <p>{new Date(media.release_date).getFullYear()}</p>
                {:else}
                    <p>{new Date(media.first_air_date).getFullYear()}</p>

                    <p id="season-episodes-details">
                        <i>{media.number_of_seasons} saisons</i>
                        <i>{media.number_of_episodes} épisodes</i>
                    </p>
                {/if}
            </div>
            <hr>
            <p id="description-details">
                {media.overview.substring(0, 400)} . . . 
                <span id="voir-plus">
                    <Link to="/{typeMedia}-details/{media.id}" class="link_details">VOIR PLUS</Link>
                </span>
            </p>
        </div>
    </div>
</div>

<style>
    #block-film-first {
        background-size: cover;
        background-position: 100% 20%;
        background-repeat: no-repeat no-repeat;
        height: 70vh;
        box-shadow: -3px 3px 2px 1px rgb(0 0 0 / 20%);
    }
    #block-film-first:hover {
        transform: scale(1.01);
    }
    #block-details {
        background: linear-gradient(rgba(27.45%, 22.75%, 19.22%, 0.60), rgba(27.45%, 22.75%, 19.22%, 0.60), rgba(27.45%, 22.75%, 19.22%, 0.60));
        padding: 30px;
        border-radius: 100px;
    }
    #title-details {
        text-align: center;
        text-shadow: 0 0 4px white, 0 -5px 4px #ffff33, 2px -10px 6px #ffdd33, -2px -15px 11px #ff8800, 2px -25px 18px #ff2200;
        color: #000;
    }
    #season-episodes-details {
        display: flex;
        flex-direction: column;
        font-size: 20px;
    }
    #voir-plus {
        display: inline-block;
        width: 100px;
        height: 26px;
        text-align: center;
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border-radius: 15px;
        box-shadow: 1px 1px 12px #555;
        border: 1px ridge;

    }
    #voir-plus > :global(a) {
        color: white;
        font-weight: bold;
        font-family: revert;
        text-decoration: none;
    }
    #voir-plus:hover {
        background-color: white;
        border: 1px ridge rgba(27.45%, 22.75%, 19.22%, 0.88);
        text-decoration: underline;
    }
    #voir-plus > :global(a):hover {
        color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        font-family: 'Bungee Inline';
    }
</style>