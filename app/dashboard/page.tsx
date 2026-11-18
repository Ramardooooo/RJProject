import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardApp } from '@/components/dashboard/dashboard-app'
import { RjMember, RjNotification, RjProject, RjTask, RjWorkspace } from '@/lib/rjproject/types'

export const metadata: Metadata = { title: 'Workspace' }

type Props = { searchParams: Promise<{ workspace?: string }> }

export default async function DashboardPage({ searchParams }: Props) {
  const { workspace: requestedWorkspaceId } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'RJProject member'
  const { data: membershipRows } = await supabase.from('rjp_workspace_members').select('workspace_id, role').eq('user_id', user.id)
  const workspaceIds = (membershipRows ?? []).map((row) => row.workspace_id)
  const { data: workspaceRows } = workspaceIds.length
    ? await supabase.from('rjp_workspaces').select('id, name, slug, created_by, created_at').in('id', workspaceIds).order('created_at', { ascending: true })
    : { data: [] as RjWorkspace[] }
  const workspaces = (workspaceRows ?? []) as RjWorkspace[]
  const workspace = (requestedWorkspaceId && workspaces.find((item) => item.id === requestedWorkspaceId)) || workspaces[0] || null

  if (!workspace) {
    return <DashboardApp user={{ id: user.id, email: user.email ?? '', name: displayName, avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null }} workspaces={workspaces} workspace={null} projects={[]} tasks={[]} notifications={[]} members={[]} />
  }

  const [projectResult, memberResult, notificationResult] = await Promise.all([
    supabase.from('rjp_projects').select('*').eq('workspace_id', workspace.id).order('updated_at', { ascending: false }).limit(100),
    supabase.from('rjp_workspace_members').select('user_id, role').eq('workspace_id', workspace.id),
    supabase.from('rjp_notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
  ])

  const projects = (projectResult.data ?? []) as RjProject[]
  const memberRows = memberResult.data ?? []
  const memberIds = memberRows.map((row) => row.user_id)
  const profileResult = memberIds.length
    ? await supabase.from('rjp_profiles').select('id, display_name, avatar_url').in('id', memberIds)
    : { data: [] }
  const profileById = new Map((profileResult.data ?? []).map((profile) => [profile.id, profile]))
  const members = memberRows.map((row): RjMember => ({
    user_id: row.user_id,
    role: row.role,
    display_name: profileById.get(row.user_id)?.display_name ?? (row.user_id === user.id ? displayName : null),
    avatar_url: profileById.get(row.user_id)?.avatar_url ?? null,
  }))
  const projectIds = projects.map((project) => project.id)
  const taskResult = projectIds.length
    ? await supabase.from('rjp_tasks').select('*').in('project_id', projectIds).order('updated_at', { ascending: false }).limit(250)
    : { data: [] }

  return (
    <DashboardApp
      user={{ id: user.id, email: user.email ?? '', name: displayName, avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null }}
      workspaces={workspaces}
      workspace={workspace}
      projects={projects}
      tasks={(taskResult.data ?? []) as RjTask[]}
      notifications={(notificationResult.data ?? []) as RjNotification[]}
      members={members}
    />
  )
}
