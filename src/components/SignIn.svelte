<script lang="ts">
    import { FormGroup, Input, Alert } from 'sveltestrap';
    import Spinner from './Spinner.svelte';

    export let signInUser;
    export let signInValues;
    export let switchForm;
    export let loading;

    export let errorMessage;
  </script>
<h2>Connexion</h2>
<form on:submit|preventDefault={signInUser}>
    <FormGroup floating label="Adresse email">
      <Input type="email" name="email" placeholder="exemple : johndoe@gmail.com" bind:value={signInValues.email} />
    </FormGroup>

    <FormGroup floating label="Mot de passe">
        <Input  type="password" name="password" placeholder="mot de passe" bind:value={signInValues.password} />
    </FormGroup>

    {#if loading}
        <Spinner 
            widthSpin={30} 
            heightSpin={30}
            borderSpin={8}
            borderTopSpin={8}
            borderRadiusSpin={50}
        />
    {:else}
        <button
        class={
            (!signInValues.email || !signInValues.password) ? "disabled" : "sign_in"
        }
        disabled={
        (!signInValues.email || !signInValues.password) ? true : false
        }>Se Connecter</button>
        
        {#if errorMessage}
        <Alert color="danger" fade={false} dismissible>
            {errorMessage}
        </Alert>
        {/if}

        <p on:click={switchForm}>Pas Encore inscrit ?</p>
    {/if}
</form>

<style>
    button {
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border: 1px solid #00000033;
        border-radius: 10px;
        padding: 5px;
        color: white;
        margin-bottom: 10px;
    }
    .sign_in:hover {
        background-color: white;
        color: rgba(27.45%, 22.75%, 19.22%, 0.88);
    }

    p {
        color: blue;
    }
    p:hover {      
        text-decoration: underline;
        cursor: pointer;
    }
    .disabled {
        background-color: rgb(70 58 49 / 15%);
    }
</style>