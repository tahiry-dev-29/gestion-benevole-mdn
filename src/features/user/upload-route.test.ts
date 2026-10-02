import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(),
  storeImageUpload: vi.fn(),
  storePdfUpload: vi.fn(),
}));

vi.mock("next-auth/jwt", () => ({ getToken: mocks.getToken }));
vi.mock("@/features/user/upload-file.server", () => ({
  storeImageUpload: mocks.storeImageUpload,
  storePdfUpload: mocks.storePdfUpload,
}));

import { NextRequest } from "next/server";

import { POST } from "../../../app/api/upload/route";

function uploadRequest(type: string) {
  const request = new NextRequest("https://app.test/api/upload", {
    method: "POST",
  });
  const file = new File(["bytes"], "upload.png", { type: "image/png" });
  const form = {
    get: (key: string) =>
      key === "type" ? type : key === "file" ? file : null,
  } as FormData;
  vi.spyOn(request, "formData").mockResolvedValue(form);
  return request;
}

describe("upload route authorization", () => {
  beforeEach(() => {
    mocks.getToken.mockReset();
    mocks.storeImageUpload.mockReset();
    mocks.storePdfUpload.mockReset();
  });

  it("allows an active volunteer to upload a profile image", async () => {
    mocks.getToken.mockResolvedValue({ role: "VOLUNTEER", statut: "ACTIF" });
    mocks.storeImageUpload.mockResolvedValue({
      success: true,
      url: "/uploads/profile.png",
    });

    const response = await POST(uploadRequest("image"));

    expect(response.status).toBe(200);
    expect(mocks.storeImageUpload).toHaveBeenCalledOnce();
    expect(mocks.storePdfUpload).not.toHaveBeenCalled();
  });

  it("refuses certificate uploads from volunteers", async () => {
    mocks.getToken.mockResolvedValue({ role: "VOLUNTEER", statut: "ACTIF" });

    const response = await POST(uploadRequest("certificat"));

    expect(response.status).toBe(403);
    expect(mocks.storePdfUpload).not.toHaveBeenCalled();
  });

  it("refuses inactive accounts even for profile images", async () => {
    mocks.getToken.mockResolvedValue({ role: "ADMIN", statut: "INACTIF" });

    const response = await POST(uploadRequest("image"));

    expect(response.status).toBe(403);
    expect(mocks.storeImageUpload).not.toHaveBeenCalled();
  });
});
