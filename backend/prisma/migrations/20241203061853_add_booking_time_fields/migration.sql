-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "Boats" ALTER COLUMN "amenities" SET DEFAULT ARRAY[]::VARCHAR(255)[],
ALTER COLUMN "rules" SET DEFAULT ARRAY[]::VARCHAR(255)[];

-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "endTime" VARCHAR(5),
ADD COLUMN     "startTime" VARCHAR(5);

-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "photos" SET DEFAULT ARRAY[]::VARCHAR(255)[];

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "idDocuments" SET DEFAULT ARRAY[]::VARCHAR(255)[];

-- CreateTable
CREATE TABLE "BoatFeature" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoatFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BoatFeatures" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BoatFeatures_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoatFeature_name_key" ON "BoatFeature"("name");

-- CreateIndex
CREATE INDEX "_BoatFeatures_B_index" ON "_BoatFeatures"("B");

-- AddForeignKey
ALTER TABLE "_BoatFeatures" ADD CONSTRAINT "_BoatFeatures_A_fkey" FOREIGN KEY ("A") REFERENCES "BoatFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoatFeatures" ADD CONSTRAINT "_BoatFeatures_B_fkey" FOREIGN KEY ("B") REFERENCES "Boats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
