'use client'

import { FormEvent, useState } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { RjProject } from '@/lib/rjproject/types'

export type NewTaskValues = { title: string; description: string; project_id: string; priority: 'urgent' | 'high' | 'medium' | 'low' | 'none'; due_date: string | null }

export function TaskDialog({ projects, initialProjectId, onClose, onSubmit }: { projects: RjProject[]; initialProjectId?: string | null; onClose: () => void; onSubmit: (values: NewTaskValues) => Promise<void> }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState(initialProjectId ?? projects[0]?.id ?? '')
  const [priority, setPriority] = useState<NewTaskValues['priority']>('medium')
  const [dueDate, setDueDate] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!projectId) return
    setPending(true)
    setError('')
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), project_id: projectId, priority, due_date: dueDate || null })
    } catch {
      setError('Task could not be created. Check your workspace access and try again.')
      setPending(false)
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title">
        <header className="dialog-header"><div><h2 id="task-dialog-title">Create a task</h2><p>Make the next step clear and easy to pick up.</p></div><button className="dialog-close" type="button" onClick={onClose} aria-label="Close dialog"><X aria-hidden="true" /></button></header>
        <form className="dialog-form" onSubmit={handleSubmit}>
          <label>Task title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Review the launch brief" required minLength={1} maxLength={240} autoFocus /></label>
          <label>Project<select value={projectId} onChange={(event) => setProjectId(event.target.value)} required>{projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label>
          <label>Description <span className="optional-label">Optional</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add context or a definition of done" maxLength={5000} /></label>
          <div className="dialog-two-col"><label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value as NewTaskValues['priority'])}><option value="urgent">Urgent</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option><option value="none">No priority</option></select></label><label>Due date <span className="optional-label">Optional</span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label></div>
          <p className="assignment-note">This task will be assigned to you. You can update the assignee from the task detail panel.</p>
          {error && <p className="form-message error" role="alert">{error}</p>}
          <div className="dialog-actions"><button className="button button-secondary" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit" disabled={pending || !title.trim() || !projectId}>{pending ? <LoaderCircle className="spin" aria-hidden="true" /> : 'Create task'}</button></div>
        </form>
      </section>
    </div>
  )
}
