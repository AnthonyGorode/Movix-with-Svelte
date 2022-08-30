<script lang="ts">
    export let widthSpin: number;
    export let heightSpin: number;
    export let borderSpin: number;
    export let borderTopSpin: number;
    export let borderRadiusSpin: number;
</script>

<div
    id="spinner" 
    style="
        border: {borderSpin}px solid lightgrey;
        border-top: {borderTopSpin}px solid #212529;
        width: {widthSpin}px;
        height: {heightSpin}px;
        border-radius: {borderRadiusSpin}%;
    "
></div>

<style>
#spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
