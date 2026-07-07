import { useState } from 'react';
import { HiOutlineUser, HiOutlineBell, HiOutlineShieldCheck, HiOutlineOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FormField, TextInput } from '../../components/ui/FormField';

const TABS = [
  { key: 'profile', label: 'Profile', icon: HiOutlineUser },
  { key: 'organization', label: 'Organization', icon: HiOutlineOfficeBuilding },
  { key: 'notifications', label: 'Notifications', icon: HiOutlineBell },
  { key: 'security', label: 'Security', icon: HiOutlineShieldCheck },
];

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-4 border-b last:border-0" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
    <div>
      <p className="text-xs font-semibold text-[#F8FAFC]">{label}</p>
      <p className="text-[11px] text-[#64748B] mt-0.5">{description}</p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className="w-11 h-6 rounded-full relative transition-colors shrink-0"
      style={{ backgroundColor: checked ? '#3B82F6' : 'rgba(148,163,184,0.2)' }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow"
        style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  </div>
);

const SettingsPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [notifs, setNotifs] = useState({ email: true, push: false, weekly: true });

  const handleSave = () => toast.success('Settings saved');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] mb-1.5">Preferences</p>
        <h1 className="text-3xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>
          Settings
        </h1>
        <p className="text-[#64748B] text-xs mt-1.5">Manage your account, organization, and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1 flex lg:flex-col gap-1.5 overflow-x-auto custom-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                tab === t.key ? 'text-white' : 'text-[#94A3B8] hover:bg-white/5'
              }`}
              style={tab === t.key ? { backgroundColor: 'rgba(59,130,246,0.14)' } : {}}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <Card className="lg:col-span-3">
          {tab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
                >
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">{user?.email || 'user@ewm.edu'}</p>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1">{user?.role?.replace('_', ' ') || 'Employee'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Full Name">
                  <TextInput defaultValue={user?.email?.split('@')[0] || ''} />
                </FormField>
                <FormField label="Email Address">
                  <TextInput defaultValue={user?.email || ''} disabled className="opacity-60" />
                </FormField>
              </div>
              <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            </div>
          )}

          {tab === 'organization' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Organization Name">
                  <TextInput defaultValue="EWM Platform" />
                </FormField>
                <FormField label="Time Zone">
                  <TextInput defaultValue="UTC+05:30 — Asia/Kolkata" />
                </FormField>
              </div>
              <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <Toggle checked={notifs.email} onChange={(v) => setNotifs({ ...notifs, email: v })} label="Email notifications" description="Get updates about leave, payroll, and approvals." />
              <Toggle checked={notifs.push} onChange={(v) => setNotifs({ ...notifs, push: v })} label="Push notifications" description="Real-time alerts in your browser." />
              <Toggle checked={notifs.weekly} onChange={(v) => setNotifs({ ...notifs, weekly: v })} label="Weekly digest" description="A Monday morning summary of workforce activity." />
              <div className="pt-6">
                <Button variant="primary" onClick={handleSave}>Save Preferences</Button>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-6">
              <FormField label="Current Password">
                <TextInput type="password" placeholder="••••••••" />
              </FormField>
              <FormField label="New Password">
                <TextInput type="password" placeholder="••••••••" />
              </FormField>
              <Button variant="primary" onClick={handleSave}>Update Password</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
