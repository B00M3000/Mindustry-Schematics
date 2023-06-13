<!-- @component
Exposes a `--bottom-bar-height` and a `--bottom-bar-filler-height` variable to set the height of the spacer 
  -->
<script lang="ts">
  let class_name = '';
  export { class_name as class };
</script>

<div class="spaced {class_name}" />
<div class="floating {class_name}">
  <slot />
</div>

<style>
  .floating {
    position: fixed;
    bottom: 0;
    display: flex;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px);
    color: var(--on-surface);
    width: 100%;
    padding: 0.5rem;
    gap: 1em;
    z-index: 10;
    justify-content: center;
    align-items: center;
    height: var(--bottom-bar-height);
  }

  .spaced {
    padding: 0;
    margin: 0;
    height: var(--bottom-bar-filler-height, var(--bottom-bar-height));
  }
</style>
