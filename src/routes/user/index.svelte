<script lang="ts">
  import { auth } from '@/client/stores/auth';

  type FormSubmitEvent = Event & {
    currentTarget: EventTarget & HTMLFormElement;
  };
  async function login(e: FormSubmitEvent) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    await auth.login(data.get('token') as string);
  }
  async function logout(e: FormSubmitEvent) {
    e.preventDefault();
    auth.logout();
  }
</script>

<svelte:head>
  <title>User Login</title>
</svelte:head>
{#if $auth.token}
  <main>
    <div class="info">
      <h2>Welcome back {$auth.name}</h2>
      <form action="/api/user/logout" method="POST" on:submit={logout}>
        <button>Logout</button>
      </form>
    </div>
    {#if $auth.isAdmin}
      <a href="/admin/tokens" class="link">
        <button>User Tokens</button>
      </a>
    {/if}
    {#if $auth.isMod}
      <a href="/admin/schematic_changes" class="link">
        <button>Schematic Changes</button>
      </a>
    {/if}
  </main>
{:else}
  <form action="/api/user/login" method="POST" class="login" on:submit={login}>
    <input name="token" type="password" placeholder="Enter your token here..." required />
    <button> Login </button>
  </form>
{/if}

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
  }
  div.info {
    display: flex;
    justify-content: center;
    gap: 1em;
    align-items: center;
  }
  a.link {
    align-self: center;
  }
  form.login {
    display: flex;
    padding: 1rem;
    gap: 1rem;
    justify-content: center;
  }
  form.login input {
    background-color: var(--surface);
    border-radius: 0.5em;
    padding: 0.5em;
    border: 2px solid #888888;
    color: var(--on-surface);
    max-width: 50vw;
    width: 15rem;
  }
</style>
