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

type Setting = Selectable<AutoCleanupSetting>;

interface CleanupSettingsTableProps {
  activeMailLabels: GmailLabel[];
  autoCleanupSettings: Setting[];
}

type ReducerState = {
  [x: string]: Partial<Setting>;
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
        if (!draft[action.payload.category]) {
          draft[action.payload.category] = {
            ...DEFAULT_SETTING,
            cleanupAction: action.payload.value,
          };
        } else {
          draft[action.payload.category].cleanupAction = action.payload.value;
        }
      });
    case "change_days":
      return produce(state, (draft) => {
        draft[action.payload.category].afterDaysOld = action.payload.value;
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
  const [changes, dispatch] = useReducer(reducer, {}, () => cleanupSettingsMap);

  const [applySettingsState, applySettingsAction, isPending] = useActionState<
    ActionState,
    FormData
  >(applyCleanupSettings, { error: undefined, success: undefined });

  const handleSubmit = () => {
    const formData = new FormData();
    for (const [mailLabel, change] of Object.entries(changes)) {
      formData.append("changes[]", JSON.stringify({ ...change, mailLabel }));
    }

    console.log("submiting form data", formData);

    startTransition(() => {
      applySettingsAction(formData);
    });
  };

  console.log("applySettingsState", applySettingsState);

  const thClass = "sticky top-16 bg-white z-10";
  const tdClass = "text-center align-middle border-b border-color-gray-200";
  console.log("changes", changes);
  return (
    <div className="relative space-y-4 px-12 w-full">
      <div className="sticky top-0 py-4 pl-4 pr-16 flex items-center justify-between bg-white z-10">
        <h1 className="text-lg font-semibold">Auto Cleanup Settings</h1>
        <Button
          variant="outline"
          size="sm"
          loading={isPending}
          onClick={handleSubmit}
          className="flex items-center gap-1"
        >
          Apply Changes
        </Button>
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
                    className="rounded-lg w-fit px-2 font-gmail text-[12px]"
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
                        changes[category]?.cleanupAction || DEFAULT_SETTING.cleanupAction
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
                      <SelectTrigger className="w-[130px]">
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
                  {changes[category] && changes[category].cleanupAction !== "NOTHING" ? (
                    <div className="flex justify-center">
                      <NumberField
                        value={changes[category].afterDaysOld ?? DEFAULT_SETTING.afterDaysOld}
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
