'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, ArrowRight, Bell, CalendarDays, Check, ChevronRight, Clock3, FolderKanban, LayoutDashboard, ListTodo, LoaderCircle, Menu, Plus, Search, Users, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { RjMember, RjNotification, RjProject, RjTask, RjWorkspace } from '@/lib/rjproject/types'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { WorkspaceSetup } from '@/components/dashboard/workspace-setup'
import { NewProjectValues, ProjectDialog } from '@/components/dashboard/project-dialog'
import { NewTaskValues, TaskDialog } from '@/components/dashboard/task-dialog'
import { TaskComment, TaskDetailDialog } from '@/components/dashboard/task-detail-dialog'

export type DashboardView = 'overview' | 'tasks' | 'projects' | 'calendar' | 'inbox' | 'team' | 'reports' | 'settings'

type UserInfo = { id: string; email: string; name: string; avatarUrl: string | null }
type Props = {
  user: UserInfo
  workspaces: RjWorkspace[]
  workspace: RjWorkspace | null
  projects: RjProject[]
  tasks: RjTask[]
  notifications: RjNotification[]
  members: RjMember[]
}

const taskStatuses: RjTask['status'][] = ['backlog', 'todo', 'in_progress', 'in_review', 'done']
const statusLabel: Record<RjTask['status'], string> = { backlog: 'Backlog', todo: 'To do', in_progress: 'In progress', in_review: 'In review', done: 'Done' }
const viewLabel: Record<DashboardView, string> = { overview: 'Overview', tasks: 'My tasks', projects: 'Projects', calendar: 'Calendar', inbox: 'Inbox', team: 'Members', reports: 'Reports', settings: 'Settings' }

function formatDate(date: string | null) {
  if (!date) return 'No date'
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function initials(name: string) {
  return name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'RJ'
}

function TaskTable({ tasks, projects, onOpen, onStatusChange }: { tasks: RjTask[]; projects: RjProject[]; onOpen: (task: RjTask) => void; onStatusChange: (task: RjTask, status: RjTask['status']) => void }) {
  const projectById = new Map(projects.map((project) => [project.id, project.name]))
  if (!tasks.length) return <div className="empty-state"><span className="empty-state-icon"><ListTodo aria-hidden="true" /></span><h3>No tasks to show</h3><p>Tasks you create or are assigned to will show up here.</p></div>
  return (
    <div className="table-scroll"><table className="task-table"><thead><tr><th>Task</th><th>Status</th><th>Project</th><th>Due date</th></tr></thead><tbody>{tasks.map((task) => (
      <tr key={task.id}>
        <td><button className="task-title-button" type="button" onClick={() => onOpen(task)}><span className={`task-check ${task.status === 'done' ? 'done' : ''}`}>{task.status === 'done' && <Check aria-hidden="true" />}</span><span>{task.title}</span></button></td>
        <td><label className="sr-only" htmlFor={`status-${task.id}`}>Status for {task.title}</label><select id={`status-${task.id}`} className="status-select" value={task.status} onChange={(event) => onStatusChange(task, event.target.value as RjTask['status'])}>{taskStatuses.map((status) => <option key={status} value={status}>{statusLabel[status]}</option>)}</select></td>
        <td><span className="task-project-name">{projectById.get(task.project_id) ?? 'Project'}</span></td>
        <td><span className={`task-due ${task.due_date && new Date(`${task.due_date}T23:59:59`) < new Date() && task.status !== 'done' ? 'overdue' : ''}`}>{formatDate(task.due_date)}</span></td>
      </tr>
    ))}</tbody></table></div>
  )
}

function ProjectList({ projects, tasks, onOpenTasks }: { projects: RjProject[]; tasks: RjTask[]; onOpenTasks: (projectId: string) => void }) {
  if (!projects.length) return <div className="empty-state"><span className="empty-state-icon"><FolderKanban aria-hidden="true" /></span><h3>No projects yet</h3><p>Create a project to give your team a clear goal and place to organize the work.</p></div>
  return <div className="project-list">{projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.project_id === project.id)
    const completed = projectTasks.filter((task) => task.status === 'done').length
    const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0
    return <button className="project-row project-row-button" key={project.id} type="button" onClick={() => onOpenTasks(project.id)}>
      <span className="project-icon"><FolderKanban aria-hidden="true" /></span><span className="project-row-copy"><strong>{project.name}</strong><small>{project.status.replace('_', ' ')} · {projectTasks.length} {projectTasks.length === 1 ? 'task' : 'tasks'}</small></span><span className="project-progress"><div><i style={{ width: `${progress}%` }} /></div><small>{progress}%</small></span><ChevronRight className="project-row-chevron" aria-hidden="true" />
    </button>
  })}</div>
}

