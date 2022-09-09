<script>
  import { Router, Route } from "svelte-navigator";
import AuthGuard from "./AuthGuard.svelte";
  
  import Navbar from "./components/partials/Navbar.svelte";
  import Lazy from "./Lazy.svelte";

  const Home = () => import("./pages/Home.svelte");
  const MovieDetails = () => import("./pages/MovieDetails.svelte");
  const ActorDetails = () => import("./pages/ActorDetails.svelte");
  const tvDetails = () => import("./pages/TvDetails.svelte");
  const Favorite = () => import("./pages/Favorite.svelte");
  const SearchPage = () => import("./pages/SearchPage.svelte");
  const SignPage = () => import("./pages/SignPage.svelte");
  const OwnFavorite = () => import("./pages/OwnFavorite.svelte");
  const Account = () => import("./pages/Account.svelte");

  export let url = ""; //This property is necessary declare to avoid ignore the Router
</script>

<Router url="{url}" primary={false}>
  <Navbar />
   <div id="app-block">
    <Route> <Lazy component="{Home}" /></Route>
    <Route path="home"> <Lazy component="{Home}" /> </Route>
     <Route path="movie-details/:id" let:params>
      <Lazy component={MovieDetails} {params} />
    </Route>
    <Route path="actor-details/:id" let:params>
      <Lazy component={ActorDetails} {params} />
    </Route>
    <Route path="tv-details/:id" let:params>
      <Lazy component={tvDetails} {params} />
    </Route>
    <Route path="favorites"> <Lazy component="{Favorite}" /> </Route>
    <Route path="search"> <Lazy component="{SearchPage}" /> </Route>
    <Route path="login-page"> <Lazy component="{SignPage}" /> </Route>

    <Route path="own-favorites">
      <AuthGuard>
        <Lazy component="{OwnFavorite}" />
      </AuthGuard>
    </Route>

    <Route path="account-page">
      <AuthGuard>
        <Lazy component="{Account}" />
      </AuthGuard>
    </Route>
   </div>
</Router>