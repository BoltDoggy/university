/** 2026 本科专业目录数据结构与页面共用工具 */

export interface Major {
	code: string;
	name: string;
	is_special: boolean;
	is_state_controlled: boolean;
	note?: string;
	previous_code?: string;
}
export interface MajorClass {
	code: string;
	name: string;
	majors: Major[];
}
export interface Category {
	code: string;
	name: string;
	classes?: MajorClass[];
	majors?: Major[];
}

/** 各学科门类的主题色 */
export const catColor: Record<string, string> = {
	'01': '#8b5cf6',
	'02': '#f59e0b',
	'03': '#ef4444',
	'04': '#10b981',
	'05': '#ec4899',
	'06': '#a16207',
	'07': '#3b82f6',
	'08': '#f97316',
	'09': '#65a30d',
	'10': '#14b8a6',
	'12': '#6366f1',
	'13': '#d946ef',
	'14': '#64748b',
};

/** 门类下的专业类;未设专业类的门类归入一个虚拟组 */
export const groupsOf = (cat: Category): MajorClass[] =>
	cat.classes ?? [{ code: '', name: '未设专业类，直接设置于门类下', majors: cat.majors ?? [] }];

export const majorCount = (cat: Category): number =>
	groupsOf(cat).reduce((n, g) => n + g.majors.length, 0);

export const chipTitle = (m: Major): string =>
	[m.code + ' ' + m.name, m.note ? `注：${m.note}` : ''].filter(Boolean).join(' — ');
