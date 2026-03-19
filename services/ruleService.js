export default class RuleService {
  static async createRule({ name, userId, channel, payload, executeAt }, client) {
    const rule = await RuleRepository.createRule(
      {
        name,
        userId,
        channel,
        payload,
        executeAt,
      },
      client,
    );
    return rule;
  }
}
