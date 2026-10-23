/** 职业分类大典（2022 年版）数据结构与页面共用工具 */

export interface Occupation {
	code: string;
	name: string;
	is_green?: boolean;
	is_digital?: boolean;
}
export interface MinorCategory {
	code: string;
	gbm: string;
	name: string;
	occupations: Occupation[];
}
export interface MiddleCategory {
	code: string;
	gbm: string;
	name: string;
	minors: MinorCategory[];
}
export interface MajorCategory {
	code: string;
	gbm: string;
	name: string;
	middles: MiddleCategory[];
}

/** 各大类的主题色 */
export const catColor: Record<string, string> = {
	'1': '#dc2626',
	'2': '#6366f1',
	'3': '#0891b2',
	'4': '#f97316',
	'5': '#16a34a',
	'6': '#b45309',
	'7': '#475569',
	'8': '#9ca3af',
};

export const occCount = (cat: MajorCategory): number =>
	cat.middles.reduce((n, mid) => n + mid.minors.reduce((k, min) => k + min.occupations.length, 0), 0);

export const minorCount = (cat: MajorCategory): number =>
	cat.middles.reduce((n, mid) => n + mid.minors.length, 0);

export const chipTitle = (o: Occupation): string => {
	const tags = [o.is_green ? '绿色职业' : '', o.is_digital ? '数字职业' : ''].filter(Boolean).join('、');
	return tags ? `${o.code} ${o.name}（${tags}）` : `${o.code} ${o.name}`;
};
