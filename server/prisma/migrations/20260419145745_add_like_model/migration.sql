-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "trackID" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
