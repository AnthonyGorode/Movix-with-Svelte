<script>
    export let actorDetails;
</script>
<div id="actor-details">
    <div id="actor-credentials">
        <img src="https://image.tmdb.org/t/p/original{actorDetails.profile_path}" alt="{actorDetails.name}" id="actor-photo">
        <div id="actor-identity">
            <div id="actor-name">{actorDetails.name}</div>
            <hr>
            <!-- {#if actorDetails.also_known_as}
                <div id="actor-others-names">Autre noms : {actorDetails.also_known_as.toString()}</div>
            {/if} -->
            <div id="actor-birthday">
                née le : {actorDetails.birthday}
                {#if !actorDetails.deathday}
                    ({(new Date().getFullYear()) - (new Date(actorDetails.birthday).getFullYear())} ans)
                {/if}
            </div>
            <div id="actor-place-birth">
                à {actorDetails.place_of_birth} 
            </div>
            <hr>
            {#if actorDetails.deathday}
                <div id="actor-deathday">
                    Mort le : {actorDetails.deathday} 
                    ({(new Date(actorDetails.deathday).getFullYear()) - (new Date(actorDetails.birthday).getFullYear())} ans)</div>    
            {/if}
        </div>
    </div>
    <hr>
    <p id="actor-overwiew">{actorDetails.biography}</p>
</div>

<style>
    #actor-birthday, #actor-place-birth, #actor-overwiew {
        color: white;
        font-size: large;

    }
    #actor-details {
        display: flex;
        flex-direction: column;
        padding: 10px;
        
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border: 1px solid rgba(0,0,0,.125);
        box-shadow: 10px 5px 5px grey;
        border-radius: 20px;
    }

    #actor-credentials {
        display: flex;
        gap: 10%;

    }
    #actor-name {
        font-family: 'Bungee Inline', cursive;
        text-align: center;

        font-size: 30px;
        color: white;
        /* text-shadow: 1px 0px 1px #CCCCCC, 0px 1px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 3px 2px 1px #CCCCCC, 2px 3px 1px #EEEEEE, 4px 3px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 5px 4px 1px #CCCCCC, 4px 5px 1px #EEEEEE, 6px 5px 1px #CCCCCC, 5px 6px 1px #EEEEEE, 7px 6px 1px #CCCCCC; */
    }
    #actor-photo {
        width: 250px;
        border-radius: 15px;
        height: 370px;
    }
    #actor-overwiew {
        padding: 10px;
        height: 200px;
        overflow-y: scroll;
    }
    #actor-overwiew::-webkit-scrollbar {
            width: 15px;
            background-color: #F5F5F5;
        } 
    #actor-overwiew::-webkit-scrollbar-thumb {
        border-radius: 20px;
        background: radial-gradient(#d4d4d4, rgba(27.45%, 22.75%, 19.22%, 0.88));
        box-shadow: 1px 1px 12px #555;
    } 
    #actor-overwiew::-webkit-scrollbar-track {
        border-radius: 10px;
        box-shadow: none;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #F5F5F5;
    } 
</style>