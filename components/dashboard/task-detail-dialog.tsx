'use client'

import { FormEvent, useState } from 'react'
import { Clock3, Flag, MessageSquareText, Send, UserRound, X } from 'lucide-react'
import { RjMember, RjProject, RjTask } from '@/lib/rjproject/types'

export type TaskComment = { id: string; task_id: string; author_id: string; body: string; created_at: string }
type TaskUpdate = { status?: RjTask['status']; assignee_id?: string | null; priority?: RjTask['priority'] }

const statusLabels: Record<RjTask['status'], string> = { backlog: 'Backlog', todo: 'To do', in_progress: 'In progress', in_review: 'In review', done: 'Done' }

export function TaskDetailDialog({ task, project, comments, members, currentUser, loadingComments, onClose, onUpdate, onPostComment }: {
  task: RjTask
  project: RjProject | undefined
  comments: TaskComment[]
  members: RjMember[]
  currentUser: { id: string; name: string }
  loadingComments: boolean
  onClose: () => void
  onUpdate: (patch: TaskUpdate) => void
  onPostComment: (body: string) => Promise<void>
}) {
  const assignee = members.find((member) => member.user_id === task.assignee_id)

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="dialog-panel task-detail-panel" role="dialog" aria-modal="true" aria-labelledby="task-detail-title">
        <header className="dialog-header"><div><p className="detail-project-name">{project?.name ?? 'Workspace task'}</p><h2 id="task-detail-title">{task.title}</h2></div><button className="dialog-close" type="button" onClick={onClose} aria-label="Close task details"><X aria-hidden="true" /></button></header>
        <div className="task-detail-body">
          {task.description ? <p className="task-detail-description">{task.description}</p> : <p className="task-detail-description empty-description">No description yet.</p>}
          <div className="task-detail-controls">
            <label>Status<select aria-label="Task status" className="status-select" value={task.status} onChange={(event) => onUpdate({ status: event.target.value as RjTask['status'] })}>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <label>Priority<select aria-label="Task priority" className="status-select" value={task.priority} onChange={(event) => onUpdate({ priority: event.target.value as RjTask['priority'] })}><option value="urgent">Urgent</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option><option value="none">No priority</option></select></label>
            <label>Assignee<select aria-label="Task assignee" className="status-select" value={task.assignee_id ?? ''} onChange={(event) => onUpdate({ assignee_id: event.target.value || null })}><option value="">Unassigned</option>{members.map((member) => <option key={member.user_id} value={member.user_id}>{member.display_name || (member.user_id === currentUser.id ? currentUser.name : 'Workspace member')}</option>)}</select></label>
          </div>
          <div className="task-detail-meta"><span className="task-meta-pill"><UserRound aria-hidden="true" />{assignee?.display_name || (task.assignee_id === currentUser.id ? currentUser.name : 'Unassigned')}</span><span className="task-meta-pill"><Flag aria-hidden="true" />{task.priority === 'none' ? 'No priority' : `${task.priority[0].toUpperCase()}${task.priority.slice(1)}`}</span>{task.due_date && <span className="task-meta-pill"><Clock3 aria-hidden="true" />Due {new Date(`${task.due_date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}</div>
          <div className="task-comments-section"><h3 className="task-comments-heading"><MessageSquareText aria-hidden="true" /> Activity and comments <span>{comments.length}</span></h3>
            {loadingComments ? <p className="comment-empty">Loading comments…</p> : comments.length ? <div className="comment-list">{comments.map((comment) => {
              const author = members.find((member) => member.user_id === comment.author_id)
              const authorName = author?.display_name || (comment.author_id === currentUser.id ? currentUser.name : 'Workspace member')
              return <article className="comment-item" key={comment.id}><strong>{authorName}</strong><small>{new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small><p>{comment.body}</p></article>
            })}</div> : <p className="comment-empty">No comments yet. Start the conversation.</p>}
            <CommentForm onSubmit={onPostComment} />
          </div>
        </div>
      </section>
    </div>
  )
}

function CommentForm({ onSubmit }: { onSubmit: (body: string) => Promise<void> }) {
  const [body, setBody] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!body.trim()) return
    setPending(true)
    try {
      await onSubmit(body.trim())
      setBody('')
    } finally {
      setPending(false)
    }
  }

  return <form className="comment-form" onSubmit={submit}><label className="sr-only" htmlFor="task-comment">Write a comment</label><textarea id="task-comment" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write a comment…" maxLength={5000} /><button className="button button-primary" type="submit" disabled={pending || !body.trim()}>{pending ? <span className="sr-only">Sending…</span> : <>Send <Send aria-hidden="true" /></>}</button></form>
}

