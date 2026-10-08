"use client";
import { useState } from "react";
export function TemplateImage({
  id,
  version,
  alt,
}: {
  id: string;
  version: number;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <p role="status" className="template-empty-image">
      이미지를 불러오지 못했어요. 새로고침해 주세요.
    </p>
  ) : (
    <img
      className="template-image"
      src={`/api/templates/${id}/image/?v=${version}`}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
