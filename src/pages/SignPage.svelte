<script lang="ts">
    import { onMount } from "svelte";
    import { navigate } from "svelte-navigator";
    import { scale } from 'svelte/transition';

    import SignUp from "../components/SignUp.svelte";
    import SignIn from "../components/SignIn.svelte";

    import { authStore } from "../hooks/auth.hook";
    import { signIn, signUp } from "../services/auth";

    let signInValues = {lastname: null, firstname: null, email: null, password: null, isSamePassword: null};
    let errorMessage: string;

    let isDisconnected: boolean = false;
    let switchForm: boolean = false;
    let loadingForm: boolean = false;

    onMount(() => {
        setTimeout(() => {
            if($authStore.uid) {
                navigate("/account-page", {replace: true});
            } else {
                isDisconnected = true;
            }
        }, 1200);
    });

    const changeSwitchForm = () => {
        switchForm = !switchForm;
        signInValues= {lastname: null, firstname: null, email: null, password: null, isSamePassword: null};
    }

    const signInUser = async() => {
        loadingForm = true;
        try {
            let user;
            if(signInValues.email && signInValues.password) {
                user = await signIn(signInValues.email, signInValues.password);
                if (user) $authStore = user;

                navigate("/search", {replace: true});
            } else {
                errorMessage = "Veuillez remplir les champs.";
                setTimeout(() => errorMessage = null, 9000);
            }
        } catch (error) {
            errorMessage = error.message;
            setTimeout(() => errorMessage = null, 9000);
            console.error(error);
        }
        loadingForm = false;
    }

    const signUpUser = async() => {
        loadingForm = true;

        let valuesIsNotEmpty: boolean = (signInValues.lastname && signInValues.firstname && signInValues.email && signInValues.password) ? true : false;
        let passwordIsTheSame: boolean = (signInValues.password == signInValues.isSamePassword) ? true : false;


        if(valuesIsNotEmpty && passwordIsTheSame) {
            try {
                const user = await signUp(signInValues.lastname, signInValues.firstname, signInValues.email, signInValues.password);
                if(user) {
                    const { uid, displayName, email, metadata } = user.user;
                    $authStore = {uid, displayName, email, data: metadata};
                }

                navigate("/search", {replace: true});
            } catch (error) {
                console.error(error);
            }
        } else {
            errorMessage = "Veuillez remplir correctement les champs.";
            setTimeout(() => errorMessage = null, 9000);
        }

        loadingForm = false;
    }
</script>
{#if isDisconnected}
    <div id="block-form" out:scale={{delay: 200}}>
        {#if switchForm}
            <SignUp signInValues={signInValues} signUpUser={signUpUser} errorMessage={errorMessage} switchForm={changeSwitchForm} loading={loadingForm} />
        {:else}
            <SignIn signInValues={signInValues} signInUser={signInUser} errorMessage={errorMessage} switchForm={changeSwitchForm} loading={loadingForm} />
        {/if}
    </div>
{:else}
    <div class="main_spinner">
        <img src="/images/loading_new.gif" alt="loading gif" >
    </div>
{/if}

<style>
    #block-form {
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
    #block-form:hover {
        transform: scale(1.04);
    }

    @media (max-width: 980px) { /* TABLET */
        #block-form {
            width: 50%;
        }
    }

    @media (max-width: 600px) { /* MOBILE */
        #block-form {
            margin: unset;
            margin-top: 50px;
            width: unset;
        }
        #block-form :global(h2) {
            font-size: 1.9rem!important;
        }
    }

    #block-form :global(h2) {
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