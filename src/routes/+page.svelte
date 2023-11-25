<script lang="ts">
	import { account } from '$lib/appwrite';
	import { authStore } from '$lib/stores';

	let email = '';
	let msg = '';

	$: isLoggedIn = $authStore !== null && $authStore !== undefined;

	async function signIn() {
		msg = 'Načítavam ...';
		try {
			await account.createMagicURLSession(
				'unique()',
				email,
				`${window.location.origin}/prihlaseni`
			);
			msg = 'E-mail byl odeslán. Kliknete na tlačidlo v e-mailu pri přihlásení.';
			email = '';
		} catch (err: any) {
			msg = 'Nastala chyba: ' + err.message;
		}
	}

	async function signOut() {
		msg = 'Odhlašuji ...';
		try {
			await account.deleteSession('current');
			await authStore.fetch();
			msg = '';
		} catch (err: any) {
			msg = 'Nastala chyba: ' + err.message;
		}
	}
</script>

<div class="max-w-6xl w-full mx-auto mt-24 px-4">
	<div class="flex flex-col items-center space-y-4">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="0.6"
			stroke="currentColor"
			class="w-32 h-32 text-blue-500"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
			/>
		</svg>

		<p class="text-5xl font-bold text-center">Seznam Přání</p>
		<p class="text-2xl text-blue-600 text-center">Sdílej svá přání s kýmkoli.</p>

		<div class="flex items-center flex-col space-y-3 pt-6 w-full justify-center mx-auto max-w-xl">
			{#if !isLoggedIn}
				<form on:submit={signIn} class="flex w-full flex-col space-y-3">
					<input
						required={true}
						bind:value={email}
						type="email"
						placeholder="E-mail"
						class="w-full rounded-2xl px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold text-lg"
					/>
					<button
						type="submit"
						class=" w-full rounded-2xl px-8 py-3 bg-blue-500 text-white font-semibold text-lg"
					>
						<p>Přihlásení přes E-mail</p>
					</button>
				</form>
			{:else}
				<div
					class="flex items-center sm:space-x-3 flex-col sm:flex-row space-y-3 sm:space-y-0 w-full"
				>
					<a href="/ucet" class="w-full">
						<button
							type="button"
							class=" w-full rounded-2xl px-8 py-3 bg-blue-500 text-white font-semibold text-lg"
						>
							<p>Můj seznam přání</p>
						</button></a
					>
					<button
						on:click={signOut}
						type="button"
						class=" w-full rounded-2xl px-8 py-3 bg-white text-gray-900 border font-semibold text-lg"
					>
						<p>Odhlásit se</p>
					</button>
				</div>
			{/if}
			{#if msg}
				<p class="pt-4 text-gray-600">{msg}</p>
			{/if}
		</div>
	</div>
</div>
