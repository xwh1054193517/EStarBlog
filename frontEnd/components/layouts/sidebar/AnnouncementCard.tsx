export default function AnnouncementCard({ announcement }: { announcement: string }) {
  return (
    <div className="card-widget card-announcement">
      <div className="item-headline">
        <i className="ri-megaphone-line announcement-icon" />
        <span>公告</span>
      </div>
      <div className="announcement-content" dangerouslySetInnerHTML={{ __html: announcement }} />
    </div>
  );
}
