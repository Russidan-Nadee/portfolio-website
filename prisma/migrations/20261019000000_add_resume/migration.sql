CREATE TABLE "resumes" (
    "id" TEXT NOT NULL DEFAULT 'current',
    "storagePath" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- Resume metadata is managed only by the server, never by public REST clients.
ALTER TABLE "resumes" ENABLE ROW LEVEL SECURITY;
