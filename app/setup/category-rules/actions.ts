import { validatedActionWithUser, withUser } from "@/lib/auth/middleware";
import zod from "zod";
import { Associatedemailclientcategory } from "@/lib/db/schema";
import { db } from "@/lib/db/database";
import * as queries from "@/lib/db/queries/email-rules";

const MAX_NUM_RULES = process.env.NEXT_PUBLIC_MAX_RULE_COUNT;

const DEFAULT_ASSOC_EC_CATEGORIES: Record<string, Associatedemailclientcategory | null> = {
  ads: "CATEGORY_PROMOTIONS",
  political: "CATEGORY_SOCIAL",
  notices: "CATEGORY_UPDATES",
  receipts: "CATEGORY_UPDATES",
  securityAlerts: null,
  orders: "CATEGORY_UPDATES",
  newsletters: "CATEGORY_UPDATES",
  flights: null,
  finances: null,
  socialMedia: "CATEGORY_SOCIAL",
};

const updateDefaultCategoryRulesSchema = zod.object({
  ads: zod.boolean(),
  political: zod.boolean(),
  notices: zod.boolean(),
  receipts: zod.boolean(),
  securityAlerts: zod.boolean(),
  orders: zod.boolean(),
  newsletters: zod.boolean(),
  flights: zod.boolean(),
  finances: zod.boolean(),
  socialMedia: zod.boolean(),
});

export const updateDefaultCategoryRules = validatedActionWithUser(
  updateDefaultCategoryRulesSchema,
  async (data, _, user) => {
    const values = Object.entries(data).map(([category, isEnabled]) => {
      if (!DEFAULT_ASSOC_EC_CATEGORIES[category]) {
        throw new Error(`Invalid category: ${category}`);
      }

      return {
        userId: user.id,
        category,
        isDisabled: !isEnabled,
        associatedEmailClientCategory: DEFAULT_ASSOC_EC_CATEGORIES[category],
      };
    });

    return db
      .insertInto("defaultEmailRuleOverride")
      .values(values)
      .onConflict((oc) =>
        oc.columns(["userId", "category"]).doUpdateSet((eb) => ({
          associatedEmailClientCategory: eb.ref("excluded.associatedEmailClientCategory"),
          isDisabled: eb.ref("excluded.isDisabled"),
          updatedAt: new Date(),
        })),
      )
      .execute();
  },
);

const associatedEmailClientCategorySchema = zod.enum([
  "CATEGORY_PERSONAL",
  "CATEGORY_PROMOTIONS",
  "CATEGORY_SOCIAL",
  "CATEGORY_UPDATES",
]);

const addCustomEmailRuleSchema = zod.object({
  associatedEmailClientCategory: zod.union([
    zod.literal(null),
    associatedEmailClientCategorySchema,
  ]),
  category: zod.string(),
  promptContent: zod.string(),
});

export const addCustomEmailRule = validatedActionWithUser(
  addCustomEmailRuleSchema,
  async (data, _, user) => {
    const currentRuleCount = await queries.getCurrentUserEnabledEmailRuleCount(user.id);
    if (currentRuleCount + 1 > MAX_NUM_RULES) {
      return {
        code: 400,
        error: `Total rules cannot exceed ${MAX_NUM_RULES} rules`,
      };
    }

    try {
      const result = await db
        .insertInto("customEmailRule")
        .values([
          {
            userId: user.id,
            ...data,
          },
        ])
        .returningAll()
        .executeTakeFirstOrThrow();

      return { code: 201, data: result };
    } catch {
      return {
        code: 400,
        error: "Failed to add custom rule",
      };
    }
  },
);
