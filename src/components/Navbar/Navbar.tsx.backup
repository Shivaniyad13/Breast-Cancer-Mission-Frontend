import { auth, signOut } from "@/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    // Suppress dynamic page pre-rendering errors during next build phase
  }
  const user = session?.user;

  // Sign out server action
  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <NavbarClient 
      user={user ? { name: user.name, email: user.email, role: user.role } : undefined} 
      handleSignOut={handleSignOut} 
    />
  );
}
