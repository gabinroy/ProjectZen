
"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { UserManagement } from "@/components/settings/UserManagement";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
    const { user } = useAuth();

    if (user?.role !== 'Admin') {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <p>You do not have permission to view this page.</p>
                </div>
            </MainLayout>
        );
    }
    
  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
                <UserManagement />
            </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
