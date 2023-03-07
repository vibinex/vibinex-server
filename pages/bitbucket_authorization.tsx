export default function Auth() {

  const handleAuthorize = () => {
    // Construct the URL to the Bitbucket authorization page
    const baseUrl = 'https://bitbucket.org/site/oauth2/authorize';
    const redirectUri = 'https://7cf7-2401-4900-1f28-7e61-cafc-b24-2e52-83e.in.ngrok.io/authorise_github_app'; // Change this to the orginal redirecturi
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
