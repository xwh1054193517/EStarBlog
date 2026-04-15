import Link from "next/link";

export default function Logo({ subtitle }: { subtitle: string }) {
  return (
    <div className="logo-container">
      <Link href="/" className="logo brighten" aria-label="返回首页">
        {subtitle}
      </Link>
    </div>
  );
}
