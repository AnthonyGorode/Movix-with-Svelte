<script>
    export let component;
    export let params = {};
</script>
  
  {#await component.then ? component : component() then resolvedComponent}
    <svelte:component this={resolvedComponent.default} {params} />
  {/await}