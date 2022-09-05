<script lang="ts">
    export let keyMedia;
    export let switchMedia;
    export let typeMedia; // discover | marvel | trending | null
</script>

<div class="selector">
    <h3 class="{keyMedia == 'movie' ? 'switch_active_' + typeMedia : '' }" on:click={() => switchMedia("movie", typeMedia)}>Films</h3>
    <h3 class="{keyMedia == 'tv' ? 'switch_active_' + typeMedia : '' }" on:click={() => switchMedia("tv", typeMedia)}>Séries</h3>
</div>

<style>
    .selector {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        align-content: center;
        border: 1px solid rgba(3,37,65, 1);
        border-radius: 30px;
        margin-left: 20px;
    }
    .selector h3 {
        padding: 4px 20px;
        margin-bottom: unset;
        font-size: 16px;
        cursor: pointer;
    }
    .switch_active_discover, .switch_active_anime, .switch_active_trending, .switch_active_marvel {
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border-radius: 30px;
        color: white;
    }
</style>