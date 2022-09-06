<script lang="ts">
    import {
      Collapse,
      Navbar,
      NavbarToggler,
      NavbarBrand,
      Nav,
      NavItem,
      NavLink
    } from 'sveltestrap';

    import { link, useLocation } from "svelte-navigator";

    const location = useLocation();
    let path: string;

    let isOpen = false;
  
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
          <NavItem>
              <NavLink>
                  <a href="/favorites" class={($location.pathname == "/favorites") ? "focus" : "page"} use:link>Favoris</a>
              </NavLink>
          </NavItem>
        </Nav>
        <Nav class="ms-auto">
          <NavItem>
            <NavLink>
                <a href="/search" class="search" use:link><img src="/images/logo-search.png" alt="search logo" title="Rechercher"></a>
            </NavLink>
        </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  </div>
  
<style>
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
</style>