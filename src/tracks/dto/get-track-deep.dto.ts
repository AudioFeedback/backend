import { Prisma } from "@prisma/client";
import { Request } from "express";
import { GetUserWithLabelMemberDto } from "src/users/dto/get-user-with-labelmember.dto";
import { GetUserDto } from "src/users/dto/get-user.dto";
import { GetTrackVersionDeepDto } from "./get-trackversion.deep.dto";

const trackDeep = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: {
    author: true,
    reviewers: {
      include: {
        labelMember: true,
      },
    },
    trackVersions: {
      include: {
        feedback: {
          include: {
            user: true,
          },
        },
      },
    },
  },
});

export type TrackDeep = Prisma.TrackGetPayload<typeof trackDeep>;

export class GetTrackDeepDto {
  id: number;
  title: string;
  genre: string;
  author: GetUserDto;
  trackversions: GetTrackVersionDeepDto[];
  reviewers: GetUserDto[];

  constructor(track: TrackDeep, req: Request) {
    this.id = track.id;
    this.title = track.title;
    this.genre = track.genre;
    this.author = new GetUserDto(track.author);
    this.trackversions = track.trackVersions.map(
      (x) => new GetTrackVersionDeepDto(x, req),
    );
    this.reviewers = track.reviewers.map(
      (x) => new GetUserWithLabelMemberDto(x),
    );
  }
}
