import { useState } from 'react';
import { coursePages, type ClassData } from './shared';

interface Props {
	cls: ClassData;
}

/** 专业详情面板：知识体系（通识 / 共同学科基础 / 专业知识领域）+ 各示例课程清单 */
export default function MajorPanel({ cls }: Props) {
	const [idx, setIdx] = useState(0);
	const major = cls.majors[Math.min(idx, cls.majors.length - 1)];
	if (!major) return null;

	return (
		<section className="cc-block">
			<header className="cc-block-head">
				<h3>专业详情</h3>
				<p>选择专业查看国标附录给出的知识领域与核心课程示例清单（括号内为建议学时数）。</p>
			</header>

			<div className="cc-major-tabs">
				{cls.majors.map((m, i) => (
					<button
						key={m.code}
						className={`cc-major-tab${i === idx ? ' on' : ''}`}
						onClick={() => setIdx(i)}
					>
						<span>{m.name}</span>
						<em>{m.code}</em>
					</button>
				))}
			</div>

			<div className="cc-knowledge">
				<div className="cc-know-row">
					<h4>通识类知识</h4>
					<p className="cc-tags">
						{cls.general.map((a) => (
							<span key={a} className="tag gen">{a}</span>
						))}
					</p>
				</div>
				<div className="cc-know-row">
					<h4>学科基础 · 共同核心知识领域</h4>
					<p className="cc-tags">
						{cls.common.map((a) => (
							<span key={a} className="tag com">{a}</span>
						))}
					</p>
				</div>
				{major.base.length > 0 && (
					<div className="cc-know-row">
						<h4>学科基础 · 本专业另修<span>（至少修 4 个领域）</span></h4>
						<p className="cc-tags">
							{major.base.map((a) => (
								<span key={a} className="tag base">{a}</span>
							))}
						</p>
					</div>
				)}
				<div className="cc-know-row">
					<h4>专业知识领域</h4>
					<p className="cc-tags">
						{major.pro.map((a) => (
							<span key={a} className="tag pro">{a}</span>
						))}
					</p>
				</div>
			</div>

			<div className="cc-examples">
				{major.ex.map((ex) => (
					<article key={ex.l} className="cc-example">
						<h4>{major.name} · {ex.l}<span>{ex.c.length} 门</span></h4>
						<ul>
							{ex.c.map(([name, h], i) => (
								<li key={`${name}-${i}`}>
									{coursePages[name] ? (
										<a className="cc-course-link" href={coursePages[name]} title={`${name} · 查看课程介绍`}>{name} ↗</a>
									) : (
										<span>{name}</span>
									)}
									<b>{typeof h === 'number' ? `${h} 学时` : h}</b>
								</li>
							))}
						</ul>
					</article>
				))}
			</div>
		</section>
	);
}