function StatCard({ label, value, detail, icon: Icon }: { label: string; value: number; detail: string; icon: typeof Activity }) {
  return <article className="stat-card"><div className="stat-card-top"><span>{label}</span><Icon aria-hidden="true" /></div><strong>{value.toLocaleString()}</strong><small>{detail}</small></article>
}

export function DashboardApp({ user, workspaces, workspace, projects, tasks, notifications, members }: Props) {
  const router = useRouter()
  const [activeView, setActiveView] = useState<DashboardView>('overview')
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [createDialog, setCreateDialog] = useState<'task' | 'project' | null>(null)
  const [selectedTask, setSelectedTask] = useState<RjTask | null>(null)
  const [comments, setComments] = useState<TaskComment[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const [toast, setToast] = useState('')
  const [settingsName, setSettingsName] = useState(workspace?.name ?? '')
  const [savingSettings, setSavingSettings] = useState(false)
  const unreadCount = notifications.filter((notification) => !notification.read_at).length
  const currentRole = members.find((member) => member.user_id === user.id)?.role
  const canManageSettings = currentRole === 'owner' || currentRole === 'admin'
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('light', isLight)
    root.classList.toggle('dark', !isLight)
  }, [isLight])

  useEffect(() => {
    if (!workspace) return
    const channel = supabase
      .channel(`rjp-workspace-${workspace.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rjp_tasks' }, () => router.refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rjp_notifications', filter: `user_id=eq.${user.id}` }, () => router.refresh())
      .subscribe()
    return () => { void supabase.removeChannel(channel) }
  }, [supabase, workspace?.id, user.id, router])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    setSettingsName(workspace?.name ?? '')
  }, [workspace?.id, workspace?.name])

  const projectById = useMemo(() => new Map(projects.map((project) => [project.id, project.name])), [projects])
  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()
    return projects.filter((project) => (!projectFilter || project.id === projectFilter) && (!query || `${project.name} ${project.description}`.toLowerCase().includes(query)))
  }, [projects, projectFilter, search])
  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      const assignedToMe = activeView !== 'tasks' || task.assignee_id === user.id
      const matchesProject = !projectFilter || task.project_id === projectFilter
      const matchesSearch = !query || `${task.title} ${task.description} ${projectById.get(task.project_id) ?? ''}`.toLowerCase().includes(query)
      return assignedToMe && matchesProject && matchesSearch
    })
  }, [tasks, activeView, user.id, projectFilter, search, projectById])

  const openView = (view: DashboardView, projectId?: string) => {
    setActiveView(view)
    setProjectFilter(projectId ?? null)
    setSearch('')
    setIsSidebarOpen(false)
  }

  const notify = (message: string) => setToast(message)

  async function createWorkspace(values: { name: string; slug: string }) {
    const { data, error } = await supabase.rpc('rjp_create_workspace', { workspace_name: values.name, workspace_slug: values.slug })
    if (error || !data) throw error ?? new Error('Workspace creation failed')
    router.push(`/dashboard?workspace=${data}`)
    router.refresh()
  }

  async function createProject(values: NewProjectValues) {
    if (!workspace) throw new Error('No workspace selected')
    const { error } = await supabase.from('rjp_projects').insert({
      workspace_id: workspace.id,
      owner_id: user.id,
      name: values.name,
      description: values.description,
      priority: values.priority,
      due_date: values.due_date,
      status: 'active',
    })
    if (error) throw error
    setCreateDialog(null)
    notify('Project created.')
    router.refresh()
  }

  async function createTask(values: NewTaskValues) {
    const { error } = await supabase.from('rjp_tasks').insert({
      project_id: values.project_id,
      title: values.title,
      description: values.description,
      priority: values.priority,
      due_date: values.due_date,
      status: 'todo',
      assignee_id: user.id,
      created_by: user.id,
      position: tasks.length,
    })
    if (error) throw error
    setCreateDialog(null)
    notify('Task added to your workspace.')
    router.refresh()
  }

  async function updateTask(task: RjTask, patch: Partial<Pick<RjTask, 'status' | 'assignee_id' | 'priority'>>) {
    const { error } = await supabase.from('rjp_tasks').update(patch).eq('id', task.id)
    if (error) {
      notify('That task could not be updated. Check your workspace permissions.')
      return
    }
    setSelectedTask((current) => current?.id === task.id ? { ...current, ...patch } : current)
    router.refresh()
  }

  async function openTask(task: RjTask) {
    setSelectedTask(task)
    setComments([])
    setLoadingComments(true)
    const { data, error } = await supabase.from('rjp_task_comments').select('id, task_id, author_id, body, created_at').eq('task_id', task.id).order('created_at', { ascending: true }).limit(100)
    setComments(error ? [] : (data ?? []) as TaskComment[])
    setLoadingComments(false)
  }

  async function postComment(body: string) {
    if (!selectedTask) return
    const { data, error } = await supabase.from('rjp_task_comments').insert({ task_id: selectedTask.id, author_id: user.id, body }).select('id, task_id, author_id, body, created_at').single()
    if (error || !data) throw error ?? new Error('Comment could not be added')
    setComments((current) => [...current, data as TaskComment])
    router.refresh()
  }

  async function markRead(notification: RjNotification) {
    const { error } = await supabase.from('rjp_notifications').update({ read_at: new Date().toISOString() }).eq('id', notification.id)
    if (!error) router.refresh()
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  async function saveWorkspaceSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!workspace || !canManageSettings) return
    setSavingSettings(true)
    const { error } = await supabase.from('rjp_workspaces').update({ name: settingsName.trim() }).eq('id', workspace.id)
    setSavingSettings(false)
    if (error) {
      notify('Workspace settings could not be saved.')
      return
    }
    notify('Workspace name updated.')
    router.refresh()
  }

  function switchWorkspace(workspaceId: string) {
    router.push(`/dashboard?workspace=${encodeURIComponent(workspaceId)}`)
    router.refresh()
  }

  if (!workspace) return <WorkspaceSetup onCreate={createWorkspace} onSignOut={signOut} />

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const openTasks = tasks.filter((task) => task.status !== 'done')
  const dueSoon = tasks.filter((task) => task.status !== 'done' && task.due_date && new Date(`${task.due_date}T12:00:00`) >= today && new Date(`${task.due_date}T12:00:00`) <= nextWeek)
  const activeProjects = projects.filter((project) => project.status === 'active')
  const completedTasks = tasks.filter((task) => task.status === 'done')
  const upcomingTasks = [...filteredTasks].filter((task) => task.due_date && task.status !== 'done').sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''))
  const displayTasks = activeView === 'overview' ? filteredTasks.filter((task) => task.assignee_id === user.id).slice(0, 7) : activeView === 'calendar' ? upcomingTasks : filteredTasks
  const pageTitle = activeView === 'overview' ? `Good to see you, ${user.name.split(' ')[0]}` : projectFilter && activeView === 'projects' ? 'Project overview' : viewLabel[activeView]
  const pageDescription: Record<DashboardView, string> = {
    overview: `Here’s what’s happening in ${workspace.name}.`,
    tasks: 'Keep your next steps clear and your progress moving.',
    projects: 'Goals, ownership, and progress in one place.',
    calendar: 'A clear view of the tasks coming up next.',
    inbox: 'Updates and assignments from your workspace.',
    team: 'The people working together in this space.',
    reports: 'A real-time snapshot of projects and task progress.',
    settings: 'Manage your workspace details and preferences.',
  }
  const avatarInitials = initials(user.name)

  return (
    <div className={`dashboard-shell ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <DashboardSidebar activeView={activeView} onNavigate={openView} workspaces={workspaces} workspace={workspace} projects={projects} members={members} currentUser={user} unreadCount={unreadCount} onWorkspaceChange={switchWorkspace} onSignOut={signOut} onThemeToggle={() => setIsLight((current) => !current)} isLight={isLight} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-leading"><button className="icon-button mobile-menu-button" type="button" aria-label="Open navigation" onClick={() => setIsSidebarOpen(true)}><Menu aria-hidden="true" /></button><div className="topbar-crumb"><span>{workspace.name}</span><ChevronRight aria-hidden="true" /><strong>{viewLabel[activeView]}</strong></div></div>
          <div className="topbar-actions"><label className="global-search"><Search aria-hidden="true" /><span className="sr-only">Search projects and tasks</span><input type="search" aria-label="Search projects and tasks" placeholder="Search tasks, projects..." value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></label><button className="icon-button topbar-notifications" type="button" aria-label={`${unreadCount} unread notifications`} onClick={() => openView('inbox')}><Bell aria-hidden="true" />{unreadCount > 0 && <span className="notification-indicator" />}</button><button className="quick-create" type="button" onClick={() => setCreateDialog('task')} disabled={!projects.length}><Plus aria-hidden="true" /> New task</button><span className="topbar-user-avatar" aria-label={user.name}>{user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : avatarInitials}</span></div>
        </header>

        <div className="dashboard-content">
          <div className="page-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> {activeView === 'overview' ? 'YOUR WORKSPACE' : workspace.name.toUpperCase()}</p><h1>{pageTitle}</h1><p>{projectFilter && activeView === 'projects' ? 'A focused view of this project and its tasks.' : pageDescription[activeView]}</p></div>{activeView === 'projects' && <div className="page-heading-actions"><button className="button button-secondary" type="button" onClick={() => { setProjectFilter(null); setCreateDialog('project') }}><Plus aria-hidden="true" /> New project</button></div>}{activeView === 'overview' && <div className="page-heading-actions"><button className="button button-primary" type="button" onClick={() => setCreateDialog(projects.length ? 'task' : 'project')}><Plus aria-hidden="true" /> {projects.length ? 'New task' : 'Create project'}</button></div>}</div>

          {activeView === 'overview' && <>
            <div className="stat-grid"><StatCard label="Active projects" value={activeProjects.length} detail={`${projects.length} total in this workspace`} icon={FolderKanban} /><StatCard label="Open tasks" value={openTasks.length} detail="Across all workspace projects" icon={ListTodo} /><StatCard label="Completed tasks" value={completedTasks.length} detail="All time in this workspace" icon={Check} /><StatCard label="Due this week" value={dueSoon.length} detail="Open tasks with a due date" icon={CalendarDays} /></div>
            <div className="dashboard-grid"><section className="content-panel"><header className="panel-header"><div><h2>Your tasks</h2><p>Assigned to you, across the workspace</p></div><button type="button" onClick={() => openView('tasks')}>View all <ArrowRight aria-hidden="true" /></button></header><TaskTable tasks={displayTasks} projects={projects} onOpen={openTask} onStatusChange={(task, status) => void updateTask(task, { status })} /></section><section className="content-panel"><header className="panel-header"><div><h2>Projects</h2><p>Progress across your team</p></div><button type="button" onClick={() => openView('projects')}>View all <ArrowRight aria-hidden="true" /></button></header><ProjectList projects={projects.slice(0, 5)} tasks={tasks} onOpenTasks={(projectId) => openView('projects', projectId)} /></section></div>
          </>}

          {activeView === 'tasks' && <div className="view-content"><div className="view-toolbar"><p>{filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'} assigned to you</p><button className="button button-primary" type="button" onClick={() => setCreateDialog('task')} disabled={!projects.length}><Plus aria-hidden="true" /> New task</button></div><section className="content-panel"><TaskTable tasks={displayTasks} projects={projects} onOpen={openTask} onStatusChange={(task, status) => void updateTask(task, { status })} /></section></div>}

          {activeView === 'projects' && <div className="view-content"><div className="view-toolbar"><p>{filteredProjects.length} project{filteredProjects.length === 1 ? '' : 's'}{projectFilter ? ' · Filtered' : ''}</p>{projectFilter && <button className="panel-link" type="button" onClick={() => setProjectFilter(null)}>Clear filter <X aria-hidden="true" /></button>}</div><section className="content-panel"><ProjectList projects={filteredProjects} tasks={tasks} onOpenTasks={(projectId) => { setProjectFilter(projectId); setActiveView('tasks') }} /></section>{projectFilter && <section className="content-panel"><header className="panel-header"><div><h2>Project tasks</h2><p>{projectById.get(projectFilter) ?? 'Selected project'}</p></div><button type="button" onClick={() => setCreateDialog('task')}>Add task <Plus aria-hidden="true" /></button></header><TaskTable tasks={tasks.filter((task) => task.project_id === projectFilter && (!search || `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase())))} projects={projects} onOpen={openTask} onStatusChange={(task, status) => void updateTask(task, { status })} /></section>}</div>}

          {activeView === 'calendar' && <div className="view-content"><div className="view-toolbar"><p>{upcomingTasks.length} open task{upcomingTasks.length === 1 ? '' : 's'} with a due date</p></div>{upcomingTasks.length ? <section className="content-panel"><header className="panel-header"><div><h2>Upcoming work</h2><p>Sorted by due date from your workspace tasks</p></div><CalendarDays aria-hidden="true" /></header><div className="calendar-list">{upcomingTasks.map((task) => <button className="calendar-row" key={task.id} type="button" onClick={() => openTask(task)}><span className="calendar-date"><strong>{new Date(`${task.due_date}T12:00:00`).getDate()}</strong><small>{new Date(`${task.due_date}T12:00:00`).toLocaleDateString(undefined, { month: 'short' })}</small></span><span className="calendar-task-copy"><strong>{task.title}</strong><small>{projectById.get(task.project_id)} · {statusLabel[task.status]}</small></span><span className={`priority-label ${task.priority}`}>{task.priority}</span><ChevronRight aria-hidden="true" /></button>)}</div></section> : <section className="content-panel"><div className="empty-state"><span className="empty-state-icon"><CalendarDays aria-hidden="true" /></span><h3>No upcoming due dates</h3><p>Tasks with due dates will appear here. Create a task and choose when it is due.</p><button className="button button-secondary" type="button" onClick={() => setCreateDialog(projects.length ? 'task' : 'project')}>{projects.length ? 'Create a task' : 'Create a project'} <ArrowRight aria-hidden="true" /></button></div></section>}</div>}

          {activeView === 'inbox' && <div className="view-content"><div className="view-toolbar"><p>{unreadCount} unread update{unreadCount === 1 ? '' : 's'}</p></div><section className="content-panel"><header className="panel-header"><div><h2>Workspace inbox</h2><p>Assignments and updates delivered to your account</p></div><Bell aria-hidden="true" /></header>{notifications.length ? <div className="notification-list">{notifications.map((notification) => <article className="notification-row" key={notification.id}><span className={`notification-dot ${notification.read_at ? 'read' : ''}`} /><div className="notification-copy"><strong>{notification.title}</strong>{notification.body && <p>{notification.body}</p>}<small>{new Date(notification.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</small></div>{!notification.read_at && <button type="button" onClick={() => markRead(notification)}>Mark read</button>}{notification.task_id && <button type="button" onClick={() => { const task = tasks.find((item) => item.id === notification.task_id); if (task) void openTask(task) }}>Open task</button>}</article>)}</div> : <div className="empty-state"><span className="empty-state-icon"><Bell aria-hidden="true" /></span><h3>You&apos;re all caught up</h3><p>New task assignments and workspace updates will show up here.</p></div>}</section></div>}

          {activeView === 'team' && <div className="view-content"><div className="view-toolbar"><p>{members.length} workspace member{members.length === 1 ? '' : 's'}</p></div><section className="content-panel"><header className="panel-header"><div><h2>Your team</h2><p>Workspace membership and access roles</p></div><Users aria-hidden="true" /></header>{members.length ? <div className="member-list">{members.map((member) => { const memberName = member.display_name || (member.user_id === user.id ? user.name : 'Workspace member'); return <div className="member-row" key={member.user_id}><span className="user-avatar">{member.avatar_url ? <img src={member.avatar_url} alt="" /> : initials(memberName)}</span><span className="member-row-copy"><strong>{memberName}{member.user_id === user.id ? ' (you)' : ''}</strong><small>{member.user_id === user.id ? user.email : 'Member of this workspace'}</small></span><span className="role-badge">{member.role}</span></div>})}</div> : <div className="empty-state"><span className="empty-state-icon"><Users aria-hidden="true" /></span><h3>No members found</h3><p>Workspace members will be listed here.</p></div>}</section><p className="team-note">Invitations and external guest access are not enabled in this version.</p></div>}

          {activeView === 'reports' && <div className="view-content"><div className="view-toolbar"><p>Based on {tasks.length} task{tasks.length === 1 ? '' : 's'} across {projects.length} project{projects.length === 1 ? '' : 's'}</p></div><div className="report-grid"><section className="report-card"><h2>Tasks by status</h2><p>Current distribution across this workspace</p>{taskStatuses.map((status) => { const count = tasks.filter((task) => task.status === status).length; const width = tasks.length ? Math.round((count / tasks.length) * 100) : 0; return <div className="report-bar-row" key={status}><span>{statusLabel[status]}</span><div className="report-bar"><i style={{ width: `${width}%` }} /></div><strong>{count}</strong></div> })}</section><section className="report-card"><h2>Projects by status</h2><p>Current distribution across this workspace</p>{(['active', 'planned', 'on_hold', 'completed', 'archived'] as const).map((status) => { const count = projects.filter((project) => project.status === status).length; const width = projects.length ? Math.round((count / projects.length) * 100) : 0; return <div className="report-bar-row" key={status}><span>{status.replace('_', ' ')}</span><div className="report-bar"><i style={{ width: `${width}%` }} /></div><strong>{count}</strong></div> })}</section><section className="report-card"><h2>Task priorities</h2><p>How work is currently prioritized</p>{(['urgent', 'high', 'medium', 'low', 'none'] as const).map((priority) => { const count = tasks.filter((task) => task.priority === priority).length; const width = tasks.length ? Math.round((count / tasks.length) * 100) : 0; return <div className="report-bar-row" key={priority}><span>{priority === 'none' ? 'No priority' : priority}</span><div className="report-bar"><i style={{ width: `${width}%` }} /></div><strong>{count}</strong></div> })}</section><section className="report-card report-summary"><h2>Workspace snapshot</h2><p>Live totals from your current workspace</p><div className="report-summary-stats"><span><strong>{activeProjects.length}</strong><small>Active projects</small></span><span><strong>{openTasks.length}</strong><small>Open tasks</small></span><span><strong>{completedTasks.length}</strong><small>Completed</small></span></div></section></div></div>}

          {activeView === 'settings' && <div className="view-content"><section className="content-panel"><header className="panel-header"><div><h2>Workspace settings</h2><p>Basic details and access for this workspace</p></div><Activity aria-hidden="true" /></header><form className="settings-form" onSubmit={saveWorkspaceSettings}><label className="field-label">Workspace name<input value={settingsName} onChange={(event) => setSettingsName(event.target.value)} maxLength={80} required disabled={!canManageSettings} /></label><label className="field-label">Workspace URL<input value={workspace.slug} readOnly /></label><p className="settings-help">{canManageSettings ? 'Only workspace owners and admins can update these details.' : 'You can view workspace details, but only an owner or admin can change them.'}</p><button className="button button-primary" type="submit" disabled={savingSettings || !canManageSettings || !settingsName.trim()}>{savingSettings ? <LoaderCircle className="spin" aria-hidden="true" /> : 'Save changes'}</button></form></section><section className="content-panel preference-panel"><header className="panel-header"><div><h2>Appearance</h2><p>Choose the theme for this browser session</p></div></header><div className="appearance-setting"><span>Color theme<small>{isLight ? 'Light' : 'Dark'} mode is currently active</small></span><button className="button button-secondary" type="button" onClick={() => setIsLight((current) => !current)}>{isLight ? 'Switch to dark' : 'Switch to light'}</button></div></section></div>}
        </div>
      </main>

      {createDialog === 'project' && <ProjectDialog onClose={() => setCreateDialog(null)} onSubmit={createProject} />}
      {createDialog === 'task' && <TaskDialog projects={projects} initialProjectId={projectFilter} onClose={() => setCreateDialog(null)} onSubmit={createTask} />}
      {selectedTask && <TaskDetailDialog task={selectedTask} project={projects.find((project) => project.id === selectedTask.project_id)} comments={comments} members={members} currentUser={user} loadingComments={loadingComments} onClose={() => setSelectedTask(null)} onUpdate={(patch) => void updateTask(selectedTask, patch)} onPostComment={postComment} />}
      {toast && <div className="toast-message" role="status">{toast}</div>}
    </div>
  )
}
