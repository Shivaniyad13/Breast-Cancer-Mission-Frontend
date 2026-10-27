import { buttonVariants } from "@/components/ui/button";

interface WebinarRegisterButtonProps {
  webinarId: string;
  webinarTitle: string;
  currentUser?: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  } | null;
  buttonText?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function WebinarRegisterButton({
  buttonText = "Register Seat",
  className,
  variant = "default",
  size = "sm",
}: WebinarRegisterButtonProps) {
  return (
    <a
      href="https://forms.gle/BxC7NjCFhZk9jSFp8"
      className={buttonVariants({ variant, size, className })}
    >
      {buttonText}
    </a>
  );
}
