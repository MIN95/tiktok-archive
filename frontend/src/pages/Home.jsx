import { useState } from 'react';

function Home() {
    const [appKey, setAppKey] = useState('');
    const [secret, setSecret] = useState('');
    const [redirectUri, setRedirectUri] = useState('');

    const handleLogin = () => {
        if (!appKey || !secret || !redirectUri) {
            alert('Please fill in all fields');
            return;
        }

        // Store keys in sessionStorage to retrieve them after callback
        sessionStorage.setItem('tiktok_app_key', appKey);
        sessionStorage.setItem('tiktok_secret', secret);
        sessionStorage.setItem('tiktok_redirect_uri', redirectUri);

        const scope = 'user.info.basic,video.list';
        const authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${appKey}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}`;

        window.location.href = authUrl;
    };

    return (
        <div className="home-container">
            <h1>TikTok API Integration</h1>
            <div className="input-group">
                <label>TikTok App Key (Client Key)</label>
                <input
                    type="text"
                    value={appKey}
                    onChange={(e) => setAppKey(e.target.value)}
                    placeholder="Enter App Key"
                />
            </div>
            <div className="input-group">
                <label>TikTok Secret Key</label>
                <input
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Enter Secret Key"
                />
            </div>
            <div className="input-group">
                <label>Redirect URI</label>
                <input
                    type="text"
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                    placeholder="https://<username>.github.io/<repo>/callback"
                />
            </div>
            <button onClick={handleLogin}>Login with TikTok</button>
        </div>
    );
}

export default Home;
