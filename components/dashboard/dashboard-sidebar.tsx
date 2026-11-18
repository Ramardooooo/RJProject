'use client'

import { BarChart3, CalendarDays, ChevronDown, FolderKanban, Inbox, LayoutDashboard, ListTodo, LogOut, Moon, Settings2, Sun, Users, X } from 'lucide-react'
import { RjMember, RjProject, RjWorkspace } from '@/lib/rjproject/types'

type View = 'overview' | 'tasks' | 'projects' | 'calendar' | 'inbox' | 'team' | 'reports' | 'settings'

const navGroups: { label: string; items: { id: View; label: string; icon: typeof LayoutDashboard }[] }[] = [
  { label: 'Workspace', items: [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }, { id: 'tasks', label: 'My tasks', icon: ListTodo }, { id: 'projects', label: 'Projects', icon: FolderKanban }, { id: 'calendar', label: 'Calendar', icon: CalendarDays }] },
  { label: 'Team', items: [{ id: 'inbox', label: 'Inbox', icon: Inbox }, { id: 'team', label: 'Members', icon: Users }, { id: 'reports', label: 'Reports', icon: BarChart3 }] },
]

export function DashboardSidebar({
  activeView,
  onNavigate,
  workspaces,
  workspace,
  projects,
  members,
  currentUser,
  unreadCount,
  onWorkspaceChange,
  onSignOut,
  onThemeToggle,
  isLight,
  isOpen,
  onClose,
}: {
  activeView: View
  onNavigate: (view: View, projectId?: string) => void
  workspaces: RjWorkspace[]
  workspace: RjWorkspace | null
  projects: RjProject[]
  members: RjMember[]
  currentUser: { id: string; name: string; email: string; avatarUrl: string | null }
  unreadCount: number
  onWorkspaceChange: (workspaceId: string) => void
  onSignOut: () => void
  onThemeToggle: () => void
  isLight: boolean
  isOpen: boolean
  onClose: () => void
}) {
  const currentMember = members.find((member) => member.user_id === currentUser.id)
  const initials = currentUser.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'RJ'

  return (
    <>
      <aside className="dashboard-sidebar" aria-label="Workspace navigation">
        <div className="sidebar-brand">
          <span className="brand-mark" aria-hidden="true"><FolderKanban /></span>
          <span className="brand-lockup">RJProject</span>
          <button className="dialog-close sidebar-close" type="button" onClick={onClose} aria-label="Close navigation"><X aria-hidden="true" /></button>
        </div>
        {workspace ? (
          <div className="workspace-select-wrap">
            <span className="workspace-monogram" aria-hidden="true">{workspace.name.trim().slice(0, 1).toUpperCase()}</span>
            <select className="workspace-select" aria-label="Select workspace" value={workspace.id} onChange={(event) => onWorkspaceChange(event.target.value)}>
              {workspaces.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <ChevronDown aria-hidden="true" />
          </div>
        ) : <div className="workspace-select-wrap workspace-select-empty"><span className="workspace-monogram">R</span><span className="workspace-empty-label">Your workspace</span></div>}

        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="sidebar-section-label">{group.label}</p>
            <nav className="sidebar-nav" aria-label={group.label}>
              {group.items.map(({ id, label, icon: Icon }) => (
                <button className={activeView === id ? 'active' : ''} type="button" key={id} onClick={() => onNavigate(id)} aria-current={activeView === id ? 'page' : undefined}>
                  <Icon aria-hidden="true" /><span>{label}</span>{id === 'inbox' && unreadCount > 0 && <span className="nav-count">{unreadCount}</span>}
                </button>
              ))}
            </nav>
          </div>
        ))}

        <div className="sidebar-divider" />
        <div className="sidebar-projects-heading"><p className="sidebar-section-label">Projects</p><span>{projects.length}</span></div>
        <nav className="sidebar-projects" aria-label="Projects">
          {projects.length ? projects.slice(0, 6).map((project) => (
            <button key={project.id} type="button" onClick={() => onNavigate('projects', project.id)} title={project.name}>
              <i className="sidebar-project-dot" aria-hidden="true" /><span>{project.name}</span>
            </button>
          )) : <span className="sidebar-empty">Your projects will appear here</span>}
        </nav>

        <div className="sidebar-bottom">
          <span className="user-avatar" aria-label={currentUser.name}>{currentUser.avatarUrl ? <img src={currentUser.avatarUrl} alt="" /> : initials}</span>
          <span className="sidebar-user-copy"><strong>{currentUser.name || 'RJProject member'}</strong><small>{currentMember?.role ?? 'Workspace member'}</small></span>
          <button type="button" onClick={onThemeToggle} aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'} title="Toggle theme">{isLight ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}</button>
          <button type="button" onClick={onSignOut} aria-label="Sign out" title="Sign out"><LogOut aria-hidden="true" /></button>
        </div>
      </aside>
      {isOpen && <button className="sidebar-scrim" type="button" onClick={onClose} aria-label="Close navigation" />}
    </>
  )
}
