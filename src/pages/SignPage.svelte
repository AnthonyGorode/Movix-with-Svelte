<script lang="ts">
    import { navigate } from "svelte-navigator";

    import SignUp from "../components/SignUp.svelte";
    import SignIn from "../components/SignIn.svelte";

    import { authStore } from "../hooks/auth.hook";
    import { signIn, signUp } from "../services/auth";

    let signInValues = {lastname: null, firstname: null, email: null, password: null, isSamePassword: null};
    let errorMessage: string;

    let switchForm: boolean = false;
    let loadingForm: boolean = false;

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
            console.log(signInValues);

        if(valuesIsNotEmpty && passwordIsTheSame) {
            try {
                const user = signUp(signInValues.lastname, signInValues.firstname, signInValues.email, signInValues.password);
                if(user) $authStore = user;

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

<div id="block-form">
    {#if switchForm}
        <SignUp signInValues={signInValues} signUpUser={signUpUser} errorMessage={errorMessage} switchForm={changeSwitchForm} loading={loadingForm} />
    {:else}
        <SignIn signInValues={signInValues} signInUser={signInUser} errorMessage={errorMessage} switchForm={changeSwitchForm} loading={loadingForm} />
    {/if}
</div>

<style>
    #block-form {
        margin: auto;
        margin-top: 30px;
        width: 30%;
        border: 1px solid #d5d5d5;
        box-shadow: 10px 5px 5px grey;
        border-radius: 10px;
        padding: 20px;
    }
</style>