-- Separate frontend and backend technologies instead of one broad development category.
ALTER TYPE "TechnologyCategory" RENAME TO "TechnologyCategory_old";

CREATE TYPE "TechnologyCategory" AS ENUM (
  'FRONTEND',
  'BACKEND',
  'BASE_DE_DONNEES',
  'OUTILS_DEVOPS',
  'METHODOLOGIES',
  'AUTRES'
);

ALTER TABLE "Technology"
  ALTER COLUMN "category" TYPE "TechnologyCategory"
  USING (
    CASE
      WHEN "category"::text = 'DEVELOPPEMENT' AND lower("name") IN ('node.js', 'express.js', 'socket.io') THEN 'BACKEND'
      WHEN "category"::text = 'DEVELOPPEMENT' THEN 'FRONTEND'
      ELSE "category"::text
    END
  )::"TechnologyCategory";

DROP TYPE "TechnologyCategory_old";
