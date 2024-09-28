import { destroySession } from "@/app/auth/auth-session";
import { Button } from "@/app/components/ui/button";
import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";

export const Route = createFileRoute("/(landing-page)/")({
  component: LandingPage,
});

function LandingPage() {
  const { user } = useRouteContext({
    from: "__root__",
  });

  const logout = useServerFn(destroySession);

  console.log(user);
  return (
    <div>
      Hello /(landing-page)/!
      <div>
        {user ? (
          <div className="flex flex-col gap-4">
            Hello {user.email}
            <Button onClick={() => logout()}>Logout</Button>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Link to="/login">Login</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        )}
      </div>
    </div>
  );
}
