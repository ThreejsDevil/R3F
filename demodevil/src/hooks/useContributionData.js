import { useState, useMemo } from "react";

/**
 * 기여도 그리드 데이터를 반환하는 훅.
 *
 * 현재는 랜덤 더미 데이터를 생성하며, 추후 GitHub API 연동으로 교체 가능.
 * API 연동 시 이 훅의 내부만 수정하면 되고 사용처(App)는 변경 불필요.
 *
 * @returns {{
 *   data: number[][],
 *   isLoading: boolean,
 *   error: Error|null
 * }}
 */
export default function useContributionData() {
  const [isLoading] = useState(false);
  const [error] = useState(null);

  // TODO: GitHub API 연동 시 아래 더미 데이터를 fetch 로직으로 교체
  const data = useMemo(
    () =>
      Array.from({ length: 7 }, () =>
        Array.from({ length: 26 }, () => Math.floor(Math.random() * 5)),
      ),
    [],
  );

  return { data, isLoading, error };
}
