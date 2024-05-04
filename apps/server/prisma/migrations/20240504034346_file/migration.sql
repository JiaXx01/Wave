-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NULL,
    `path` VARCHAR(191) NOT NULL,
    `isFolder` BOOLEAN NOT NULL,
    `size` INTEGER NULL,
    `type` VARCHAR(191) NULL,
    `suffix` VARCHAR(191) NULL,
    `hash` VARCHAR(191) NULL,
    `folderId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `uploadTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `File_hash_key`(`hash`),
    INDEX `File_userId_path_idx`(`userId`, `path`),
    UNIQUE INDEX `File_userId_path_key`(`userId`, `path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
