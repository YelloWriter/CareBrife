import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
const consent = "실제 개인정보·건강정보 없이 공개용 예시만 작성했어요.";
const base = () => process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

test("template form validates empty values and bad files without saving", async ({
  page,
}) => {
  await page.goto("/templates/new/");
  await page.getByRole("button", { name: "템플릿 등록", exact: true }).click();
  await expect(page.locator(".template-error[role=alert]")).toContainText(
    "입력 항목",
  );
  await expect(page.locator("#title-error")).toContainText("2~60자");
  await page
    .locator("#image")
    .setInputFiles({
      name: "not-an-image.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("example"),
    });
  await expect(page.locator("#image-error")).toContainText("PNG, JPG, WebP");
  await expect(page.locator("#image")).toHaveValue("");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
test("invalid dynamic template address shows recovery", async ({ page }) => {
  await page.goto("/templates/not-a-valid-id/");
  await expect(
    page.getByRole("heading", { name: "템플릿을 찾을 수 없어요" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "템플릿 목록으로 돌아가기 →" }),
  ).toHaveAttribute("href", "/templates/");
});
test("template API rejects cross-origin writes before data access", async ({
  request,
}) => {
  const response = await request.post("/api/templates/", {
    headers: { Origin: "https://example.com" },
    multipart: { title: "example" },
  });
  expect(response.status()).toBe(403);
});

test.describe("real Supabase CRUD", () => {
  test.skip(
    process.env.RUN_LIVE_CRUD !== "1",
    "Enable explicitly with configured non-sensitive Supabase demo project.",
  );
  test("register, refresh, list, detail, edit, remove image, confirm delete", async ({
    page,
    request,
  }) => {
    const title = `QA 준비 목록 ${randomUUID().slice(0, 8)}`;
    let id = "";
    let version = 1;
    try {
      await page.goto("/templates/new/");
      await page.getByLabel("템플릿 제목", { exact: false }).fill(title);
      await page.locator("#category").selectOption("진료 전 준비");
      await page
        .locator("#summary")
        .fill("공개 준비 목록을 검증하는 합성 예시입니다.");
      await page
        .locator("#checklist")
        .fill("예약 장소 확인하기\n메모장 챙기기");
      await page
        .locator("#image")
        .setInputFiles("public/figma/logo-small.webp");
      await page.locator("#image_alt").fill("진료한장 서비스 로고 예시");
      await page.getByLabel(consent).check();
      await page
        .getByRole("button", { name: "템플릿 등록", exact: true })
        .click();
      await expect(page).toHaveURL(/\/templates\/[a-f0-9-]+\//);
      id = new URL(page.url()).pathname.split("/")[2];
      await expect(page.getByRole("status")).toContainText("등록했어요");
      await page.reload();
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
      await expect(
        page.getByAltText("진료한장 서비스 로고 예시"),
      ).toBeVisible();
      expect((await request.get(`/api/templates/${id}/image/`)).status()).toBe(
        200,
      );
      await page
        .getByRole("link", { name: "템플릿 목록", exact: false })
        .first()
        .click();
      await page.getByLabel("제목으로 검색").fill(title);
      await page.getByRole("button", { name: "찾기", exact: true }).click();
      await page.getByRole("link", { name: title, exact: true }).click();
      await page.getByRole("link", { name: "수정하기", exact: true }).click();
      await expect(page.locator("#title")).toHaveValue(title);
      await page.locator("#title").fill(`${title} 수정`);
      await page.getByLabel("기존 이미지 삭제", { exact: false }).check();
      await page.getByLabel(consent).check();
      await page
        .getByRole("button", { name: "수정 내용 저장", exact: true })
        .click();
      await expect(page.getByRole("status")).toContainText("수정한 내용");
      version = 2;
      await expect(page.getByText("첨부된 이미지가 없어요.")).toBeVisible();
      expect((await request.get(`/api/templates/${id}/image/`)).status()).toBe(
        404,
      );
      // A stale editor must not overwrite a later update.
      const stale = await request.patch(`/api/templates/${id}/`, {
        headers: { Origin: base() },
        multipart: {
          version: "1",
          title,
          category: "진료 전 준비",
          summary: "공개 준비 목록 예시입니다.",
          checklist: "메모장 챙기기",
          consent: "on",
        },
      });
      expect(stale.status()).toBe(409);
      await page.getByRole("button", { name: "삭제", exact: true }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.getByRole("button", { name: "취소", exact: true }).click();
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await page.getByRole("button", { name: "삭제", exact: true }).click();
      await page.getByRole("button", { name: "삭제하기", exact: true }).click();
      await expect(page).toHaveURL(/\/templates\/\?deleted=1/);
      await expect(page.getByRole("status")).toContainText("삭제했어요");
      await page.goto(`/templates/${id}/`);
      await expect(
        page.getByRole("heading", { name: "템플릿을 찾을 수 없어요" }),
      ).toBeVisible();
    } finally {
      if (id)
        await request.delete(`/api/templates/${id}/`, {
          headers: { Origin: base(), "If-Match": String(version) },
        });
    }
  });
  test("real search, pagination and empty state; rejected upload has no record", async ({
    page,
    request,
  }) => {
    const prefix = `QA${randomUUID().slice(0, 8)}`;
    const ids: string[] = [];
    try {
      for (let i = 0; i < 7; i++) {
        const id = randomUUID();
        const res = await request.post("/api/templates/", {
          headers: { Origin: base() },
          multipart: {
            id,
            title: `${prefix} 준비 ${i}`,
            category: "질문 정리",
            summary: "누구나 사용할 수 있는 공개 예시입니다.",
            checklist: "궁금한 질문 미리 적기",
            consent: "on",
          },
        });
        expect(res.status()).toBe(201);
        ids.push(id);
        if (i === 0) {
          const duplicate = await request.post("/api/templates/", {
            headers: { Origin: base() },
            multipart: {
              id,
              title: `${prefix} 준비 ${i}`,
              category: "질문 정리",
              summary: "누구나 사용할 수 있는 공개 예시입니다.",
              checklist: "궁금한 질문 미리 적기",
              consent: "on",
            },
          });
          expect(duplicate.status()).toBe(409);
        }
      }
      await page.goto(`/templates/?q=${prefix}`);
      await expect(page.locator(".template-card")).toHaveCount(6);
      await page.getByRole("link", { name: "다음 →" }).click();
      await expect(page.locator(".template-card")).toHaveCount(1);
      await page.goto(`/templates/?q=${prefix}-none`);
      await expect(
        page.getByRole("heading", { name: "검색 결과가 없어요" }),
      ).toBeVisible();
      const res = await request.post("/api/templates/", {
        headers: { Origin: base() },
        multipart: {
          id: randomUUID(),
          title: `${prefix} bad`,
          category: "질문 정리",
          summary: "잘못된 이미지 형식 확인 예시입니다.",
          checklist: "예시 항목 확인하기",
          consent: "on",
          image_alt: "예시 그림",
          image: {
            name: "fake.png",
            mimeType: "image/png",
            buffer: Buffer.from("not a png"),
          },
        },
      });
      expect(res.status()).toBe(400);
      const invalid = await request.post("/api/templates/", {
        headers: { Origin: base() },
        multipart: {
          id: randomUUID(),
          title: " ",
          category: "unknown",
          summary: "",
          checklist: "",
          consent: "on",
        },
      });
      expect(invalid.status()).toBe(400);
      expect((await invalid.json()).fields).toHaveProperty("title");
      const tooBig = await request.post("/api/templates/", {
        headers: { Origin: base() },
        multipart: {
          image: {
            name: "large.webp",
            mimeType: "image/webp",
            buffer: Buffer.alloc(2 * 1024 * 1024 + 64001),
          },
        },
      });
      expect(tooBig.status()).toBe(413);
    } finally {
      for (const id of ids)
        await request.delete(`/api/templates/${id}/`, {
          headers: { Origin: base(), "If-Match": "1" },
        });
    }
  });
  test("failed save preserves input and recovers on retry", async ({
    page,
  }) => {
    await page.goto("/templates/new/");
    await page.locator("#title").fill("저장 실패 복구 예시");
    await page.locator("#category").selectOption("동행 체크");
    await page.locator("#summary").fill("실패해도 입력을 유지하는 예시입니다.");
    await page.locator("#checklist").fill("메모장 준비하기");
    await page.getByLabel(consent).check();
    await page.route("**/api/templates/", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: "이미지를 올리지 못했어요. 다시 시도해 주세요.",
        }),
      }),
    );
    await page
      .getByRole("button", { name: "템플릿 등록", exact: true })
      .click();
    await expect(page.locator(".template-error[role=alert]")).toContainText(
      "이미지를 올리지 못했어요",
    );
    await expect(page.locator("#title")).toHaveValue("저장 실패 복구 예시");
    await expect(
      page.getByRole("button", { name: "템플릿 등록", exact: true }),
    ).toBeEnabled();
  });
});
