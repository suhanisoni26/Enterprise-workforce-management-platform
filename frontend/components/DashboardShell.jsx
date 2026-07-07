'use client';

import { useState } from 'react';
import Icon from './Icon';

const nav = [
  ['grid', 'Overview'], ['users', 'People'], ['building', 'Organization'],
  ['calendar', 'Time off'], ['chart', 'Analytics'], ['sparkle', 'Nexora AI'],
];

const people = [
  ['AM', 'Aarav Mehta', 'Product Design', 'Active'],
  ['SK', 'Sara Kim', 'Engineering', 'Active'],
  ['NO', 'Noah Okafor', 'Finance', 'Away'],
  ['LP', 'Lina Patel', 'People Ops', 'Active'],
];

export default function DashboardShell() {
  const [active, setActive] = useState('Overview');
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand"><span className="brand-mark">N</span><span>Nexora</span></div>
        <button className="workspace"><span className="workspace-avatar">AC</span><span><b>Acme, Inc.</b><small>Enterprise workspace</small></span><span className="chevron">⌄</span></button>
        <nav>
          <p className="nav-label">Workspace</p>
          {nav.map(([icon, label]) => <button key={label} onClick={() => { setActive(label); setOpen(false); }} className={active === label ? 'nav-active' : ''}><Icon name={icon}/><span>{label}</span>{label === 'Nexora AI' && <em>AI</em>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <button><Icon name="settings"/><span>Settings</span></button>
          <div className="profile"><span className="avatar">MY</span><span><b>Mohit Yadav</b><small>Administrator</small></span><span>•••</span></div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(!open)}>☰</button>
          <div className="search"><Icon name="search"/><span>Search people, teams, or reports...</span><kbd>⌘ K</kbd></div>
          <div className="top-actions"><button><Icon name="bell"/><i/></button><button className="invite">Invite people</button></div>
        </header>

        <div className="content">
          <section className="welcome"><div><p className="eyebrow">Thursday, July 2</p><h1>Good afternoon, Mohit.</h1><p>Here’s what’s happening across your organization today.</p></div><button className="primary">View insights <Icon name="arrow"/></button></section>

          <section className="metrics">
            <Metric title="Total employees" value="248" delta="12 this month" icon="users" tone="blue" />
            <Metric title="Present today" value="231" delta="93.1% attendance" icon="check" tone="green" />
            <Metric title="On leave" value="11" delta="4 requests pending" icon="calendar" tone="amber" />
            <Metric title="Open positions" value="18" delta="6 in final stage" icon="trend" tone="violet" />
          </section>

          <section className="grid-main">
            <div className="panel workforce">
              <PanelHead title="Workforce overview" subtitle="Employee growth over the last 6 months" action="View report" />
              <div className="chart-legend"><span><i className="dot purple"/>Headcount</span><b>+18.4% <small>vs. last period</small></b></div>
              <div className="chart">
                <div className="ylabels"><span>250</span><span>200</span><span>150</span><span>100</span><span>50</span></div>
                <svg viewBox="0 0 700 210" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#635bff" stopOpacity=".28"/><stop offset="1" stopColor="#635bff" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 174 C70 168 92 152 140 148 S218 123 280 132 S370 96 420 105 S510 74 560 78 S640 44 700 38 L700 210 L0 210Z"/><path className="line" d="M0 174 C70 168 92 152 140 148 S218 123 280 132 S370 96 420 105 S510 74 560 78 S640 44 700 38"/></svg>
                <div className="xlabels"><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span></div>
              </div>
            </div>

            <div className="panel ai-card">
              <div className="ai-orb"><Icon name="sparkle" size={24}/></div><p className="eyebrow">Nexora AI</p><h2>Your operations copilot</h2><p>Ask questions, spot trends, and take action across your workforce.</p>
              <div className="prompt-list"><button>Who needs my attention today?<Icon name="arrow"/></button><button>Summarize this week’s attendance<Icon name="arrow"/></button><button>Show hiring pipeline risks<Icon name="arrow"/></button></div>
              <button className="ask-ai"><Icon name="sparkle"/>Ask Nexora AI</button>
            </div>
          </section>

          <section className="grid-bottom">
            <div className="panel people-panel"><PanelHead title="Recently joined" subtitle="New teammates this month" action="View all"/><div className="people-table"><div className="table-row table-head"><span>Employee</span><span>Department</span><span>Status</span></div>{people.map(([initials,name,dept,status])=><div className="table-row" key={name}><span className="person"><i>{initials}</i><b>{name}</b></span><span>{dept}</span><span><em className={status === 'Away' ? 'away' : ''}>{status}</em></span></div>)}</div></div>
            <div className="panel activity"><PanelHead title="Activity" subtitle="Latest organization updates"/><div className="timeline"><Activity color="purple" title="New employee added" meta="Sara Kim joined Engineering" time="12m"/><Activity color="green" title="Leave request approved" meta="3 days · Annual leave" time="1h"/><Activity color="blue" title="Payroll completed" meta="June 2026 · 248 employees" time="3h"/><Activity color="amber" title="Policy updated" meta="Remote work guidelines" time="Yesterday"/></div></div>
          </section>
        </div>
      </main>
      {open && <button className="scrim" aria-label="Close menu" onClick={() => setOpen(false)}/>}
    </div>
  );
}

function Metric({ title, value, delta, icon, tone }) { return <article className="metric"><div className={`metric-icon ${tone}`}><Icon name={icon}/></div><p>{title}</p><div><strong>{value}</strong><span>{delta}</span></div></article> }
function PanelHead({ title, subtitle, action }) { return <div className="panel-head"><div><h2>{title}</h2><p>{subtitle}</p></div>{action && <button>{action}<Icon name="arrow" size={14}/></button>}</div> }
function Activity({ color,title,meta,time }) { return <div className="activity-row"><i className={color}/><div><b>{title}</b><span>{meta}</span></div><small>{time}</small></div> }
