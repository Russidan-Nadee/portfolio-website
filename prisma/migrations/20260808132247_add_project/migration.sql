-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "tags" TEXT[],
    "thumbnailUrl" TEXT NOT NULL,
    "overviewImageUrl" TEXT NOT NULL,
    "overviewImageAlt" JSONB NOT NULL,
    "repoUrl" TEXT,
    "demoUrl" TEXT,
    "liveUrl" TEXT,
    "duration" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "technologies" TEXT[],
    "content" JSONB NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");
