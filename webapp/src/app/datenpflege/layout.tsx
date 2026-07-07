import { UserHeader } from "@/app/_components/UserHeader/UserHeader";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserHeader />
      <>{children}</>
    </>
  );
}
