// @vitest-environment happy-dom
import { act, useState, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DragEndEvent } from "@dnd-kit/core";
import type { GalleryImage } from "../../../src/app/admin/projects/types";

const state = vi.hoisted(() => ({
  onDragEnd: undefined as ((event: DragEndEvent) => void) | undefined,
}));
vi.mock("@dnd-kit/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@dnd-kit/core")>();
  return {
    ...actual,
    DndContext: (props: ComponentProps<typeof actual.DndContext>) => {
      state.onDragEnd = props.onDragEnd;
      return <actual.DndContext {...props} />;
    },
  };
});
vi.mock("@dnd-kit/sortable", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@dnd-kit/sortable")>();
  return { ...actual, useSortable: vi.fn(actual.useSortable) };
});

import { useSortable } from "@dnd-kit/sortable";
import GalleryEditor from "../../../src/app/admin/projects/GalleryEditor";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;
const image = (url: string, en: string): GalleryImage => ({
  url,
  alt: { th: "", en, ja: "" },
});
let root: Root;
let container: HTMLDivElement;
let current: GalleryImage[];

async function mount(
  items: GalleryImage[],
  upload = vi.fn(async () => "uploaded.png")
) {
  function Harness() {
    const [value, setValue] = useState(items);
    current = value;
    return (
      <GalleryEditor items={value} onChange={setValue} onUpload={upload} />
    );
  }
  await act(async () => root.render(<Harness />));
}

async function editAlt(index: number, value: string) {
  const input = container.querySelectorAll<HTMLInputElement>(
    'input[placeholder="alt (en)"]'
  )[index];
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("GalleryEditor", () => {
  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    vi.clearAllMocks();
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("updates one image's alt without rendering every sortable card", async () => {
    const items = Array.from({ length: 20 }, (_, index) =>
      image(`${index}.png`, `${index}`)
    );
    await mount(items);
    vi.mocked(useSortable).mockClear();
    await editAlt(0, "edited");
    expect(current[0].alt.en).toBe("edited");
    expect(current[1]).toBe(items[1]);
    expect(useSortable).toHaveBeenCalledTimes(1);
  });

  it("keeps alt text with its image when reordering duplicate URLs", async () => {
    await mount([image("same.png", "first"), image("same.png", "second")]);
    await act(async () =>
      state.onDragEnd?.({
        active: { id: "gallery-0" },
        over: { id: "gallery-1" },
      } as DragEndEvent)
    );
    expect(current.map((item) => item.alt.en)).toEqual(["second", "first"]);
    await editAlt(0, "second edited");
    expect(current.map((item) => item.alt.en)).toEqual([
      "second edited",
      "first",
    ]);
  });

  it("deletes only the selected occurrence of a duplicate URL", async () => {
    await mount([image("same.png", "first"), image("same.png", "second")]);
    await act(async () =>
      container
        .querySelector<HTMLButtonElement>('button[title="Delete"]')!
        .click()
    );
    expect(current).toEqual([image("same.png", "second")]);
    await editAlt(0, "remaining");
    expect(current[0].alt.en).toBe("remaining");
  });

  it("appends uploads to the latest edits instead of overwriting them", async () => {
    let finish!: (url: string) => void;
    const upload = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          finish = resolve;
        })
    );
    await mount([image("old.png", "before")], upload);
    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]')!;
    Object.defineProperty(input, "files", {
      configurable: true,
      value: [new File(["image"], "new.png", { type: "image/png" })],
    });
    await act(async () =>
      input.dispatchEvent(new Event("change", { bubbles: true }))
    );
    await editAlt(0, "edited while uploading");
    await act(async () => finish("new.png"));
    expect(current).toEqual([
      image("old.png", "edited while uploading"),
      image("new.png", ""),
    ]);
    expect(input.value).toBe("");
  });

  it("keeps edits after a failed upload and allows retry", async () => {
    const alert = vi.fn();
    vi.stubGlobal("alert", alert);
    const upload = vi.fn(async () => {
      throw new Error("Storage unavailable");
    });
    await mount([image("old.png", "kept")], upload);
    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]')!;
    Object.defineProperty(input, "files", {
      configurable: true,
      value: [new File(["image"], "new.png")],
    });
    await act(async () =>
      input.dispatchEvent(new Event("change", { bubbles: true }))
    );
    expect(current).toEqual([image("old.png", "kept")]);
    expect(alert).toHaveBeenCalledWith("Storage unavailable");
    const uploadButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("Upload Images")
    );
    expect(uploadButton?.disabled).toBe(false);
  });
});
