import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getRoleRedirect } from "@/lib/utils";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar
        isAuthenticated={user?.status === "active"}
        portalHref={user ? getRoleRedirect(user.role) : "/portal"}
      />
      <main>{children}</main>
      <Footer />
    </>
  );
}
