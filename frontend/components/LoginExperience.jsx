'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from './Icon';

export default function LoginExperience() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function signIn(event) {
    event.preventDefault();
    setError('');
    if (!email || !password) return setError('Enter your work email and password.');
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to sign in.');
      const data = result.data;
      localStorage.setItem('ewm_access_token', data.accessToken);
      localStorage.setItem('ewm_refresh_token', data.refreshToken);
      localStorage.setItem('ewm_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'The API is offline. Start the backend or use preview mode.' : err.message);
    } finally { setLoading(false); }
  }

  function preview() {
    localStorage.setItem('ewm_demo_session', 'true');
    localStorage.setItem('ewm_user', JSON.stringify({ email: 'mohit@nexora.app', role: 'ORG_ADMIN' }));
    router.push('/dashboard');
  }

  return (
    <main className="login-page">
      <div className="login-glow login-glow-one"/><div className="login-glow login-glow-two"/><div className="login-grid"/>
      <section className="login-story">
        <a className="login-brand" href="/"><span>N</span>Nexora</a>
        <div className="story-copy">
          <p className="story-kicker"><i/>The operating system for your workforce</p>
          <h1>People operations,<br/><em>beautifully intelligent.</em></h1>
          <p>Bring your people, workflows, insights, and AI into one calm, connected workspace.</p>
          <div className="story-proof">
            <div className="avatar-stack"><i>AM</i><i>SK</i><i>LP</i><i>+2k</i></div>
            <span><b>Trusted by modern teams</b><small>Built for clarity. Designed to scale.</small></span>
          </div>
        </div>
        <div className="login-quote"><Icon name="sparkle"/><blockquote>“Nexora gave our team back the one thing every growing company needs—focus.”</blockquote><p><b>Maya Chen</b><span>VP People, Loomis</span></p></div>
      </section>

      <section className="login-form-side">
        <div className="login-mobile-brand"><span>N</span>Nexora</div>
        <div className="login-card">
          <div className="login-heading"><p>WELCOME BACK</p><h2>Sign in to your workspace</h2><span>Enter your details to continue to Nexora.</span></div>
          {error && <div className="login-error"><span>!</span>{error}</div>}
          <form onSubmit={signIn}>
            <label>Work email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email"/></label>
            <label>Password<div className="password-field"><input type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password"/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?'Hide':'Show'}</button></div></label>
            <div className="form-options"><label className="check-row"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/><span/>Keep me signed in</label><button type="button" onClick={()=>setError('Password reset will be sent by your workspace administrator.')}>Forgot password?</button></div>
            <button className="login-submit" disabled={loading}>{loading?<><i/>Signing you in...</>:<>Continue to Nexora <Icon name="arrow"/></>}</button>
          </form>
          <div className="divider"><span>or</span></div>
          <button className="preview-button" onClick={preview}><Icon name="sparkle"/>Preview the workspace</button>
          <p className="login-legal">By continuing, you agree to our <button onClick={()=>setError('Terms of service preview opened.')}>Terms</button> and <button onClick={()=>setError('Privacy policy preview opened.')}>Privacy Policy</button>.</p>
        </div>
        <footer><span>© 2026 Nexora, Inc.</span><span><i/>All systems operational</span></footer>
      </section>
    </main>
  );
}
