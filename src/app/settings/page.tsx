"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Bell,
  Lock,
  Mail,
  Moon,
  Shield,
  Smartphone,
  User,
  Save,
} from "lucide-react";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [notificationSettings, setNotificationSettings] = useState<
    NotificationSetting[]
  >([
    {
      id: "email",
      title: "Email Notifications",
      description: "Receive session reminders and updates via email",
      enabled: true,
    },
    {
      id: "sms",
      title: "SMS Notifications",
      description: "Get text messages for important updates",
      enabled: false,
    },
    {
      id: "session",
      title: "Session Reminders",
      description: "Receive reminders before your tutoring sessions",
      enabled: true,
    },
  ]);

  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    {
      id: "profile",
      title: "Profile Visibility",
      description: "Make your profile visible to tutors",
      enabled: true,
    },
    {
      id: "history",
      title: "Session History",
      description: "Allow tutors to view your past sessions",
      enabled: true,
    },
  ]);

  const [darkMode, setDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleNotification = (id: string) => {
    setNotificationSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const togglePrivacy = (id: string) => {
    setPrivacySettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Account Settings
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={session?.user?.name || ""}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Notification Preferences
              </h2>
            </div>
            <div className="space-y-4">
              {notificationSettings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {setting.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {setting.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotification(setting.id)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                      setting.enabled ? "bg-amber-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        setting.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Privacy & Security
              </h2>
            </div>
            <div className="space-y-4">
              {privacySettings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {setting.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {setting.description}
                    </p>
                  </div>
                  <button
                    onClick={() => togglePrivacy(setting.id)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                      setting.enabled ? "bg-amber-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        setting.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Moon className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Appearance
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-gray-500">
                    Enable dark mode for better viewing at night
                  </p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                    darkMode ? "bg-amber-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      darkMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
