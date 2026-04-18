import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    let profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await this.prisma.profile.create({
        data: { userId },
      });
    }

    return this.formatProfile(profile);
  }

  async update(userId: string, dto: UpdateProfileDto) {
    await this.ensureUserExists(userId);

    const data: Record<string, unknown> = {};

    if (dto.username !== undefined) {
      data.username = dto.username;
    }

    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new Error('Current password is required to change password');
      }
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const matched = await bcrypt.compare(dto.currentPassword, user.password);
      if (!matched) {
        throw new Error('Current password is incorrect');
      }

      data.password = await bcrypt.hash(dto.newPassword, 10);
    }

    const [user, profile] = await Promise.all([
      Object.keys(data).length > 0
        ? this.prisma.user.update({ where: { id: userId }, data })
        : this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.profile.upsert({
        where: { userId },
        create: { userId },
        update: {},
      }),
    ]);

    return {
      ...this.formatProfile(profile),
      username: user?.username,
    };
  }

  async updateProfileInfo(
    userId: string,
    data: Partial<{
      displayName: string;
      bio: string;
      avatar: string;
      email: string;
      phone: string;
      wechat: string;
      qq: string;
      github: string;
      twitter: string;
      weibo: string;
      bilibili: string;
      youtube: string;
      location: string;
      company: string;
      position: string;
    }>,
  ) {
    await this.ensureUserExists(userId);

    const profile = await this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });

    return this.formatProfile(profile);
  }

  async delete(userId: string) {
    await this.ensureUserExists(userId);
    await this.prisma.profile.delete({ where: { userId } });
    return { message: 'Profile deleted successfully' };
  }

  private async ensureUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
  }

  private formatProfile(profile: {
    id: string;
    displayName: string | null;
    bio: string | null;
    avatar: string | null;
    email: string | null;
    phone: string | null;
    wechat: string | null;
    qq: string | null;
    github: string | null;
    twitter: string | null;
    weibo: string | null;
    bilibili: string | null;
    youtube: string | null;
    location: string | null;
    company: string | null;
    position: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: profile.id,
      displayName: profile.displayName,
      bio: profile.bio,
      avatar: profile.avatar,
      email: profile.email,
      phone: profile.phone,
      wechat: profile.wechat,
      qq: profile.qq,
      github: profile.github,
      twitter: profile.twitter,
      weibo: profile.weibo,
      bilibili: profile.bilibili,
      youtube: profile.youtube,
      location: profile.location,
      company: profile.company,
      position: profile.position,
      userId: profile.userId,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
