<script lang="ts">
    import { Link } from "svelte-navigator";
	import { slide } from 'svelte/transition';

    export let poster_path: string;
    export let id: number;
    export let media: string;
    export let title;
</script>

<style>
    .block_image {
        border: 1px solid rgba(0,0,0,.125);
        border-radius: 10px;
        box-shadow: 10px 5px 5px #483e3e;
        margin: 5px;
    }
    img {
        width: 300px;
        height: 360px;
        border-radius: 10px;
        transform-origin: bottom right 40px;
        background-size: cover;
        background-position: center;
        transition: all 0.5s ease;
    }
    img:hover {
        transform: scale(1.04);
    }
</style>

<div class="block_image">
    <Link to="/{media}-details/{id}">
        <!-- <div class="block_transparent"></div> -->
        <img 
            src={(poster_path) ? "https://image.tmdb.org/t/p/w500"+poster_path : "/images/no-media.jpg"}
            alt="{title} - poster"
            title="{title}"
            loading="lazy"
            in:slide
        >  
    </Link>
</div>
