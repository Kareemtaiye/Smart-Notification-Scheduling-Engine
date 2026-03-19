import RuleService from "../services/ruleService.js";
import AppError from "../utilities/AppError.js";

export default class RuleController {
  static async createRule(req, res, next) {
    const { name, channel, payload, executeAt } = req.body || {};

    if (!name || !channel || !payload || !executeAt) {
      return next(
        new AppError("Missing required fields: name, channel, payload, executeAt", 400),
      );
    }

    const rule = await RuleService.createRule({
      name,
      userId: req.user.id,
      channel,
      payload,
      executeAt,
    });

    res.status(201).json({
      status: "success",
      data: {
        rule,
      },
    });
  }
}
