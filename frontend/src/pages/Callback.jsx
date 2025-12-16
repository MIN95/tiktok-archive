import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { exchangeToken, getUserInfo, getVideoList } from '../api/tiktok';

function Callback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [videoList, setVideoList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const code = searchParams.get('code');
        const appKey = sessionStorage.getItem('tiktok_app_key');
        const secret = sessionStorage.getItem('tiktok_secret');
        const redirectUri = sessionStorage.getItem('tiktok_redirect_uri');

        if (!code) {
            setError('No authorization code found');
            setLoading(false);
            return;
        }

        if (!appKey || !secret || !redirectUri) {
            setError('Missing credentials. Please return to home and try again.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Exchange Token
                const tokenData = await exchangeToken(code, appKey, secret, redirectUri);
                const accessToken = tokenData.access_token; // Adjust according to actual response structure if needed

                if (!accessToken) {
                    // Sometimes it might be data.data.access_token depending on backend wrapper, 
                    // but we'll assume backend returns the direct TikTok response or flattens it.
                    // Let's assume our backend returns the JSON body from TikTok.
                    throw new Error('Failed to retrieve access token');
                }

                // 2. Fetch User Info
                const userRes = await getUserInfo(accessToken);
                setUserInfo(userRes.data?.user || userRes.data || userRes); // Handling potential structure variations

                // 3. Fetch Videos
                const videoRes = await getVideoList(accessToken);
                setVideoList(videoRes.data?.videos || videoRes.data?.list || []);

            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams, navigate]);

    if (loading) return <div>Loading... processing TikTok login...</div>;

    if (error) return (
        <div className="error-container">
            <h2 className="error">Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')}>Return Home</button>
        </div>
    );

    return (
        <div className="callback-container">
            <h1>Dashboard</h1>

            {userInfo && (
                <div className="user-info">
                    <img src={userInfo.avatar_url} alt="Avatar" style={{ borderRadius: '50%', width: 100 }} />
                    <h2>{userInfo.display_name}</h2>
                    <p>@{userInfo.username}</p>
                </div>
            )}

            <h3>Required Videos</h3>
            <div className="video-list">
                {videoList.length === 0 ? <p>No videos found.</p> : videoList.map((video, idx) => (
                    <div key={idx} className="video-card">
                        <img src={video.cover_image_url} alt="Video Cover" style={{ width: '100%' }} />
                        <p>{video.title}</p>
                        <a href={video.share_url} target="_blank" rel="noreferrer">Watch on TikTok</a>
                    </div>
                ))}
            </div>

            <button style={{ marginTop: '20px' }} onClick={() => navigate('/')}>Logout</button>
        </div>
    );
}

export default Callback;
