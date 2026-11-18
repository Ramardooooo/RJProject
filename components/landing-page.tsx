import Link from 'next/link'
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, CircleCheck, Clock3, Layers3, ListTodo, MessageSquareText, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react'

const features = [
  { icon: Layers3, title: 'Projects with a plan', description: 'Keep goals, owners, timelines, and progress connected to the work itself.' },
  { icon: ListTodo, title: 'Tasks that move', description: 'Turn big milestones into clear next steps, with status and priority in context.' },
  { icon: Users, title: 'One team, one picture', description: 'Bring the people doing the work into the same shared workspace.' },
]

const previewTasks = [
  { name: 'Finalize launch messaging', project: 'Product launch', status: 'In progress', color: 'purple', date: 'Today' },
  { name: 'Review onboarding flow', project: 'Product launch', status: 'In review', color: 'blue', date: 'Tomorrow' },
  { name: 'Share campaign brief', project: 'Brand refresh', status: 'To do', color: 'gray', date: 'Nov 21' },
]

export function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-nav">
        <Link href="/" className="brand-lockup"><span className="brand-mark"><Layers3 aria-hidden="true" /></span><span>RJProject</span></Link>
        <nav className="landing-nav-links" aria-label="Main navigation">
          <a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#pricing">Pricing</a>
        </nav>
        <div className="landing-nav-actions"><Link href="/login" className="text-link">Sign in</Link><Link href="/signup" className="button button-primary button-sm">Get started <ArrowUpRight aria-hidden="true" /></Link></div>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> PLAN BETTER. WORK SMARTER. BUILD TOGETHER.</p>
          <h1>Everything your team needs to <span>move projects forward.</span></h1>
          <p className="hero-description">Plan projects, organize tasks, collaborate with your team, and turn ideas into results — all in one workspace.</p>
          <div className="hero-actions"><Link href="/signup" className="button button-primary">Get started <ArrowRight aria-hidden="true" /></Link><a href="#features" className="button button-ghost">Explore features <ArrowDownRight aria-hidden="true" /></a></div>
          <div className="hero-proof"><div className="avatar-stack" aria-hidden="true"><span>AM</span><span>JR</span><span>SK</span><span>+</span></div><p><strong>Built for focused teams</strong><br />One shared view of what matters next.</p></div>
        </div>

        <div className="hero-visual" aria-label="Illustrative preview of the RJProject workspace">
          <div className="preview-window">
            <div className="preview-titlebar"><div className="preview-dots"><i /><i /><i /></div><span>workspace / overview</span><button aria-label="More preview options" type="button"><span>•••</span></button></div>
            <div className="preview-app">
              <aside className="preview-sidebar">
                <div className="preview-workspace"><span className="preview-workspace-icon">R</span><span>Ridge Studio<small>Free workspace</small></span><ChevronDown aria-hidden="true" /></div>
                <div className="preview-nav-active"><span className="preview-nav-icon">⌂</span> Overview</div>
                <div className="preview-nav-item"><ListTodo aria-hidden="true" /> My tasks <span className="preview-count">4</span></div>
                <div className="preview-nav-item"><Layers3 aria-hidden="true" /> Projects</div>
                <div className="preview-divider" />
                <p className="preview-label">YOUR PROJECTS</p>
                <div className="preview-project"><i className="project-dot lavender" /> Product launch</div>
                <div className="preview-project"><i className="project-dot cyan" /> Brand refresh</div>
              </aside>
              <div className="preview-main">
                <div className="preview-top"><span>Tuesday, November 18, 2026</span><span className="preview-user">AM</span></div>
                <div className="preview-greeting"><div><small>YOUR WORKSPACE</small><h2>Good morning, Alex</h2><p>Here&apos;s the latest across your team.</p></div><span className="preview-date"><CalendarDays aria-hidden="true" /> This week</span></div>
                <div className="preview-metrics"><div><small>ACTIVE PROJECTS</small><strong>06</strong><span>Across your workspace</span></div><div><small>TASKS COMPLETED</small><strong>24</strong><span>This month</span></div><div><small>UP NEXT</small><strong>03</strong><span>Due in 7 days</span></div></div>
                <div className="preview-task-head"><div><strong>Team focus</strong><small>Keep the momentum going</small></div><button type="button" aria-label="Open task list"><ArrowUpRight aria-hidden="true" /></button></div>
                <div className="preview-task-list">{previewTasks.map((task) => <div className="preview-task" key={task.name}><span className={`preview-check ${task.color}`} /> <span className="preview-task-name">{task.name}<small>{task.project}</small></span><span className={`preview-status ${task.color}`}>{task.status}</span><span className="preview-task-date"><Clock3 aria-hidden="true" /> {task.date}</span></div>)}</div>
                <div className="preview-progress"><span>Launch readiness</span><div><i /></div><strong>72%</strong></div>
              </div>
            </div>
          </div>
          <div className="floating-note"><span><CircleCheck aria-hidden="true" /></span><div><strong>All in sync</strong><small>Progress is easy to see.</small></div></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Product principles"><span><ShieldCheck aria-hidden="true" /> Thoughtful by default</span><i /><span><Zap aria-hidden="true" /> Clear next steps</span><i /><span><MessageSquareText aria-hidden="true" /> Better together</span></section>

      <section className="section-block" id="features">
        <div className="section-heading"><p className="eyebrow">LESS BUSYWORK, MORE MOMENTUM</p><h2>Everything in its right place.</h2><p>RJProject brings the moving parts together, so your team can spend less time coordinating and more time making progress.</p></div>
        <div className="feature-grid">{features.map(({ icon: Icon, title, description }, index) => <article className="feature-item" key={title}><span className="feature-icon"><Icon aria-hidden="true" /></span><span className="feature-index">0{index + 1}</span><h3>{title}</h3><p>{description}</p><a href="#how-it-works">Learn more <ArrowRight aria-hidden="true" /></a></article>)}</div>
      </section>

      <section className="workflow-section" id="how-it-works">
        <div className="workflow-copy"><p className="eyebrow">A BETTER WAY TO GET THERE</p><h2>From “what if” to “we did it.”</h2><p>Start with a shared goal. Make the work visible. Keep conversations close to the decisions they move forward.</p><Link href="/signup" className="text-link text-link-accent">Make your next move <ArrowRight aria-hidden="true" /></Link></div>
        <div className="workflow-steps"><div className="workflow-step"><span>01</span><div><h3>Bring the plan together</h3><p>Give every project a clear owner, outcome, and timeline.</p></div><Check aria-hidden="true" /></div><div className="workflow-step"><span>02</span><div><h3>Make the next step obvious</h3><p>Break work into manageable tasks with real ownership.</p></div><Check aria-hidden="true" /></div><div className="workflow-step"><span>03</span><div><h3>Keep your team in sync</h3><p>See what is moving and what needs attention at a glance.</p></div><Check aria-hidden="true" /></div></div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="section-heading"><p className="eyebrow">SIMPLE BY DESIGN</p><h2>Start with the work. Grow from there.</h2><p>Get your team organized with the essentials. No billing setup is needed to create your first workspace.</p></div>
        <div className="pricing-row"><article className="pricing-card"><p className="pricing-label">STARTER</p><h3>Find your flow.</h3><p>One workspace for the projects and tasks that keep your team moving.</p><ul><li><Check aria-hidden="true" /> Shared project workspace</li><li><Check aria-hidden="true" /> Task lists and project boards</li><li><Check aria-hidden="true" /> Team visibility</li></ul><Link href="/signup" className="button button-secondary button-full">Get started <ArrowRight aria-hidden="true" /></Link></article><article className="pricing-card pricing-card-featured"><span className="pricing-badge"><Sparkles aria-hidden="true" /> MADE FOR MOMENTUM</span><p className="pricing-label">TEAM</p><h3>Make it together.</h3><p>Everything your growing team needs to plan, prioritize, and deliver.</p><ul><li><Check aria-hidden="true" /> Multiple projects and collaborators</li><li><Check aria-hidden="true" /> Shared task ownership</li><li><Check aria-hidden="true" /> Workspace reporting</li></ul><Link href="/signup" className="button button-primary button-full">Create a workspace <ArrowRight aria-hidden="true" /></Link></article><article className="pricing-card"><p className="pricing-label">BUSINESS</p><h3>Scale with clarity.</h3><p>More structure and visibility for teams working across initiatives.</p><ul><li><Check aria-hidden="true" /> Role-based workspace access</li><li><Check aria-hidden="true" /> Project and task visibility</li><li><Check aria-hidden="true" /> Centralized team workflow</li></ul><Link href="/signup" className="button button-secondary button-full">Get started <ArrowRight aria-hidden="true" /></Link></article></div>
        <p className="pricing-note">Plan details are a product overview, not a billing offer. Workspace billing is not enabled in this version.</p>
      </section>

      <section className="faq-section" id="faq"><div><p className="eyebrow">GOOD TO KNOW</p><h2>Questions, answered.</h2></div><div className="faq-list"><details><summary>What is RJProject? <ChevronDown aria-hidden="true" /></summary><p>A shared workspace for planning projects, organizing tasks, and keeping a team aligned around the work.</p></details><details><summary>How do I get started? <ChevronDown aria-hidden="true" /></summary><p>Create an account, set up a workspace, and start adding projects and tasks. Email confirmation may be required.</p></details><details><summary>Can my team work together? <ChevronDown aria-hidden="true" /></summary><p>Workspace membership and role controls are backed by Supabase. Team invitations are not enabled in this version yet.</p></details></div></section>

      <section className="closing-cta"><div><p className="eyebrow">GOOD WORK STARTS WITH A CLEAR NEXT STEP</p><h2>Move your next project forward.</h2></div><Link href="/signup" className="button button-primary">Create your workspace <ArrowRight aria-hidden="true" /></Link></section>

      <footer className="landing-footer"><Link href="/" className="brand-lockup"><span className="brand-mark"><Layers3 aria-hidden="true" /></span><span>RJProject</span></Link><p>Plan Better. Work Smarter. Build Together.</p><div><a href="#features">Features</a><a href="#pricing">Pricing</a><Link href="/login">Sign in</Link></div><small>© 2026 RJProject. Built for teams that move ideas forward.</small></footer>
    </main>
  )
}
