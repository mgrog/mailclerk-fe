"use client";

import type { CustomRule, DefaultRule } from "@/lib/db/queries/email-rules";
import { AutoCleanupSetting } from "@/lib/db/schema";
import { GmailLabel } from "@/lib/server/gmail-labels";
import { cn } from "@/lib/utils";
import { Selectable } from "kysely";
import { startTransition, useActionState, useReducer, useState } from "react";
import { produce } from "immer";
import { NumberField } from "@/components/ui/number-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyCleanupSettings } from "@/components/cleanup-settings-table/actions";
import { isDirty } from "zod";
import { AnimatePresence, motion } from "framer-motion";

type Setting = Selectable<AutoCleanupSetting>;

interface CleanupSettingsTableProps {
  activeMailLabels: GmailLabel[];
  autoCleanupSettings: Setting[];
}

type ReducerState = {
  isDirty: boolean;
  rows: {
    [x: string]: Partial<Setting>;
  };
};

type ReducerAction =
  | {
      type: "change_cleanup_action";
      payload: {
        category: string;
        value: Setting["cleanupAction"];
      };
    }
  | {
      type: "change_days";
      payload: {
        category: string;
        value: number;
      };
    };

const DEFAULT_SETTING: Pick<Setting, "afterDaysOld" | "cleanupAction"> = {
  cleanupAction: "NOTHING",
  afterDaysOld: 3,
};

function reducer(state: ReducerState, action: ReducerAction) {
  switch (action.type) {
    case "change_cleanup_action":
      return produce(state, (draft) => {
        draft.isDirty = true;
        if (!draft.rows[action.payload.category]) {
          draft.rows[action.payload.category] = {
            ...DEFAULT_SETTING,
            cleanupAction: action.payload.value,
          };
        } else {
          draft.rows[action.payload.category].cleanupAction = action.payload.value;
        }
      });
    case "change_days":
      return produce(state, (draft) => {
        draft.isDirty = true;
        draft.rows[action.payload.category].afterDaysOld = action.payload.value;
      });
    default:
      throw new Error("Unknown action type");
  }
}

type ActionState = {
  error?: string;
  success?: string;
  kind?: "apply_success";
};

export function CleanupSettingsTable({
  activeMailLabels,
  autoCleanupSettings,
}: CleanupSettingsTableProps) {
  const cleanupSettingsMap = Object.fromEntries(
    autoCleanupSettings.map((setting) => [setting.mailLabel, setting]),
  );
  const [settings, dispatch] = useReducer(reducer, {}, () => ({
    isDirty: false,
    rows: cleanupSettingsMap,
  }));

  const [applySettingsState, applySettingsAction, isPending] = useActionState<
    ActionState,
    FormData
  >(applyCleanupSettings, { error: undefined, success: undefined });

  const handleSubmit = () => {
    const formData = new FormData();
    for (const [mailLabel, setting] of Object.entries(settings.rows)) {
      formData.append("changes[]", JSON.stringify({ ...setting, mailLabel }));
    }

    console.log("submiting form data", formData);

    startTransition(() => {
      applySettingsAction(formData);
    });
  };

  console.log("applySettingsState", applySettingsState);

  const thClass = "sticky top-16 bg-white z-10";
  const tdClass = "text-center align-middle border-b border-color-gray-200";
  console.log("settings", settings);
  return (
    <div className="relative space-y-4 px-0 md:px-12 w-full">
      <div className="sticky top-0 py-4 px-4 md:pr-16 h-[32px] flex items-center justify-between bg-white z-10">
        <h1 className="text-lg font-semibold">Auto Cleanup Settings</h1>

        <AnimatePresence>
          {settings.isDirty && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Button
                variant="outline"
                size="sm"
                loading={isPending}
                onClick={handleSubmit}
                className="flex items-center gap-1"
              >
                Apply Changes
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <table className="w-full table border-separate border-spacing-y-1">
        <thead>
          <tr>
            <th className={thClass}>Gmail Label</th>
            <th className={cn(thClass, "text-center")}>Action</th>
            <th className={cn(thClass, "text-center")}>Triggered after (days)</th>
          </tr>
        </thead>
        <tbody>
          {activeMailLabels.map((label) => {
            const category = label.name?.replace("Mailclerk/", "").replace(" ", "_") ?? "";
            return (
              <tr key={label.id}>
                <td className={tdClass}>
                  <div
                    className="rounded w-fit px-2 font-gmail text-[12px] whitespace-nowrap"
                    style={{
                      backgroundColor: label.color?.backgroundColor,
                      color: label.color?.textColor,
                    }}
                  >
                    {label.name}
                  </div>
                </td>
                <td className={tdClass}>
                  <div className="flex justify-center">
                    <Select
                      defaultValue={
                        settings.rows[category]?.cleanupAction || DEFAULT_SETTING.cleanupAction
                      }
                      onValueChange={(value) => {
                        dispatch({
                          type: "change_cleanup_action",
                          payload: {
                            category,
                            value: value as Setting["cleanupAction"],
                          },
                        });
                      }}
                    >
                      <SelectTrigger className="w-[110px] md:w-[130px] text-xs md:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NOTHING">Do nothing</SelectItem>
                        <SelectItem value="ARCHIVE">Archive</SelectItem>
                        <SelectItem value="DELETE">Delete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </td>
                <td className={tdClass}>
                  {settings.rows[category] &&
                  settings.rows[category].cleanupAction !== "NOTHING" ? (
                    <div className="flex justify-center">
                      <NumberField
                        value={settings.rows[category].afterDaysOld ?? DEFAULT_SETTING.afterDaysOld}
                        onChange={(value) =>
                          dispatch({
                            type: "change_days",
                            payload: {
                              category,
                              value,
                            },
                          })
                        }
                      />
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
