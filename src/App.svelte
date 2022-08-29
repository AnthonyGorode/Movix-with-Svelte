<script>
  import { Router, Route } from "svelte-routing";
  // @ts-ignore
import Home from "./pages/Home.svelte";
  import Navbar from "./components/partials/Navbar.svelte";
  import MovieDetails from "./pages/MovieDetails.svelte";
import ActorDetails from "./pages/ActorDetails.svelte";
  export let url = ""; //This property is necessary declare to avoid ignore the Router
</script>

<Router url="{url}">
  <Navbar />
   <div>   
    <Route path="/"><Home /></Route>
    <Route path="/home"><Home /></Route>
     <Route path="movie-details/:id" component="{MovieDetails}" let:params>
        <MovieDetails id={params.id} />
    </Route>
    <Route path="actor-details/:id" component="{ActorDetails}" let:params>
        <ActorDetails id={params.id} />
    </Route> 
    
     <!--for now the router just support case sensitive,
         one workaround colud be add two time the route
         Example.
        <Route path="About" component="{About}" /> 
     -->
   </div>
</Router>
<!-- <script>
	import { onMount } from 'svelte';
	let characterName;

    onMount(async () => {
        const response = await fetch('https://swapi.dev/api/people/1');
        const character = await response.json();
        characterName = character.name;
    });
</script>

<main>
    {#if characterName === undefined}
        Loading Character Name...
    {:else}
        {characterName}
    {/if}
</main> -->