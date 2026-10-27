// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  blankContent,
  type ProjectContent,
  type ProjectData,
} from "../../../src/app/admin/projects/types";

// Keep the editor, save action, and public renderer real; replace external I/O.
const database = vi.hoisted(() => ({
  content: null as ProjectContent | null,
  writes: 0,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      update: async ({ data }: { data: { content: ProjectContent } }) => {
        database.content = JSON.parse(JSON.stringify(data.content));
        database.writes++;
      },
    },
  },
}));
vi.mock("next/cache", () => ({
  revalidatePath: () => {},
  revalidateTag: () => {},
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: () => {}, refresh: () => {} }),
  usePathname: () => "/en/portfolio/example/",
}));
import ProjectEditor from "../../../src/app/admin/projects/[id]/ProjectEditor";
import ProjectDetailContent from "../../../src/app/portfolio/[slug]/ProjectDetailContent";
import { updateProjectContent } from "../../../src/app/admin/projects/actions";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
let editorKey = 0;
const iframeUrl = "https://demo.example.com/embed?view=portfolio";

function projectFixture(): ProjectData {
  return {
    id: "project-1",
    slug: "example",
    order: 0,
    title: { th: "", en: "Example", ja: "" },
    description: { th: "", en: "Example project", ja: "" },
    tags: { th: [], en: [], ja: [] },
    filterTags: ["web"],
    techSummary: "React",
    technologies: ["React"],
    thumbnailUrl: "/images/example.png",
    overviewImageUrl: "/images/overview.png",
    overviewImageAlt: { th: "", en: "Example overview", ja: "" },
    repoUrl: null,
    demoUrl: null,
    liveUrl: null,
    duration: { th: "", en: "1 month", ja: "" },
    status: { th: "", en: "Complete", ja: "" },
    company: "Personal",
    featured: false,
    content: blankContent(),
  };
}
function withMedia(
  project: ProjectData,
  type: "image" | "iframe",
  url = iframeUrl
) {
  Object.assign(project.content.overview, { media: { type, iframeUrl: url } });
  return project;
}
function publicPage(project: ProjectData) {
  const page = document.createElement("div");
  page.innerHTML = renderToStaticMarkup(
    <ProjectDetailContent
      project={project}
      navigation={{ projectNumber: 1, totalProjects: 1 }}
    />
  );
  return page;
}
async function openOverview(project: ProjectData) {
  await act(async () =>
    root.render(<ProjectEditor key={++editorKey} project={project} />)
  );
  await clickButton("Overview");
}
async function clickButton(label: string) {
  const button = Array.from(container.querySelectorAll("button")).find(
    (item) => item.textContent === label
  );
  expect(button, `button ${label} should be available`).toBeDefined();
  await act(async () => button!.click());
}
function modeSelect() {
  const select = container.querySelector<HTMLSelectElement>(
    "#overview-media-type"
  );
  expect(
    select,
    "admin should offer an Overview media selector"
  ).not.toBeNull();
  return select!;
}
async function chooseMode(value: "image" | "iframe") {
  const select = modeSelect();
  await act(async () => {
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
}
async function enterUrl(value: string) {
  const input = container.querySelector<HTMLInputElement>(
    "#overview-iframe-url"
  );
  expect(input, "iframe mode should offer a URL field").not.toBeNull();
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )!.set!.call(input, value);
    input!.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
beforeEach(() => {
  database.content = null;
  database.writes = 0;
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe("Overview media on the public project page", () => {
  it("keeps the original image for projects saved before media selection existed", () => {
    const page = publicPage(projectFixture());
    expect(page.querySelector("iframe")).toBeNull();
    const image = page.querySelector<HTMLImageElement>(
      'img[alt="Example overview"]'
    );
    expect(image).not.toBeNull();
    expect(image!.parentElement!.style.aspectRatio).toBe("4 / 3");
  });
  it.each([
    ["/images/overview.png", "4 / 3"],
    [
      "/images/projects/asset-management/asset-management-overview.jpg",
      "16 / 9",
    ],
  ])("renders the iframe in the same frame as image %s", (imagePath, ratio) => {
    const project = withMedia(projectFixture(), "iframe");
    project.overviewImageUrl = imagePath;
    const page = publicPage(project);
    const frame = page.querySelector("iframe");
    expect(
      frame,
      "iframe mode should render the saved embed URL"
    ).not.toBeNull();
    expect(frame!.getAttribute("src")).toBe(iframeUrl);
    expect(frame!.getAttribute("title")).toBeTruthy();
    expect(frame!.parentElement!.style.aspectRatio).toBe(ratio);
    expect(frame!.className).toContain("w-full");
    expect(frame!.className).toContain("h-full");
    expect(page.querySelector('img[alt="Example overview"]')).toBeNull();
  });
  it("shows the image when image mode has a previously saved iframe URL", () => {
    const page = publicPage(withMedia(projectFixture(), "image"));
    expect(page.querySelector("iframe")).toBeNull();
    expect(page.querySelector('img[alt="Example overview"]')).not.toBeNull();
  });
});
describe("Overview media editing and saving", () => {
  it("defaults the admin selector to image for an existing project", async () => {
    await openOverview(projectFixture());
    expect(modeSelect().value).toBe("image");
  });
  it.each(["https://demo.example.com/embed", "http://localhost:3000/demo"])(
    "saves URL %s and restores iframe mode when reopened",
    async (url) => {
      const project = projectFixture();
      await openOverview(project);
      await chooseMode("iframe");
      await enterUrl(url);
      await clickButton("Save Overview");
      expect(database.writes).toBe(1);
      expect(database.content!.overview).toMatchObject({
        media: { type: "iframe", iframeUrl: url },
      });
      const saved = { ...project, content: database.content! };
      expect(
        publicPage(saved).querySelector("iframe")!.getAttribute("src")
      ).toBe(url);
      await openOverview(saved);
      expect(modeSelect().value).toBe("iframe");
      expect(
        container.querySelector<HTMLInputElement>("#overview-iframe-url")!.value
      ).toBe(url);
    }
  );
  it("keeps both sources when switching to image, saving, and reopening", async () => {
    const project = withMedia(projectFixture(), "iframe");
    await openOverview(project);
    await chooseMode("image");
    await clickButton("Save Overview");
    expect(database.content!.overview).toMatchObject({
      media: { type: "image", iframeUrl },
    });
    const saved = { ...project, content: database.content! };
    const page = publicPage(saved);
    expect(page.querySelector("iframe")).toBeNull();
    expect(page.querySelector('img[alt="Example overview"]')).not.toBeNull();
    expect(saved.overviewImageUrl).toBe("/images/overview.png");
    await openOverview(saved);
    expect(modeSelect().value).toBe("image");
    await chooseMode("iframe");
    expect(
      container.querySelector<HTMLInputElement>("#overview-iframe-url")!.value
    ).toBe(iframeUrl);
  });
  it("shows a validation error instead of saving an empty iframe URL", async () => {
    await openOverview(projectFixture());
    await chooseMode("iframe");
    await clickButton("Save Overview");
    expect(database.writes).toBe(0);
    expect(container.querySelector('[role="alert"]')?.textContent).toBeTruthy();
    expect(
      container
        .querySelector("#overview-iframe-url")!
        .getAttribute("aria-invalid")
    ).toBe("true");
  });
  it.each([
    "",
    "   ",
    "not-a-url",
    "/relative",
    "ftp://example.com",
    "javascript:alert(1)",
    "data:text/html,example",
  ])("rejects invalid iframe URL %j before writing any data", async (url) => {
    const project = withMedia(projectFixture(), "iframe", url);
    await expect(
      updateProjectContent(project.id, project.content, project.slug)
    ).rejects.toThrow();
    expect(database.writes).toBe(0);
  });
});
