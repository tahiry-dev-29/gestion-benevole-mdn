import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ put: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("@vercel/blob", () => ({ put: mocks.put }));

import { storeImageUpload, storePdfUpload } from "./upload-file.server";

describe("server file uploads", () => {
  beforeEach(() => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test-token");
    mocks.put.mockResolvedValue({ url: "https://blob.test/file" });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    mocks.put.mockReset();
  });

  it("rejects PDF content without the PDF file signature", async () => {
    const file = new File(["not a pdf"], "certificate.pdf", {
      type: "application/pdf",
    });

    await expect(storePdfUpload("certificat", file)).resolves.toEqual({
      success: false,
      error: "Le fichier fourni n'est pas un PDF valide.",
      status: 400,
    });
    expect(mocks.put).not.toHaveBeenCalled();
  });

  it("accepts a valid PDF signature and stores it as a PDF", async () => {
    const file = new File(["%PDF-1.7\nbody"], "certificate.pdf", {
      type: "application/pdf",
    });

    await expect(storePdfUpload("certificat", file)).resolves.toEqual({
      success: true,
      url: "https://blob.test/file",
    });
    expect(mocks.put).toHaveBeenCalledWith(
      expect.stringMatching(/^certificat-[\da-f-]+\.pdf$/),
      expect.any(Buffer),
      expect.objectContaining({ contentType: "application/pdf" })
    );
  });

  it("rejects unsupported image types", async () => {
    const file = new File(["image"], "profile.gif", { type: "image/gif" });
    const result = await storeImageUpload(file);

    expect(result.success).toBe(false);
    expect(mocks.put).not.toHaveBeenCalled();
  });

  it("rejects executable files uploaded as CV documents", async () => {
    const file = new File(["binary"], "resume.exe", {
      type: "application/x-msdownload",
    });

    await expect(storePdfUpload("cv", file)).resolves.toMatchObject({
      success: false,
      status: 400,
      error: "Seuls les fichiers PDF sont acceptés.",
    });
    expect(mocks.put).not.toHaveBeenCalled();
  });

  it("rejects files larger than the PDF limit", async () => {
    const file = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.pdf", {
      type: "application/pdf",
    });

    const result = await storePdfUpload("cv", file);

    expect(result.success).toBe(false);
    expect(mocks.put).not.toHaveBeenCalled();
  });
});
