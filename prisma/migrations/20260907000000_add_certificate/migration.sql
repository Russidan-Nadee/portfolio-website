-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" JSONB NOT NULL,
    "issuer" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "category" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "credentialUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificates_slug_key" ON "certificates"("slug");

-- CreateIndex
CREATE INDEX "certificates_active_order_idx" ON "certificates"("active", "order");
