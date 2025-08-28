import { LoginForm } from "@/components/auth/LoginForm";
import { FolderKanban } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <FolderKanban className="h-8 w-8" />
            </div>
          <h1 className="text-3xl font-bold">Welcome to ProjectZen</h1>
          <p className="text-muted-foreground">Sign in to manage your projects</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
