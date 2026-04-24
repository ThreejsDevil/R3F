import React from 'react';

// Common Page Header
function PageHeader({ title, num }: { title: string; num: string }) {
  return (
    <div className="flex justify-between items-center mb-6 pb-3.5 border-b border-[rgba(255,255,255,0.08)]">
      <span className="font-jetbrains text-[10px] tracking-[0.3em] text-accent">{title}</span>
      <span className="font-jetbrains text-[10px] text-text-muted">{num}</span>
    </div>
  );
}

export function getMockPages(repoName: string = "nova / renderer") {
  return [
    // 0: Cover
    <div key="page-0" className="flex flex-col justify-center items-start h-[calc(100%-60px)] pr-5">
      <PageHeader title="CODEX" num="표지" />
      <div className="font-jetbrains text-[10px] tracking-[0.3em] text-accent mb-4">행성 관측 기록</div>
      <h3 className="text-[32px] font-light mb-3 leading-[1.15]">
        <span className="text-text-muted">{repoName.split('/')[0]?.trim()}</span> /<br/>
        <span className="font-semibold">{repoName.split('/')[1]?.trim() || "renderer"}</span>
      </h3>
      <div className="text-[13px] text-text-dim leading-[1.6] mb-7">대기권 밖에서도 부드럽게 동작하는 경량 리액티브 렌더링 코어.</div>
      <div className="font-jetbrains text-[10px] text-text-muted tracking-[0.15em]">→ 페이지를 넘겨 자세한 기록을 확인하세요</div>
    </div>,

    // 1: Language
    <div key="page-1" className="flex flex-col h-full">
      <PageHeader title="I · 언어 분포" num="01" />
      <h3 className="text-[20px] font-medium tracking-[-0.01em] mb-[18px]">이 행성의 구성</h3>
      <div className="flex h-[10px] rounded-full overflow-hidden mb-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
        <span style={{ width: '62%', background: 'oklch(0.65 0.15 220)' }} />
        <span style={{ width: '22%', background: 'oklch(0.65 0.15 20)' }} />
        <span style={{ width: '10%', background: 'oklch(0.65 0.15 180)' }} />
        <span style={{ width: '6%', background: 'oklch(0.65 0.15 280)' }} />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5 text-[13px]"><span className="w-2.5 h-2.5 rounded-full" style={{background:'oklch(0.65 0.15 220)'}}></span><span className="flex-1 text-text">TypeScript</span><span className="font-jetbrains text-[11px] text-text-dim">62%</span></div>
        <div className="flex items-center gap-2.5 text-[13px]"><span className="w-2.5 h-2.5 rounded-full" style={{background:'oklch(0.65 0.15 20)'}}></span><span className="flex-1 text-text">Rust</span><span className="font-jetbrains text-[11px] text-text-dim">22%</span></div>
        <div className="flex items-center gap-2.5 text-[13px]"><span className="w-2.5 h-2.5 rounded-full" style={{background:'oklch(0.65 0.15 180)'}}></span><span className="flex-1 text-text">Go</span><span className="font-jetbrains text-[11px] text-text-dim">10%</span></div>
      </div>
    </div>,

    // 2: Activity
    <div key="page-2" className="flex flex-col h-full">
      <PageHeader title="II · 활동 지표" num="02" />
      <h3 className="text-[20px] font-medium tracking-[-0.01em] mb-[18px]">최근 움직임</h3>
      <div className="grid grid-cols-2 gap-2.5 mb-[18px]">
        <div className="bg-[rgba(18,19,42,0.4)] rounded-xl p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
          <div className="font-jetbrains text-[9px] tracking-[0.2em] text-text-muted mb-1">최근 90일 커밋</div>
          <div className="text-[18px] font-semibold">1,842</div>
          <div className="font-jetbrains text-[10px] text-accent">+12%</div>
        </div>
        <div className="bg-[rgba(18,19,42,0.4)] rounded-xl p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
          <div className="font-jetbrains text-[9px] tracking-[0.2em] text-text-muted mb-1">월평균 PR</div>
          <div className="text-[18px] font-semibold">64</div>
          <div className="font-jetbrains text-[10px] text-accent">안정</div>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(26,1fr)] gap-[3px] mb-[18px]">
        {Array.from({ length: 182 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-[2px] bg-[rgba(255,255,255,0.04)]" style={{ opacity: Math.random() * 0.8 + 0.2 }} />
        ))}
      </div>
    </div>,

    // 3: Contributors
    <div key="page-3" className="flex flex-col h-full">
      <PageHeader title="III · 기여자" num="03" />
      <h3 className="text-[20px] font-medium tracking-[-0.01em] mb-[18px]">궤도 위의 사람들</h3>
      <div className="flex flex-col gap-2.5">
        {['soyun.oh', 'minjae.k', 'haneul.p'].map((n, i) => (
          <div key={n} className="flex items-center gap-3 py-2 px-2.5 bg-[rgba(18,19,42,0.5)] rounded-xl">
            <div className="w-[26px] h-[26px] rounded-full bg-linear-to-br from-[oklch(0.55_0.15_220)] to-[oklch(0.35_0.1_220)] text-[10px] text-white flex items-center justify-center shadow-[inset_-2px_-2px_3px_rgba(0,0,0,0.4)] font-jetbrains">
              {n.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 text-[12px] text-text">{n}</div>
            <div className="font-jetbrains text-[11px] text-text-dim">{1000 - i * 300} 커밋</div>
          </div>
        ))}
      </div>
    </div>,

    // 4: Releases
    <div key="page-4" className="flex flex-col h-full">
      <PageHeader title="IV · 릴리스" num="04" />
      <h3 className="text-[20px] font-medium tracking-[-0.01em] mb-[18px]">주요 버전</h3>
      <div className="flex flex-col gap-3.5">
        <div className="p-3 bg-[rgba(18,19,42,0.4)] rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
          <div className="font-jetbrains text-[13px] text-accent mb-1">v2.4.0 <span className="text-text-muted text-[10px]">· 최신</span></div>
          <div className="text-[11px] text-text-dim">안정화 릴리스 · 3주 전</div>
        </div>
        <div className="p-3 bg-[rgba(18,19,42,0.4)] rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
          <div className="font-jetbrains text-[13px] text-text mb-1">v2.3.0</div>
          <div className="text-[11px] text-text-dim">성능 개선 · 2달 전</div>
        </div>
      </div>
    </div>,

    // 5: Summary
    <div key="page-5" className="flex flex-col h-full">
      <PageHeader title="V · 요약" num="05" />
      <h3 className="text-[20px] font-medium tracking-[-0.01em] mb-[18px]">개요</h3>
      <div className="text-[13px] text-text-dim leading-[1.75]">
        <p className="mb-3">대기권 밖에서도 부드럽게 동작하는 경량 리액티브 렌더링 코어.</p>
        <p className="mb-3 text-text-muted font-jetbrains text-[11px]">```<br/>$ npm install {repoName.replace(' / ', '-')}<br/>```</p>
        <p>이 행성은 5명의 항해자와 12개의 활성 궤도체와 함께 운영되고 있습니다.</p>
      </div>
    </div>,

    // 6: Ratings
    <div key="page-6" className="flex flex-col h-full">
      <PageHeader title="VI · 총평" num="06" />
      <h3 className="text-[20px] font-medium tracking-[-0.01em] mb-[18px]">궤도 안정성</h3>
      <div className="flex flex-col gap-3">
        {['활동 강도', '커뮤니티 응집도', '문서화 밀도', '테스트 커버리지'].map((k, i) => (
          <div key={k}>
            <div className="font-jetbrains text-[10px] text-text-muted tracking-[0.2em] mb-1.5">{k}</div>
            <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-accent to-[oklch(0.82_0.14_220)]" style={{ width: `${80 - i * 10}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>,

    // 7: Back Cover
    <div key="page-7" className="flex flex-col justify-center items-center text-center h-[calc(100%-60px)]">
      <PageHeader title="CODEX" num="뒷표지" />
      <div className="w-[60px] h-[60px] rounded-full border border-accent flex items-center justify-center text-accent font-jetbrains text-[12px] mb-5 mt-auto">END</div>
      <div className="text-[14px] text-text-dim leading-[1.6] max-w-[260px] mb-auto">관측 종료. 이 행성의 기록을 읽어주셔서 감사합니다. 언제든 다시 방문해주세요.</div>
    </div>
  ];
}
