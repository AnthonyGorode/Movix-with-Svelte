<script lang="ts">
    import { FormGroup, Input, Alert } from 'sveltestrap';
    import Spinner from './Spinner.svelte';

    export let signUpUser;
    export let signInValues;
    export let switchForm;
    export let loading;

    export let errorMessage;
  </script>
<h2>Inscription</h2>
<form on:submit|preventDefault={signUpUser}>
    <FormGroup floating label="Nom">
        <Input type="text" name="text" placeholder="entrer votre nom" bind:value={signInValues.lastname} />
    </FormGroup>
    <FormGroup floating label="Adresse email">
        <Input type="text" name="email" placeholder="entrer votre prenom" bind:value={signInValues.firstname} />
    </FormGroup>
    <FormGroup floating label="Adresse email">
        <Input type="email" name="email" placeholder="exemple : johndoe@gmail.com" bind:value={signInValues.email} />
    </FormGroup>

    <FormGroup floating label="Mot de passe">
        <Input  type="password" name="password" placeholder="mot de passe" bind:value={signInValues.password} />
    </FormGroup>

    <FormGroup floating label="Ressaisissez le mot de passe">
        <Input  type="password" name="password" class={(signInValues.password && signInValues.isSamePassword && signInValues.password != signInValues.isSamePassword) ? "check-password" : ""} placeholder="mot de passe" bind:value={signInValues.isSamePassword} />
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
            (!signInValues.lastname || !signInValues.firstname || !signInValues.email || !signInValues.password || !signInValues.isSamePassword &&  signInValues.password || signInValues.isSamePassword && signInValues.password != signInValues.isSamePassword) ? "disabled" : "sign_up"
        }
        disabled={
        (!signInValues.lastname || !signInValues.firstname || !signInValues.email || !signInValues.password || !signInValues.isSamePassword &&  signInValues.password || signInValues.isSamePassword && signInValues.password != signInValues.isSamePassword) ? true : false
        }>Sinscrire</button>
    {/if}
    {#if errorMessage}
        <Alert color="danger" fade={false} dismissible>
            {errorMessage}
        </Alert>
    {/if}

    <p on:click={switchForm}><img class="return_logo" src="/images/arrow-left.png" alt="return sign In"> Retour</p>
</form>

<style>
    h2 {
        text-align: center;
    }
    button {
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border: 1px solid #00000033;
        border-radius: 10px;
        padding: 5px;
        color: white;
        margin-bottom: 10px;
    }
    .sign_up:hover {
        background-color: white;
        color: rgba(27.45%, 22.75%, 19.22%, 0.88);
    }
    form :global(input.check-password) {
        border: 1px solid red;
        box-shadow: 0 0 0 0.25rem rgb(253 13 78 / 25%);
    }

    p {
        color: blue;
        width: max-content;
    }
    p:hover {      
        text-decoration: underline;
        cursor: pointer;
    }
    .return_logo {
        width: 30px;
    }

    .disabled {
        background-color: rgb(70 58 49 / 15%);
    }
</style>