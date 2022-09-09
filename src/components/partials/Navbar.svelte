<script lang="ts">
    import {
      Collapse,
      Navbar,
      NavbarToggler,
      NavbarBrand,
      Nav,
      NavItem,
      NavLink,
      Dropdown,
      DropdownItem,
      DropdownToggle,
      DropdownMenu
    } from 'sveltestrap';

    import { onMount } from "svelte"; 
    import { link, useLocation, navigate } from "svelte-navigator";
    import { onAuthStateChanged } from 'firebase/auth';

    import { auth } from "../../../firebase";
    import { authStore } from "../../hooks/auth.hook";
    import { logOut } from '../../services/auth';

    const location = useLocation();

    let isOpen = false;

    $: console.log($authStore);

    onMount(() => {
      onAuthStateChanged(auth,
        (user) => {
          if(user) {
            const { uid, displayName, email, metadata } = user;
            console.log(user);
            authStore.set({uid, displayName, email, data: {metadata}});
          }
        },
        error => {
          $authStore = {uid: null, displayName: null, email: null, data: {
          creationTime: null
      }};
          console.error(error);
        }
      );
    });

    const signOutUser = async() => {
      try {
        await logOut();
        $authStore = {uid: null, displayName: null, email: null, data: {
            creationTime: null
        }};
        {navigate("/home", {replace: true})};
      } catch (error) {
        console.error(error);
      }
    }
  
    function handleUpdate(event) {
      isOpen = event.detail.isOpen;
    }
  </script>
  <div id="navbar">
    <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/"><div id="title-app"> Movix <img id="navbar-svelte-logo" src="/images/Svelte_logo.png" alt="logo svelte" /></div></NavbarBrand>
      <NavbarToggler on:click={() => (isOpen = !isOpen)} />
      <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
        <Nav navbar>
          <NavItem>
              <NavLink>
                <a href="/home" class={($location.pathname == "/home" || $location.pathname == "/" ) ? "focus" : "page"} use:link>Accueil</a>
              </NavLink>
          </NavItem>
          {#if $authStore.uid }
            <NavItem>
                <NavLink>
                    <a href="/own-favorites" class={($location.pathname == "/own-favorites") ? "focus" : "page"} use:link>Mes Favoris</a>
                </NavLink>
            </NavItem>
          {:else}
            <NavItem>
              <NavLink>
                <a href="/favorites" class={($location.pathname == "/favorites") ? "focus" : "page"} use:link>Favoris</a>
              </NavLink>
            </NavItem>
          {/if}
        </Nav>
        <Nav class="ms-auto">
          <NavItem>
            <NavLink>
                <a href="/search" class="search" use:link><img src="/images/logo-search.png" alt="search logo" title="Rechercher"></a>
            </NavLink>
        </NavItem>

        {#if $authStore.uid }
          <div id="dropdown-account">
            <Dropdown nav {isOpen} toggle={() => (isOpen = !isOpen)}>
              <DropdownToggle nav caret>{$authStore.displayName}</DropdownToggle>
              <DropdownMenu>
                <DropdownItem><a href="/account-page" id="account-link" use:link>Compte</a></DropdownItem>
                <DropdownItem divider />
                <DropdownItem on:click={signOutUser}><img class="logout_logo" src="/images/logout_user_account.webp" alt="logout"> Deconnexion</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        {:else}       
          <NavItem>
            <NavLink>
                <a href="/login-page" class={($location.pathname == "/login-page") ? "focus" : "page"} use:link>Connexion</a>
            </NavLink>
          </NavItem>
        {/if}
        </Nav>
      </Collapse>
    </Navbar>
  </div>
  
<style>
  #dropdown-account :global(a) {
    color: white;
    text-decoration: none;
  }
  #dropdown-account :global(div.dropdown-menu) {
    left: -50px;
  }
  #dropdown-account :global(button.dropdown-item) {
    text-align: center;
  }
  #title-app {
    display: flex;
    align-items: center;
  }
  #title-app:hover > img {
    animation-duration: 2s;
    animation-timing-function:cubic-bezier(0.075, 0.82, 0.165, 1);
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: both;
    animation-play-state: running;
    animation-name: rotate360;
  }
  #navbar-svelte-logo {
    margin-left: 2px;
    width: 20px;
  }
  .focus {
    font-family: 'Bungee Inline';
    color: white;
    text-decoration: none;
    font-size: 20px;
  }
  .page:hover {
    animation-duration: 1s;
    animation-timing-function:cubic-bezier(0.075, 0.82, 0.165, 1);
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: both;
    animation-play-state: running;
    animation-name: animatefontIn;

    color: white;
  }
  .page:not(:hover) {
    animation-duration: 1s;
    animation-timing-function:cubic-bezier(0.075, 0.82, 0.165, 1);
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: both;
    animation-play-state: running;
    animation-name: animatefontOut;

    color: white;
  }
  @keyframes animatefontIn {
    0% {
      font-size: 16px;
    }
    60% {
      font-size: 20px;
    }
    100% {
      font-family: 'Bungee Inline';
    }
  }
  @keyframes animatefontOut {
    0% {
      font-size: 20px;
    }
    60% {
      font-size: 16px;
    }
    100% {
      font-size: initial;
    }
  }

  .search {
    padding: unset;
    text-decoration: none;
    color: white;
  }
  .search img {
    width: 30px;
  }
  .search img:hover {
    animation-duration: 2s;
    animation-timing-function:cubic-bezier(0.075, 0.82, 0.165, 1);
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: both;
    animation-play-state: running;
    animation-name: rotate360;
  }

  @keyframes rotate360 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .logout_logo {
    width: 20px;
  }
  #account-link {
    color: black!important;
  }
</style>