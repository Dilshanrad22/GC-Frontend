import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Manage your account and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Profile Settings">
          <form className="space-y-4">
            <Input label="Full Name" placeholder="Your full name" />
            <Input label="Email" type="email" placeholder="your@email.com" />
            <Input label="Phone" placeholder="Your phone number" />
            <Button>Save Profile</Button>
          </form>
        </Card>

        <Card title="Change Password">
          <form className="space-y-4">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm Password" type="password" />
            <Button>Update Password</Button>
          </form>
        </Card>

        <Card title="Business Information">
          <form className="space-y-4">
            <Input label="Business Name" placeholder="GC Printing & Retail" />
            <Input label="Registration Number" placeholder="Reg. No." />
            <Input label="Address" placeholder="Business address" />
            <Input label="Phone" placeholder="Business phone" />
            <Button>Save Business Info</Button>
          </form>
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
            <p className="text-xs text-slate-500">
              Version: 3.0.0
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
