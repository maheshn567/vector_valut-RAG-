-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "doc_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "doc_name" TEXT NOT NULL,
    "doc_path" TEXT NOT NULL,
    "doc_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_doc_id_key" ON "documents"("doc_id");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;
