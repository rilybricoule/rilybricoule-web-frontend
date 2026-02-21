import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Facebook redirects here after OAuth:
 * /auth/facebook/callback#access_token=XXX&...
 *
 * This page:
 * 1. Parses the access_token from the URL hash
 * 2. Fetches the user's public profile from Facebook Graph API
 * 3. Stores the profile in localStorage as 'fb_oauth_pending'
 * 4. Redirects back to /login or /register (whichever initiated the flow)
 */
export function FacebookCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const { setUserFromOAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1); // remove leading #
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const origin = localStorage.getItem('fb_oauth_origin') || '/login';

    if (!accessToken) {
      setStatus('error');
      setErrorMsg('Token Facebook manquant. Veuillez réessayer.');
      setTimeout(() => navigate(origin), 3000);
      return;
    }

    // Fetch profile from Facebook Graph API
    fetch(`https://graph.facebook.com/me?fields=id,name,picture.width(200)&access_token=${accessToken}`)
      .then(r => r.json())
      .then(profile => {
        if (profile.error) {
          throw new Error(profile.error.message);
        }

        const fbUser = {
          id: profile.id,
          email: `${profile.id}@facebook.com`, // Facebook doesn't give email without special permission
          name: profile.name,
          avatar: profile.picture?.data?.url,
          provider: 'facebook' as const,
        };

        // Store pending profile so Login/Register can read it on mount
        localStorage.setItem('fb_oauth_pending', JSON.stringify(fbUser));
        localStorage.removeItem('fb_oauth_origin');

        // Redirect back to where the user came from
        navigate(origin, { replace: true });
      })
      .catch(err => {
        setStatus('error');
        setErrorMsg('Erreur lors de la récupération du profil Facebook.');
        setTimeout(() => navigate(origin), 3000);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-slate-200 to-orange-400 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm w-full">
        {status === 'loading' ? (
          <>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />
            </div>
            <p className="text-gray-700 font-semibold">Connexion Facebook en cours...</p>
            <p className="text-gray-400 text-sm mt-1">Veuillez patienter</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">❌</div>
            <p className="text-red-600 font-semibold">{errorMsg}</p>
            <p className="text-gray-400 text-sm mt-1">Redirection en cours...</p>
          </>
        )}
      </div>
    </div>
  );
}