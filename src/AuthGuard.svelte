<script lang="ts">
    import { navigate } from "svelte-navigator";
    import { authStore } from "./hooks/auth.hook";

    let initStore: boolean = false;
    setTimeout(() => initStore = true, 1200);

  </script>
    {#if initStore}
      {#if $authStore && typeof $authStore == "object" && $authStore.hasOwnProperty("uid") && $authStore.uid }
        <slot {...$$restProps} />
      {:else}
        {navigate("/login-page", {replace: true})};
      {/if}
    {:else}
      <div class="main_spinner">
        <img src="/images/loading_new.gif" alt="loading gif" >
      </div>
    {/if}