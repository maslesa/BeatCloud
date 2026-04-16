/*
  Warnings:

  - Added the required column `audioPublicID` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverPublicID` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "audioPublicID" TEXT NOT NULL,
ADD COLUMN     "coverPublicID" TEXT NOT NULL;
