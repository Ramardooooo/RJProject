export type RjWorkspace = {
  id: string
  name: string
  slug: string
  created_by: string
  created_at: string
}

export type RjProject = {
  id: string
  workspace_id: string
  name: string
  description: string
  status: 'active' | 'planned' | 'on_hold' | 'completed' | 'archived'
  priority: 'urgent' | 'high' | 'medium' | 'low'
  owner_id: string
  start_date: string | null
  due_date: string | null
  created_at: string
  updated_at: string
}

export type RjTask = {
  id: string
  project_id: string
  title: string
  description: string
  status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done'
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none'
  assignee_id: string | null
  created_by: string
  due_date: string | null
  position: number
  labels: string[]
  created_at: string
  updated_at: string
}

export type RjNotification = {
  id: string
  user_id: string
  actor_id: string | null
  task_id: string | null
  kind: 'assignment' | 'comment' | 'mention' | 'deadline' | 'project_update'
  title: string
  body: string
  read_at: string | null
  created_at: string
}

export type RjMember = {
  user_id: string
  role: 'owner' | 'admin' | 'member' | 'guest'
  display_name: string | null
  avatar_url: string | null
}
