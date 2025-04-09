import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState, type ComponentProps } from "react";
import authClient from "~/lib/auth-client";
import { Button } from "~/lib/components/ui/button";
import { cn } from "~/lib/utils";

const REDIRECT_URL = "/dashboard";

export const Route = createFileRoute("/signin")({
  component: AuthPage,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }
  },
});

function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center border rounded-xl gap-8 bg-card p-10">
        <div className="flex flex-col gap-2">
          <SignInWithCredentials />
          <SignInButton provider="google" label="Google" />
        </div>
      </div>
    </div>
  );
}

interface SignInButtonProps extends ComponentProps<typeof Button> {
  provider: "discord" | "google" | "github";
  label: string;
}

function SignInButton({ provider, label, className, ...props }: SignInButtonProps) {
  return (
    <Button
      onClick={() =>
        authClient.signIn.social({
          provider,
          callbackURL: REDIRECT_URL,
        })
      }
      type="button"
      variant="outline"
      size="lg"
      className={cn("text-black hover:text-black cursor-pointer", className)}
      {...props}
    >
      Sign in with {label}
    </Button>
  );
}

function SignInWithCredentials() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        onClick={() =>
          authClient.signUp.email({
            name: username,
            email,
            password,
            fetchOptions: {
              onSuccess: () => {
                router.navigate({ to: REDIRECT_URL });
              },
            },
          })
        }
        type="submit"
      >
        Create Account
      </Button>
    </div>
  );
}
