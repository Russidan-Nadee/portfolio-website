import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectHeaderValue } from "../../../src/app/admin/projects/ProjectHeaderFields";

const database = vi.hoisted(() => ({
  rows: [] as Array<{ id: string; slug: string; order: number }>,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findFirst: async ({ orderBy }: { orderBy: { order: "asc" | "desc" } }) =>
        [...database.rows].sort((a, b) =>
          orderBy.order === "asc" ? a.order - b.order : b.order - a.order
        )[0] ?? null,
      create: async ({ data }: { data: { slug: string; order: number } }) => {
        const row = { ...data, id: "new-project" };
        database.rows.push(row);
        return row;
      },
    },
  },
}));
vi.mock("next/cache", () => ({
  revalidatePath: () => {},
  revalidateTag: () => {},
}));

import { createProject } from "../../../src/app/admin/projects/actions";

const header: ProjectHeaderValue = {
  slug: "new-project",
  title: { th: "", en: "New project", ja: "" },
  description: { th: "", en: "", ja: "" },
  tags: { th: [], en: [], ja: [] },
  filterTags: ["web"],
  techSummary: "",
  thumbnailUrl: "",
  overviewImageUrl: "",
  overviewImageAlt: { th: "", en: "", ja: "" },
  repoUrl: null,
  demoUrl: null,
  liveUrl: null,
  duration: { th: "", en: "", ja: "" },
  status: { th: "", en: "", ja: "" },
  company: "",
  technologies: [],
};

describe("new project ordering", () => {
  beforeEach(() => {
    database.rows = [];
  });

  it.each([
    { name: "existing projects", orders: [0, 1, 2], expectedOrder: -1 },
    { name: "an empty portfolio", orders: [], expectedOrder: 0 },
    {
      name: "custom ordering including negative values",
      orders: [7, -8, 3],
      expectedOrder: -9,
    },
  ])(
    "puts the new project first with $name without reordering existing projects",
    async ({ orders, expectedOrder }) => {
      database.rows = orders.map((order, index) => ({
        id: "existing-" + index,
        slug: "existing-" + index,
        order,
      }));
      const before = structuredClone(database.rows);
      const id = await createProject(header);
      const created = database.rows.find((row) => row.id === id);

      expect(created).toMatchObject({
        slug: "new-project",
        order: expectedOrder,
      });
      const displayed = [...database.rows].sort((a, b) => a.order - b.order);
      expect(displayed[0].id).toBe(id);
      expect(database.rows.filter((row) => row.id !== id)).toEqual(before);
    }
  );
});
