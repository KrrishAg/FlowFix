-- DropForeignKey
ALTER TABLE "public"."UserCredentials" DROP CONSTRAINT "UserCredentials_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserCredentials" ADD CONSTRAINT "UserCredentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
