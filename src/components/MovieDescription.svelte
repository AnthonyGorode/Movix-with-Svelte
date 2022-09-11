<script>
    import { Link } from "svelte-navigator";
    import { scale } from "svelte/transition";
	import { slide } from 'svelte/transition';

    import { innerWidthStore } from "../hooks/viewport.hook";

    export let movie;
</script>

<div 
    id="block-film-first" 
    style="background-image:url(https://image.tmdb.org/t/p/original{movie.backdrop_path});"
    in:slide
    out:scale={{delay: 200}}
>
    <div class={($innerWidthStore < 950) ? "block_film_tablet_view" : ($innerWidthStore < 750) ? "block_film_mobile_view" : "block_film_laptop_view"}>
        <div id="block-details">
            <h1 id="title-details" class={($innerWidthStore < 750) ? "title_details_mobile_view" : "title_details_laptop_view"}>
                {movie.title}
            </h1>
            <hr>
            <div id="content-details" class={($innerWidthStore < 750) ? "content_details_mobile_view" : "content_details_laptop_view"}>
                <p>{movie.vote_average.toFixed(1)}/10</p>
                <p>{new Date(movie.release_date).getFullYear()}</p>
            </div>
            <hr>
            <p id="description-details" class={($innerWidthStore < 750) ? "description_details_mobile_view" : "description_details_laptop_view"}>
                {#if $innerWidthStore < 750}
                    {movie.overview.substring(0, 200)} . . .
                {:else} 
                    {movie.overview.substring(0, 400)} . . . 
                {/if}
                <span id="voir-plus">
                    <Link to="/movie-details/{movie.id}" class="link_details">VOIR PLUS</Link>
                </span>
            </p>
        </div>
    </div>
</div>

<style>
    .block_film_laptop_view {
        display: flex;
        justify-content: center;
        color: white;
        width: 100vh;
        height: 70vh;
        align-items: center;
    }
    .block_film_mobile_view {
        display: flex;
        color: white;
        align-items: center;
    }
    
    .block_film_tablet_view {
        display: flex;
        color: white;
        align-items: center;
    }
    #block-film-first {
        background-size: cover;
        background-position: 100% 20%;
        background-repeat: no-repeat no-repeat;
        box-shadow: -3px 3px 2px 1px rgb(0 0 0 / 20%);
    }
    #block-film-first:hover {
        animation-duration: 1s;
        animation-timing-function:cubic-bezier(0.075, 0.82, 0.165, 1);
        animation-delay: 0s;
        animation-iteration-count: 1;
        animation-direction: normal;
        animation-fill-mode: both;
        animation-play-state: running;
        animation-name: animateDescriptionIn;
    }
    #block-film-first:not(:hover) {
        animation-duration: 1s;
        animation-timing-function:cubic-bezier(0.075, 0.82, 0.165, 1);
        animation-delay: 0s;
        animation-iteration-count: 1;
        animation-direction: normal;
        animation-fill-mode: both;
        animation-play-state: running;
        animation-name: animateDescriptionOut;
    }
    @keyframes animateDescriptionIn {
        0% {
            transform: scale(1.01);
            transform-origin: bottom right 40px;
        }
        100% {
            transform: scale(1.02);
            transform-origin: bottom right 60px;
        }
    }
    @keyframes animateDescriptionOut {
        0% {
            transform: scale(1.02);
            transform-origin: bottom right 60px;
        }
        100% {
            transform: scale(1.01);
            transform-origin: bottom right 40px;
        }
    }

    #block-details {
        background: linear-gradient(rgba(27.45%, 22.75%, 19.22%, 0.60), rgba(27.45%, 22.75%, 19.22%, 0.60), rgba(27.45%, 22.75%, 19.22%, 0.60));
        padding: 30px;
        border-radius: 100px;
        margin: 10px;
    }
    .title_details_laptop_view {
        text-align: center;
        text-shadow: 0 0 4px white, 0 -5px 4px #ffff33, 2px -10px 6px #ffdd33, -2px -15px 11px #ff8800, 2px -25px 18px #ff2200;
        color: #000;
    }
    .title_details_mobile_view {
        text-align: center;
        font-size: 16px;
        text-shadow: 0 0 4px white, 0 -5px 4px #ffff33, 2px -10px 6px #ffdd33, -2px -15px 11px #ff8800, 2px -25px 18px #ff2200;
        color: #000;
    }
    .content_details_laptop_view {
        font-size: 30px;
    }
    .content_details_mobile_view {
        font-size: 15px!important;   
    }
    .description_details_laptop_view {
        font-size: 15px;
    }
    .description_details_mobile_view {
        font-size: 12px!important;
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