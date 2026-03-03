import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8">
      <SignIn />
    </div>
  );
}
