/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "account_name" VARCHAR(50),
ADD COLUMN     "country" VARCHAR(50),
ADD COLUMN     "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" VARCHAR(50),
ADD COLUMN     "gender" VARCHAR(20),
ADD COLUMN     "last_name" VARCHAR(50),
ADD COLUMN     "occupation" VARCHAR(50),
ADD COLUMN     "password" VARCHAR(200) NOT NULL,
ADD COLUMN     "phone_number" JSONB,
ADD COLUMN     "region" VARCHAR(50),
ADD COLUMN     "relationship_status" VARCHAR(50),
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD COLUMN     "username" VARCHAR(50),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");
