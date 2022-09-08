<script>
    import { navigate } from "svelte-navigator";
    import { authStore } from "./hooks/auth.hook";

  </script>
  
  {#if $authStore && typeof $authStore == "object" && $authStore.hasOwnProperty("uid")}
    <slot {...$$restProps} />
  {:else}
    {navigate("/login-page", {replace: true})};
  {/if}
  