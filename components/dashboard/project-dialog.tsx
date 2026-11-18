'use client'

import { FormEvent, useState } from 'react'
import { LoaderCircle, X } from 'lucide-react'

export type NewProjectValues = { name: string; description: string; priority: 'urgent' | 'high' | 'medium' | 'low'; due_date: string | null }

export function ProjectDialog({ onClose, onSubmit }: { onClose: () => void; onSubmit: (values: NewProjectValues) => Promise<void> }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<NewProjectValues['priority']>('medium')
  const [dueDate, setDueDate] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    try {
      await onSubmit({ name: name.trim(), description: description.trim(), priority, due_date: dueDate || null })
    } catch {
      setError('Project could not be created. Check your workspace access and try again.')
      setPending(false)
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
        <header className="dialog-header"><div><h2 id="project-dialog-title">Create a project</h2><p>Set a direction, then bring the right people into the work.</p></div><button className="dialog-close" type="button" onClick={onClose} aria-label="Close dialog"><X aria-hidden="true" /></button></header>
        <form className="dialog-form" onSubmit={handleSubmit}>
          <label>Project name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Website refresh" required minLength={1} maxLength={120} autoFocus /></label>
          <label>Description <span className="optional-label">Optional</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What does success look like?" maxLength={2000} /></label>
          <div className="dialog-two-col"><label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value as NewProjectValues['priority'])}><option value="urgent">Urgent</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><label>Target date <span className="optional-label">Optional</span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label></div>
          {error && <p className="form-message error" role="alert">{error}</p>}
          <div className="dialog-actions"><button className="button button-secondary" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit" disabled={pending || !name.trim()}>{pending ? <LoaderCircle className="spin" aria-hidden="true" /> : 'Create project'}</button></div>
        </form>
      </section>
    </div>
  )
}
