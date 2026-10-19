import { beforeEach, describe, expect, it, vi } from "vitest";

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { project: { findMany } } }));
vi.mock("../../../src/app/admin/projects/ProjectsBoard", () => ({
  default: () => null,
}));

import ProjectsPage from "../../../src/app/admin/projects/page";

describe("admin project list", () => {
  beforeEach(() => findMany.mockReset());

  it("fetches only the fields used by cards, ordered as before", async () => {
    const projects = [
      { id: "first", featured: true },
      { id: "second", featured: false },
    ];
    findMany.mockResolvedValue(projects);
    const page = await ProjectsPage();
    expect(findMany).toHaveBeenCalledWith({
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        order: true,
        title: true,
        techSummary: true,
        thumbnailUrl: true,
        featured: true,
      },
    });
    expect(page.props.initialItems).toBe(projects);
  });

  it("renders an empty board when there are no projects", async () => {
    findMany.mockResolvedValue([]);
    expect((await ProjectsPage()).props.initialItems).toEqual([]);
  });
});
