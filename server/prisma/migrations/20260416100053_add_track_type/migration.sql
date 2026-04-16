/*
  Warnings:

  - Added the required column `trackType` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TrackType" AS ENUM ('SONG', 'LOOP', 'SAMPLE', 'BEAT', 'ACAPELLA');

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "trackType" "TrackType" NOT NULL;
