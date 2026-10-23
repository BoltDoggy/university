/** 站点部署基路径,统一以 / 结尾(本地/项目 Pages 均适用),用于拼接站内链接 */
const raw: string = import.meta.env.BASE_URL;
export const BASE: string = raw.endsWith('/') ? raw : `${raw}/`;
