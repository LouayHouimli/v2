import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { User } from "better-auth";
import authClient from "../auth-client";
import Image from "./Image";
import { Button } from "./ui/button";

const Navbar = ({ user }: { user: User }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const abrevation = user?.name
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const navItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Posts",
      href: "/posts",
    },
  ];
  return (
    <div className="flex justify-between items-center p-4 ">
      <Image fileName="favicon.png" alt="logo" className="w-10 h-10" />
      <nav className="flex justify-between items-center p-4 gap-4  ">
        <ul className="flex gap-4 space-x-7  items-center">
          {navItems.map((item) => (
            <li key={item.href} className="text-lg font-bold ">
              {item.href === "/posts" ? (
                <Link to={item.href} search={{ category: "all", releaseDate: "all" }}>
                  {item.label}
                </Link>
              ) : (
                <Link to={item.href}>{item.label}</Link>
              )}
            </li>
          ))}
          {user ? (
            <div>
              {user.image ? (
                <img
                  onClick={async () => {
                    await authClient.signOut();
                    await queryClient.invalidateQueries({ queryKey: ["user"] });
                    await router.invalidate();
                  }}
                  src={user.image || ""}
                  alt="logo"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
              ) : (
                <div
                  onClick={async () => {
                    await authClient.signOut();
                    await queryClient.invalidateQueries({ queryKey: ["user"] });
                    await router.invalidate();
                  }}
                  className="w-10 h-10 rounded-full cursor-pointer bg-gray-300 flex items-center justify-center text-2xl font-bold"
                >
                  {abrevation}
                </div>
              )}
            </div>
          ) : (
            <Button variant="default" size="sm">
              <Link to="/signin" search={{ returnTo: undefined }}>
                Sign in
              </Link>
            </Button>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
