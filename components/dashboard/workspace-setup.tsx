'use client'

import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'
import { ArrowRight, Building2, Layers3, LoaderCircle, LogOut } from 'lucide-react'

export function WorkspaceSetup({ onCreate, onSignOut }: { onCreate: (values: { name: string; slug: string }) => Promise<void>; onSignOut: () => void }) {
  const [name, setName] = useState('')
  const [slugInput, setSlugInput] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const slug = useMemo(() => (slugEdited ? slugInput : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).slice(0, 60), [name, slugInput, slugEdited])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^[a-z0-9-]{2,60}$/.test(slug)) {
      setError('Workspace URL must use 2–60 lowercase letters, numbers, or hyphens.')
      return
    }
    setPending(true)
    setError('')
    try {
      await onCreate({ name: name.trim(), slug })
    } catch {
      setError('Could not create this workspace. Check whether its URL is already taken, then try again.')
      setPending(false)
    }
  }

  return (
    <main className="dashboard-main dashboard-onboarding">
      <header className="onboarding-header"><Link href="/" className="brand-lockup"><span className="brand-mark"><Layers3 aria-hidden="true" /></span><span>RJProject</span></Link><button className="onboarding-signout" type="button" onClick={onSignOut}><LogOut aria-hidden="true" /> Sign out</button></header>
      <section className="workspace-setup" aria-labelledby="workspace-setup-title">
        <span className="setup-step">YOUR FIRST STEP <span>01 / 03</span></span>
        <span className="setup-icon"><Building2 aria-hidden="true" /></span>
        <h1 id="workspace-setup-title">Make a space for good work.</h1>
        <p>Give your team one place to plan projects, share progress, and keep the next step clear.</p>
        <form className="workspace-form" onSubmit={handleSubmit}>
          <label>Workspace name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Northstar Studio" required minLength={1} maxLength={80} autoComplete="organization" /></label>
          <label>Workspace URL<span className="slug-input-wrap"><span>rjproject.app/</span><input value={slug} onChange={(event) => { setSlugEdited(true); setSlugInput(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 60)) }} placeholder="northstar-studio" required minLength={2} maxLength={60} pattern="[a-z0-9-]{2,60}" /></span></label>
          {error && <p className="form-message error" role="alert">{error}</p>}
          <button className="button button-primary button-full" type="submit" disabled={pending || !name.trim()}>{pending ? <LoaderCircle className="spin" aria-hidden="true" /> : <>Create workspace <ArrowRight aria-hidden="true" /></>}</button>
        </form>
        <p className="setup-note">You can invite your team after your workspace is ready.</p>
      </section>
      <footer className="onboarding-footer">A clear next step for every project.</footer>
    </main>
  )
}
