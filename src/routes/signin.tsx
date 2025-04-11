import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState, type ComponentProps } from "react";
import authClient from "~/lib/auth-client";
import { Button } from "~/lib/components/ui/button";
import { cn } from "~/lib/utils";

const REDIRECT_URL = "/";

export const Route = createFileRoute("/signin")({
  component: AuthPage,
  validateSearch: (search) => ({
    returnTo: search?.returnTo as string | undefined,
  }),
  beforeLoad: async ({ context, search }) => {
    if (context.user) {
      throw redirect({
        to: REDIRECT_URL,
        search: {
          returnTo: search?.returnTo,
        },
      });
    }
    return {
      returnTo: search?.returnTo,
    };
  },
  loader: async ({ context }) => {
    return {
      returnTo: context.returnTo as string | undefined,
    };
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
  const { returnTo } = Route.useLoaderData();
  return (
    <Button
      onClick={() =>
        authClient.signIn.social({
          provider,
          callbackURL: returnTo as string,
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
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { returnTo } = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-2">
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
          authClient.signIn.email({
            email,
            password,

            fetchOptions: {
              onSuccess: (ctx) => {
                if (ctx.data?.user) {
                  queryClient.invalidateQueries({ queryKey: ["user"] });
                }
                setLoading(false);
                router.navigate({ to: returnTo as string });
              },
              onRequest: () => {
                setLoading(true);
              },
              onError(context) {
                alert(context.error.message);
                setLoading(false);
              },
            },
          })
        }
        type="submit"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
      </Button>
    </div>
  );
}
