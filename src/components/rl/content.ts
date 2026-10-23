/** 强化学习课程内容（通识整理） */
export const rl = {
	name: '强化学习',
	intro:
		'强化学习（Reinforcement Learning）研究智能体如何在与环境的持续交互中，通过试错与奖励信号学习最优决策——它是 AlphaGo、机器人控制与大模型对齐（RLHF）共同的内核。课程从马尔可夫决策过程的形式框架出发，经动态规划、蒙特卡洛、时序差分到策略梯度与深度强化学习，最后抵达应用前沿：机器学习里最贴近「决策智能」的一门课。',
	modules: [
		{ icon: '🎮', title: '概述与基本框架', desc: '在试错中学习决策：智能体—环境交互循环与奖励假设。', topics: ['智能体-环境接口', '奖励假设', '与监督学习对比', '应用版图'] },
		{ icon: '🎲', title: '马尔可夫决策过程', desc: '序贯决策问题的形式语言：一切算法的出发点。', topics: ['状态/动作/转移', '奖励与回报', '价值函数', '贝尔曼方程'] },
		{ icon: '🧮', title: '动态规划', desc: '模型已知时的精确解：策略评估与改进的迭代艺术。', topics: ['策略评估', '策略迭代', '值迭代', '收敛性'] },
		{ icon: '🎰', title: '蒙特卡洛方法', desc: '不知道模型？从完整的采样经验中学习。', topics: ['首访/每次访估计', '蒙特卡洛预测', 'ε-贪婪控制', '重要度采样'] },
		{ icon: '⏱️', title: '时序差分学习', desc: '强化学习最核心的想法：边走边学，不必等回合结束。', topics: ['TD 误差', 'SARSA', 'Q-learning', 'TD(λ)'] },
		{ icon: '🎯', title: '策略梯度', desc: '绕开价值函数，直接对策略做梯度上升。', topics: ['REINFORCE', '策略梯度定理', 'Actor-Critic', '确定性策略梯度'] },
		{ icon: '🤖', title: '深度强化学习', desc: '深度网络逼近价值与策略：RL 走向大规模应用的钥匙。', topics: ['DQN 与经验回放', 'DDPG / TD3', 'PPO / TRPO', '分布式 RL'] },
		{ icon: '🏆', title: '应用与前沿', desc: '从棋盘到对话：决策智能的落地版图。', topics: ['AlphaGo / AlphaZero', '机器人控制', 'RLHF 与大模型对齐', '多智能体'] },
	],
	prereq: ['概率论与数理统计', '线性代数', '程序设计', '机器学习导论'],
	parallel: ['算法设计与分析', '博弈与决策'],
	follow: ['多智能体系统', '机器人学', '大模型与智能体', '自动决策系统'],
	books: [
		{ name: '《强化学习（第 2 版）》', meta: 'Sutton & Barto', note: '领域圣经，官方提供免费电子版' },
		{ name: '《动手学强化学习》', meta: '俞勇 等', note: '中文原创，代码与推导并进' },
		{ name: 'Spinning Up in Deep RL', meta: 'OpenAI · 免费在线', note: '深度强化学习实践最短路径' },
		{ name: 'Algorithms for RL', meta: 'Szepesvári', note: '理论视角的精炼小册子' },
	],
	labs: [
		{ name: 'Gymnasium 环境库', note: '事实标准的 RL 实验环境集合' },
		{ name: 'Berkeley CS285', note: '深度强化学习标杆公开课' },
		{ name: '迷你 DQN / AlphaZero 复现', note: '亲手实现经典算法的最好方式' },
	],
};
