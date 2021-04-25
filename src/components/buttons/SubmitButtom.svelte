<script lang="ts">
	export let value = "Submit";
	
  function handleClick(){
    this.innerHTML = "Please wait..."
  }
</script>

<button on:click={handleClick}> {value} </button>

<style>
	
</style>