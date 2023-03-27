export default function Auth() {

  const handleAuthorize = () => {
    // Construct the URL to the Bitbucket authorization page
    const baseUrl = 'https://bitbucket.org/site/oauth2/authorize';
    const redirectUri = 'https://gcscruncsql-k7jns52mtq-el.a.run.app/authorise_bitbucket_consumer'; // Change this to the orginal redirecturi
    const scopes = 'repository';
    const clientId = process.env.NEXT_PUBLIC_BITBUCKET_OAUTH_CLIENT_ID;

    const url = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;

    window.location.href = url;
  };

  return (
    <div>
      <button onClick={handleAuthorize}>Authorize</button>
    </div>
  );
}
