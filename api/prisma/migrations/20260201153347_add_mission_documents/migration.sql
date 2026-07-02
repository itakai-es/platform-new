-- CreateTable
CREATE TABLE "mission_documents" (
    "id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mission_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mission_documents" ADD CONSTRAINT "mission_documents_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
