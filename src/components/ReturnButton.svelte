<script lang="ts">
    export let returnPreviousPage;
</script>

<div id="return-button" on:click={returnPreviousPage}>
    <img src="/images/arrow-left.png" alt="Retour" srcset="" >
    <p>Retour</p>
</div>

<style>
    #return-button {
        display: flex;
        position: absolute;
        align-items: center;
        cursor: pointer;
    }

    #return-button img {
        height: 50px!important;
        box-shadow: none!important;
    }
    p {
        background-color: black;
        color: white;
        font-size: 16pt;
        font-family: Arial, sans-serif;
        margin-bottom: inherit;
        padding: 5px;
        border-radius: 15px;
    }

    @keyframes slidein {
        from { margin-left: -10%; }
        to   { margin-left: 0%; }
    }

    @keyframes slideout {
        from { 
            margin-left: 0%; 
            visibility: visible;
        }
        to   { 
            margin-left: -10%; 
            visibility: hidden;
        }
    }

    #return-button > p {
    visibility: hidden;
    }
    #return-button:hover > p {
        visibility: visible;
        animation: 1s slidein;
    }
    #return-button:not(:hover) > p {  
        animation: 1s slideout;
    }
</style>