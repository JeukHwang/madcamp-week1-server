-- DropForeignKey
ALTER TABLE `UserFeed` DROP FOREIGN KEY `UserFeed_taggedUserName_fkey`;

-- AddForeignKey
ALTER TABLE `UserFeed` ADD CONSTRAINT `UserFeed_taggedUserName_fkey` FOREIGN KEY (`taggedUserName`) REFERENCES `User`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
