export class SiteConfigEntity {
  key: string;
  value: string;
  updatedAt: Date;

  constructor(partial: Partial<SiteConfigEntity>) {
    Object.assign(this, partial);
  }
}
