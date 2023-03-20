/*
  Warnings:

  - Made the column `lat` on table `places` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lng` on table `places` required. This step will fail if there are existing NULL values in that column.
  - Made the column `google_place_id` on table `places` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `places` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "places" ALTER COLUMN "lat" SET NOT NULL,
ALTER COLUMN "lng" SET NOT NULL,
ALTER COLUMN "google_place_id" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL;
