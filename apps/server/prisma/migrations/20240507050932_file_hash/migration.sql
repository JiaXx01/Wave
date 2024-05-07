-- DropIndex
DROP INDEX `File_hash_key` ON `File`;

-- CreateIndex
CREATE INDEX `File_userId_hash_idx` ON `File`(`userId`, `hash`);
