'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Layers3, LoaderCircle, LockKeyhole, Mail, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type AuthMode = 'login' | 'signup' | 'forgot'

function authRedirect() {
  return process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`
}

function safeAuthMessage(message: string, mode: AuthMode) {
  const lower = message.toLowerCase()
  if (lower.includes('invalid login credentials') || lower.includes('email not found')) {
    return 'Email atau kata sandi tidak cocok.'
  }
  if (lower.includes('user already registered')) {
    return 'Jika akun tersebut sudah terdaftar, coba masuk atau gunakan pemulihan kata sandi.'
  }
  if (lower.includes('email not confirmed')) {
    return 'Konfirmasi email Anda dari tautan di kotak masuk sebelum masuk.'
  }
  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Terlalu banyak percobaan. Tunggu beberapa saat sebelum mencoba lagi.'
  }
  if (lower.includes('password') && (lower.includes('weak') || lower.includes('short'))) {
    return 'Gunakan kata sandi yang lebih kuat (minimal 8 karakter).'
  }
  if (mode === 'signup' && lower.includes('email')) return 'Periksa kembali alamat email Anda.'
  return 'Permintaan belum dapat diproses. Coba lagi sebentar.'
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const isForgot = mode === 'forgot'
  const isSignup = mode === 'signup'
  const title = isForgot ? 'Reset password' : isSignup ? 'Create your account' : 'Welcome back'
  const subtitle = isForgot
    ? 'We’ll email you a secure link to choose a new password.'
    : isSignup
      ? 'Start with a workspace that keeps your team moving.'
      : 'Pick up where your team left off.'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setMessage('')
    setSuccess(false)
    const supabase = createClient()

    try {
      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
        })
        if (error) throw error
        setSuccess(true)
        setMessage('If an account exists for that email, a reset link is on its way.')
      } else if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: authRedirect(),
            data: { display_name: name.trim() },
          },
        })
        if (error) throw error
        if (data.session) {
          router.push('/dashboard')
          router.refresh()
        } else {
          setSuccess(true)
          setMessage('Check your inbox to confirm your email, then sign in to continue.')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      const text = error instanceof Error ? error.message : ''
      setMessage(safeAuthMessage(text, mode))
    } finally {
      setPending(false)
    }
  }

  async function handleGoogle() {
    setPending(true)
    setMessage('')
    try {
      const { error } = await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: authRedirect() },
      })
      if (error) throw error
    } catch {
      setMessage('Google sign-in is not available right now. Try email and password instead.')
      setPending(false)
    }
  }

  return (
    <main className="auth-layout">
      <aside className="auth-aside">
        <Link href="/" className="brand-lockup" aria-label="RJProject home">
          <span className="brand-mark"><Layers3 aria-hidden="true" /></span>
          <span>RJProject</span>
        </Link>
        <div className="auth-aside-copy">
          <p className="eyebrow"><Sparkles aria-hidden="true" /> PROJECTS, IN MOTION</p>
          <h1>Great work happens when everything clicks.</h1>
          <p>One calm, connected space for the plans, people, and progress behind your best work.</p>
        </div>
        <div className="auth-proof">
          <div className="auth-proof-top"><span className="status-dot" /> Weekly progress <span>+18%</span></div>
          <div className="proof-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <div className="auth-proof-foot"><span>Product launch</span><span>On track</span></div>
        </div>
        <p className="auth-aside-footer">Plan better. Work smarter. Build together.</p>
      </aside>

      <section className="auth-main" aria-labelledby="auth-title">
        <Link href="/" className="back-link"><ArrowLeft aria-hidden="true" /> Back to home</Link>
        <div className="auth-panel">
          <div className="auth-mobile-brand"><span className="brand-mark"><Layers3 aria-hidden="true" /></span> RJProject</div>
          <span className="auth-icon"><LockKeyhole aria-hidden="true" /></span>
          <h2 id="auth-title">{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>

          {!isForgot && (
            <>
              <button className="button button-secondary button-full" type="button" onClick={handleGoogle} disabled={pending}>
                <span className="google-g" aria-hidden="true">G</span>
                Continue with Google
              </button>
              <div className="auth-divider"><span>or with email</span></div>
            </>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="field-label">
                Your name
                <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" required maxLength={80} />
              </label>
            )}
            <label className="field-label">
              Email address
              <span className="input-wrap"><Mail aria-hidden="true" /><input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required /></span>
            </label>
            {!isForgot && (
              <label className="field-label">
                Password
                <span className="input-wrap"><LockKeyhole aria-hidden="true" /><input autoComplete={isSignup ? 'new-password' : 'current-password'} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'} minLength={isSignup ? 8 : undefined} required /><button className="input-action" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></span>
              </label>
            )}
            {mode === 'login' && <div className="auth-inline-link"><Link href="/forgot-password">Forgot password?</Link></div>}
            {message && <p className={success ? 'form-message success' : 'form-message error'} role="status">{success && <Check aria-hidden="true" />}{message}</p>}
            <button className="button button-primary button-full" type="submit" disabled={pending}>
              {pending ? <LoaderCircle className="spin" aria-hidden="true" /> : <>{isForgot ? 'Send reset link' : isSignup ? 'Create account' : 'Sign in'} <ArrowRight aria-hidden="true" /></>}
            </button>
          </form>

          <p className="auth-switch">
            {isForgot ? <Link href="/login">Return to sign in</Link> : isSignup ? <>Already have an account? <Link href="/login">Sign in</Link></> : <>New to RJProject? <Link href="/signup">Create an account</Link></>}
          </p>
          <p className="auth-legal">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
        </div>
        <div className="auth-trust"><span><Check aria-hidden="true" /> Secure sign-in</span><span>Made for teams that build</span></div>
      </section>
    </main>
  )
}

export function UpdatePasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setMessage('')
    const { error } = await createClient().auth.updateUser({ password })
    setPending(false)
    if (error) {
      setMessage('Your password could not be updated. Request a fresh reset link and try again.')
      return
    }
    setSuccess(true)
    setMessage('Password updated. Taking you to your workspace…')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="auth-layout single-auth">
      <section className="auth-main" aria-labelledby="password-title">
        <div className="auth-panel">
          <Link href="/" className="brand-lockup"><span className="brand-mark"><Layers3 aria-hidden="true" /></span><span>RJProject</span></Link>
          <span className="auth-icon"><LockKeyhole aria-hidden="true" /></span>
          <h1 id="password-title">Choose a new password</h1>
          <p className="auth-subtitle">Use at least 8 characters for your new password.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field-label">New password<input type="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
            {message && <p className={success ? 'form-message success' : 'form-message error'} role="status">{message}</p>}
            <button className="button button-primary button-full" type="submit" disabled={pending}>{pending ? <LoaderCircle className="spin" aria-hidden="true" /> : 'Update password'}</button>
          </form>
        </div>
      </section>
    </main>
  )
}
