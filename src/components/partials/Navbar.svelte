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

    import { Link } from "svelte-navigator"
  
    let isOpen = false;
  
    function handleUpdate(event) {
      isOpen = event.detail.isOpen;
    }
  </script>
  
  <Navbar color="dark" dark expand="md">
    <NavbarBrand href="/">Movix</NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
      <Nav navbar>
        <NavItem>
            <NavLink>
              <Link to="/home" class="page">Accueil</Link>
            </NavLink>
        </NavItem>
        <NavItem>
            <NavLink>
                <Link to="/favorites" class="page">Favoris</Link>
            </NavLink>
        </NavItem>
      </Nav>
    </Collapse>
  </Navbar>
  
