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
import { LocaleProvider } from "@/components/layout/LocaleProvider";
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

describe("optional project detail sections", () => {
  async function openTab(project: ProjectData, tab: string) {
    project = { ...project, overviewImageUrl: "" };
    await act(async () =>
      root.render(
        <ProjectDetailContent
          project={project}
          navigation={{ projectNumber: 1, totalProjects: 1 }}
        />
      )
    );
    await clickButton(tab);
  }

  function headings() {
    return Array.from(container.querySelectorAll("h3, h4")).map(
      (heading) => heading.textContent
    );
  }

  it.each([
    { label: "null", value: null },
    { label: "missing", value: undefined },
    { label: "empty", value: [] },
  ])(
    "hides the Challenges section when its data is $label while retaining technical details",
    async ({ value }) => {
      const project = projectFixture();
      project.content.technical.details = [
        { key: "Framework", value: { th: "", en: "Next.js", ja: "" } },
      ];
      Object.assign(project.content.technical, { challenges: value });
      await openTab(project, "Technical Details");
      expect(headings()).not.toContain("Challenges");
      expect(container.textContent).toContain("Next.js");
    }
  );

  it("shows the Challenges heading and content when a challenge exists", async () => {
    const project = projectFixture();
    project.content.technical.challenges = [
      {
        title: { th: "", en: "Responsive layout", ja: "" },
        description: {
          th: "",
          en: "Adapted the supplied design for mobile.",
          ja: "",
        },
      },
    ];
    await openTab(project, "Technical Details");
    expect(headings()).toContain("Challenges");
    expect(container.textContent).toContain("Responsive layout");
    expect(container.textContent).toContain(
      "Adapted the supplied design for mobile."
    );
  });

  it.each([
    { label: "null", value: null },
    { label: "missing", value: undefined },
    { label: "empty", value: [] },
  ])(
    "hides Future Goals when its data is $label while retaining results",
    async ({ value }) => {
      const project = projectFixture();
      project.content.results = [
        {
          title: { th: "", en: "Live website", ja: "" },
          description: { th: "", en: "Delivered the website.", ja: "" },
        },
      ];
      Object.assign(project.content, { futureGoals: value });
      await openTab(project, "Results");
      expect(headings()).not.toContain("Future Goals");
      expect(container.textContent).toContain("Delivered the website.");
    }
  );

  it("shows the Future Goals heading and content when a goal exists", async () => {
    const project = projectFixture();
    project.content.futureGoals = [
      { description: { th: "", en: "Add another language.", ja: "" } },
    ];
    await openTab(project, "Results");
    expect(headings()).toContain("Future Goals");
    expect(container.querySelector("li")?.textContent).toContain(
      "Add another language."
    );
  });
});

describe("Gallery tab visibility", () => {
  async function mountProject(project: ProjectData) {
    await act(async () =>
      root.render(
        <ProjectDetailContent
          project={{ ...project, overviewImageUrl: "" }}
          navigation={{ projectNumber: 1, totalProjects: 1 }}
        />
      )
    );
  }

  it.each([
    { label: "null", value: null },
    { label: "missing", value: undefined },
    { label: "empty", value: [] },
  ])(
    "hides the Gallery tab when gallery data is $label without affecting other tabs",
    async ({ value }) => {
      const project = projectFixture();
      Object.assign(project.content, { gallery: value });
      await mountProject(project);
      const buttons = Array.from(container.querySelectorAll("button"));
      expect(buttons.some((button) => button.textContent === "Gallery")).toBe(
        false
      );
      expect(container.textContent).toContain("About the Project");
      await clickButton("Features");
      expect(container.textContent).toContain("Key Features");
    }
  );

  it("shows a working Gallery tab and its image when gallery data exists", async () => {
    const project = projectFixture();
    project.content.gallery = [
      {
        url: "/images/gallery.png",
        alt: { th: "", en: "Project screenshot", ja: "" },
      },
    ];
    await mountProject(project);
    await clickButton("Gallery");
    const image = container.querySelector<HTMLImageElement>(
      'img[alt="Project screenshot"]'
    );
    expect(image).not.toBeNull();
    expect(image!.getAttribute("src")).toContain("gallery.png");
    expect(container.textContent).toContain("Screenshots");
    await clickButton("Overview");
    expect(container.textContent).toContain("About the Project");
  });
});

describe("project information without development duration", () => {
  it.each([
    {
      locale: "th",
      durationLabel:
        "\u0e23\u0e30\u0e22\u0e30\u0e40\u0e27\u0e25\u0e32\u0e1e\u0e31\u0e12\u0e19\u0e32",
      durationValue: "91 \u0e27\u0e31\u0e19",
      statusLabel: "\u0e2a\u0e16\u0e32\u0e19\u0e30",
      statusValue:
        "\u0e40\u0e1c\u0e22\u0e41\u0e1e\u0e23\u0e48\u0e41\u0e25\u0e49\u0e27",
      companyLabel: "\u0e1a\u0e23\u0e34\u0e29\u0e31\u0e17",
      technologyLabel:
        "\u0e40\u0e17\u0e04\u0e42\u0e19\u0e42\u0e25\u0e22\u0e35\u0e2b\u0e25\u0e31\u0e01",
    },
    {
      locale: "en",
      durationLabel: "Development Duration",
      durationValue: "91 days",
      statusLabel: "Status",
      statusValue: "Published",
      companyLabel: "Company",
      technologyLabel: "Core Technologies",
    },
    {
      locale: "ja",
      durationLabel: "\u958b\u767a\u671f\u9593",
      durationValue: "91\u65e5\u9593",
      statusLabel: "\u30b9\u30c6\u30fc\u30bf\u30b9",
      statusValue: "\u516c\u958b\u6e08\u307f",
      companyLabel: "\u4f1a\u793e",
      technologyLabel: "\u4e3b\u8981\u6280\u8853",
    },
  ])(
    "omits duration but retains the three useful information fields in $locale",
    ({
      locale,
      durationLabel,
      durationValue,
      statusLabel,
      statusValue,
      companyLabel,
      technologyLabel,
    }) => {
      const project = projectFixture();
      project.duration = {
        th: durationValue,
        en: durationValue,
        ja: durationValue,
      };
      project.status = { th: statusValue, en: statusValue, ja: statusValue };
      project.company = "Example Client";
      const page = document.createElement("div");
      page.innerHTML = renderToStaticMarkup(
        <LocaleProvider locale={locale as "th" | "en" | "ja"}>
          <ProjectDetailContent
            project={project}
            navigation={{ projectNumber: 1, totalProjects: 1 }}
          />
        </LocaleProvider>
      );
      expect(page.textContent).not.toContain(durationLabel);
      expect(page.textContent).not.toContain(durationValue);
      const status = Array.from(page.querySelectorAll("div")).find(
        (element) => element.textContent === statusLabel
      );
      expect(status).toBeDefined();
      const informationGrid = status!.parentElement!.parentElement!;
      expect(informationGrid.children.length).toBe(3);
      expect(informationGrid.textContent).toContain(statusValue);
      expect(informationGrid.textContent).toContain(companyLabel);
      expect(informationGrid.textContent).toContain("Example Client");
      expect(informationGrid.textContent).toContain(technologyLabel);
      expect(informationGrid.textContent).toContain("React");
    }
  );
});
