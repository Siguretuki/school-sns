BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ScrapLikes] (
    [id] NVARCHAR(1000) NOT NULL,
    [scrapId] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ScrapLikes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ScrapLikes_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ScrapLikes_scrapId_userId_key] UNIQUE NONCLUSTERED ([scrapId],[userId])
);

-- AddForeignKey
ALTER TABLE [dbo].[ScrapLikes] ADD CONSTRAINT [ScrapLikes_scrapId_fkey] FOREIGN KEY ([scrapId]) REFERENCES [dbo].[Scraps]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ScrapLikes] ADD CONSTRAINT [ScrapLikes_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
