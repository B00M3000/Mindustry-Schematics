<script lang="ts">
  export let page: number;
  export let pages: number;
  export let documents: number;
  export let skip: number;
  export let pageSize: number;
</script>

Page {page} of {pages}, showing {skip + 1}-{skip + pageSize} of {documents}
