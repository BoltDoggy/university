/**
 * 课程关系单一数据源：全部课程页的先修 / 并行 / 后续关系。
 * ml…decision 的关系直接取自各 content.ts；os / ai 的关系在此定义，
 * 并由 OsIntro / AiIntro 反向引用（避免两处维护）。
 */
import { ml } from '../ml/content';
import { dl } from '../dl/content';
import { rl } from '../rl/content';
import { nlp } from '../nlp/content';
import { dialog } from '../dialog/content';
import { llm } from '../llm/content';
import { agent } from '../agent/content';
import { appEng } from '../appeng/content';
import { prodEng } from '../prodeng/content';
import { practice } from '../practice/content';
import { decision } from '../decision/content';

export interface Rel {
	name: string;
	prereq: string[];
	parallel: string[];
	follow: string[];
}

export const osRel: Rel = {
	name: '操作系统',
	prereq: ['程序设计基础', '数据结构', '计算机组成原理'],
	parallel: ['编译原理', '计算机网络'],
	follow: ['分布式系统', '嵌入式系统', '系统安全', '数据库系统'],
};

export const aiRel: Rel = {
	name: '人工智能',
	prereq: ['高等数学', '线性代数', '概率论与数理统计', '程序设计', '数据结构'],
	parallel: ['算法设计与分析', '机器学习导论'],
	follow: ['深度学习', '自然语言处理', '计算机视觉', '强化学习', '大模型技术'],
};

const seriesRels: Rel[] = [ml, dl, rl, nlp, dialog, llm, agent, appEng, prodEng, practice, decision];
const allRels: Rel[] = [osRel, aiRel, ...seriesRels];

/** 非课程页但出现在关系中的基础课归并 */
const ALIAS: Record<string, string> = {
	高等数学: '数学基础',
	线性代数: '数学基础',
	概率论与数理统计: '数学基础',
	程序设计基础: '程序设计',
	软件工程基础: '软件工程',
};

const HREFS: Record<string, string> = {
	操作系统: '/courses/os/',
	人工智能: '/courses/ai/',
	[ml.name]: '/courses/ml/',
	[dl.name]: '/courses/dl/',
	[rl.name]: '/courses/rl/',
	[nlp.name]: '/courses/nlp/',
	[dialog.name]: '/courses/dialog/',
	[llm.name]: '/courses/llm/',
	[agent.name]: '/courses/agent/',
	[appEng.name]: '/courses/app-eng/',
	[prodEng.name]: '/courses/prod-eng/',
	[practice.name]: '/courses/practice/',
	[decision.name]: '/courses/decision/',
};

export interface GNode {
	id: string;
	label: string;
	group: 'base' | 'anchor' | 'series' | 'ext';
	href?: string;
	note?: string;
}

const BASE_NOTES: Record<string, string> = {
	数学基础: '高等数学 · 线性代数 · 概率论与数理统计',
	程序设计: '程序设计 / 程序设计基础',
	数据结构: '',
	计算机组成原理: '',
	软件工程: '软件工程 / 软件工程基础',
};

function nodeId(raw: string): string {
	return ALIAS[raw] ?? raw;
}

export interface GEdge {
	from: string;
	to: string;
	kind: 'req' | 'par';
}

/** 关系中出现但未建介绍页的课程（开关后可见） */
const extNames = (() => {
	const paged = new Set([...Object.keys(BASE_NOTES), ...allRels.map((r) => r.name)]);
	const ext = new Set<string>();
	for (const r of allRels) {
		for (const raw of [...r.prereq, ...r.parallel, ...r.follow]) {
			const id = ALIAS[raw] ?? raw;
			if (!paged.has(id) && id !== r.name) ext.add(id);
		}
	}
	return [...ext].sort((a, b) => a.localeCompare(b, 'zh'));
})();

export const nodes: GNode[] = [
	...Object.keys(BASE_NOTES).map((id) => ({ id, label: id, group: 'base' as const, note: BASE_NOTES[id] })),
	...allRels.map((r) => ({
		id: r.name,
		label: r.name,
		group: r.name === '操作系统' || r.name === '人工智能' ? ('anchor' as const) : ('series' as const),
		href: HREFS[r.name],
	})),
	...extNames.map((id) => ({ id, label: id, group: 'ext' as const })),
];

/** 先修/后续合并为有向 req 边（去重），并行为无向 par 边 */
export const edges: GEdge[] = (() => {
	const req = new Set<string>();
	const par = new Set<string>();
	const nodeIds = new Set(nodes.map((n) => n.id));
	for (const r of allRels) {
		for (const p of r.prereq) {
			const pid = nodeId(p);
			if (nodeIds.has(pid) && pid !== r.name) req.add(`${pid}|${r.name}`);
		}
		for (const f of r.follow) {
			const fid = nodeId(f);
			if (nodeIds.has(fid) && fid !== r.name) req.add(`${r.name}|${fid}`);
		}
		for (const q of r.parallel) {
			const qid = nodeId(q);
			if (nodeIds.has(qid) && qid !== r.name) par.add([r.name, qid].sort().join('|'));
		}
	}
	return [
		...[...req].map((k) => ({ from: k.split('|')[0], to: k.split('|')[1], kind: 'req' as const })),
		...[...par].map((k) => ({ from: k.split('|')[0], to: k.split('|')[1], kind: 'par' as const })),
	];
})();

const pagedIds = new Set(nodes.filter((n) => n.group !== 'ext').map((n) => n.id));
const inPageView = (e: GEdge) => pagedIds.has(e.from) && pagedIds.has(e.to);

export const relStats = {
	courses: allRels.length,
	basics: Object.keys(BASE_NOTES).length,
	reqEdges: edges.filter((e) => e.kind === 'req' && inPageView(e)).length,
	parEdges: edges.filter((e) => e.kind === 'par' && inPageView(e)).length,
	extCount: extNames.length,
	extEdges: edges.filter((e) => !inPageView(e)).length,
};
