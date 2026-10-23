import { Fragment, type CSSProperties } from 'react';
import { LEVEL_NAME, inkColor, solidColor, type NodeRec, type SubCounts } from './shared';

interface Props {
	code: string;
	nodeIndex: Map<string, NodeRec>;
	subCounts: Map<string, SubCounts>;
	v2011Rev: Map<string, { c: string; note: string }[]>;
	isicRev: Map<string, string[]>;
	onReveal: (code: string) => void;
}

/** 右侧详情面板:路径面包屑、层级统计、2011 来源与 ISIC 对照(仅小类) */
export default function DetailPane({ code, nodeIndex, subCounts, v2011Rev, isicRev, onReveal }: Props) {
	const rec = nodeIndex.get(code);
	if (!rec) return null;
	const { node: n, path, menIdx } = rec;
	const lvl = code.length;
	const s = subCounts.get(code)!;
	const old = v2011Rev.get(code) ?? [];
	const ic = isicRev.get(code) ?? [];

	return (
		<>
			<div className="d-path">
				{path.map((p, i) => (
					<Fragment key={p.c}>
						{i > 0 && <span className="crumb-sep">›</span>}
						<button
							type="button"
							className={`crumb lv${p.c.length}`}
							style={{ '--c': solidColor(menIdx, i === path.length - 1 ? 42 : 55) } as CSSProperties}
							onClick={() => onReveal(p.c)}
						>
							{p.c} {p.n}
						</button>
					</Fragment>
				))}
			</div>
			<div className="d-head">
				<span className="d-badge" style={{ background: solidColor(menIdx), color: '#fff' }}>
					{n.c}
				</span>
				<div>
					<h3>{n.n}</h3>
					<span className="d-level" style={{ color: inkColor(menIdx) }}>
						{LEVEL_NAME[lvl]}
					</span>
				</div>
			</div>
			{n.d && <p className="d-desc">{n.d}</p>}
			{n.ch && (
				<div className="d-stats">
					{s.d > 0 && (
						<div className="d-stat">
							<b>{s.d}</b>
							<span>大类</span>
						</div>
					)}
					{s.z > 0 && (
						<div className="d-stat">
							<b>{s.z}</b>
							<span>中类</span>
						</div>
					)}
					<div className="d-stat">
						<b>{s.x}</b>
						<span>小类</span>
					</div>
				</div>
			)}
			{lvl === 4 && (
				<>
					<div className="d-block">
						<h4>GB/T 4754—2011 来源</h4>
						<div className="tags">
							{old.length ? (
								old.map((o, i) => (
									<span key={i} className="tag">
										{o.c}
										{o.note && <em> {o.note}</em>}
									</span>
								))
							) : (
								<span className="muted">无直接对应记录</span>
							)}
						</div>
					</div>
					<div className="d-block">
						<h4>ISIC Rev.4 对应</h4>
						<div className="tags">
							{ic.length ? (
								ic.map((c) => (
									<span key={c} className="tag tag-blue">
										{c}
									</span>
								))
							) : (
								<span className="muted">无对应记录</span>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}
