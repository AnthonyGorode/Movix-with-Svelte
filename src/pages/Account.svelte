<script lang="ts">
    import { onMount } from "svelte";
    import { scale } from 'svelte/transition';

    import { authStore } from "../hooks/auth.hook";

    import moment from "../services/utils/momentCustom";

    let fullName: string[] = [];
    onMount(() => {
        if($authStore.displayName != null) {
            fullName = $authStore.displayName.split(" ");
        }
    });

</script>

<div id="block-account" out:scale={{delay: 200}}>
    <h2>Mon Profil</h2>
{#if $authStore.displayName != null}
    <h4>Nom</h4>
    <p>{ fullName[1] }</p>

    <h4>Prénom</h4>
    <p>{ fullName[0] }</p>

    <h4>Adresse email</h4>
    <p>{ $authStore.email }</p>

    <h4>Compte crée le :</h4>
    <p>{ moment($authStore.data?.metadata?.creationTime).format("LLL")}</p>
{/if}
</div>

<style>
    #block-account {
        margin: auto;
        margin-top: 50px;
        width: 30%;
        border: 1px solid #d5d5d5;
        box-shadow: 10px 5px 5px grey;
        border-radius: 10px;
        padding: 20px;
        transform-origin: bottom right 40px;
        transition: all 0.5s ease;
    }
    #block-account:hover {
        transform: scale(1.04);
    }

    h2 {
        font-family: 'Bungee Inline', cursive;
        text-align: center;
        color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        font-size: 2.5rem;
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-weight: 500;
        line-height: 1.2;
    }
</style>