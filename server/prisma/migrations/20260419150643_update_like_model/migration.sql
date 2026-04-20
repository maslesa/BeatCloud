/*
  Warnings:

  - A unique constraint covering the columns `[userID,trackID]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_userID_trackID_key" ON "Like"("userID", "trackID");
