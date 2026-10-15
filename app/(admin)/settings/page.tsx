import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { getProfile } from '@/actions/auth';
import { getBusinessSettings } from '@/actions/settings';
import { isAdmin } from '@/lib/currentUser';
import { ProfileForm } from './ProfileForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { BusinessInfoForm } from './BusinessInfoForm';

export default async function SettingsPage() {
  const [profileResponse, admin] = await Promise.all([getProfile(), isAdmin()]);
  const businessResponse = admin ? await getBusinessSettings() : null;

  const profile = profileResponse?.data;
  const businessSettings = businessResponse?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Manage your account and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Profile Settings">
          {profile ? (
            <ProfileForm user={profile} />
          ) : (
            <p className="text-sm text-red-600">Could not load your profile.</p>
          )}
        </Card>

        <Card title="Change Password">
          <ChangePasswordForm />
        </Card>

        {admin && (
          <Card title="Business Information" subtitle="Shown on printed bills and reports">
            {businessSettings ? (
              <BusinessInfoForm settings={businessSettings} />
            ) : (
              <p className="text-sm text-red-600">Could not load business information.</p>
            )}
          </Card>
        )}

        <Card title="Appearance">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
            <div>
              <p className="text-sm font-medium text-slate-900">Dark Mode</p>
              <p className="text-xs text-slate-500">Easier on the eyes in low light</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        <Card title="System Settings">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
              <span className="text-sm font-medium text-slate-900">API Endpoint</span>
              <code className="text-xs bg-white px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_API_URL}
              </code>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
              <span className="text-sm font-medium text-slate-900">Environment</span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {process.env.NODE_ENV}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
