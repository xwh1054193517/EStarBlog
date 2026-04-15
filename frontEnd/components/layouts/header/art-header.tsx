"use client";

interface ArtHeaderProps {
  title: string;
  subtitle?: string;
}

export default function ArtHeader({ title, subtitle }: ArtHeaderProps) {
  return (
    <header className="art-header">
      <div className="art-header__overlay" />
      <div className="post-info">
        <p className="art-header__eyebrow">TAG ARCHIVE</p>
        <h1 className="post-title">{title}</h1>
        {subtitle ? <p className="art-header__subtitle">{subtitle}</p> : null}
      </div>
    </header>
  );
}
