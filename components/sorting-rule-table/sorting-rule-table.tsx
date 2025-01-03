"use client";

import type { DefaultRule, CustomRule } from "@/lib/db/queries/email-rules";
import { PlusIcon, MinusIcon, ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader } from "@/components/ui/drawer";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  CustomRuleActionState,
  CustomSortingRuleCreateForm,
} from "./sorting-rule-forms/custom-rule";
import {
  PredefinedRuleActionState,
  PredefinedRuleCreateForm,
} from "./sorting-rule-forms/predefined-rule";
import { Button } from "@/components/ui/button";
import { FormTabs } from "./form-tabs";
import { DEFAULT_EMAIL_RULES } from "@/lib/constants";
import {
  RemoveRuleActionState,
  RemoveRuleForm,
} from "@/components/sorting-rule-table/sorting-rule-forms/remove-rule";

interface SortingRuleTableProps {
  rules: {
    default: DefaultRule[];
    custom: CustomRule[];
  };
}

export function SortingRuleTable({ rules }: SortingRuleTableProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedToRemove, setSelectedToRemove] = useState<CustomRule | DefaultRule | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const onActionComplete = (
    state: CustomRuleActionState | PredefinedRuleActionState | RemoveRuleActionState,
  ) => {
    console.log("action state", state);
    if (state.kind === "create_success") {
      setAddDialogOpen(false);
    }

    if (state.kind === "remove_success") {
      setSelectedToRemove(null);
    }
  };
  const predefinedRuleSet = new Set(rules.default.map((rule) => rule.name));

  const chevronClass = "w-6 h-6";

  const MinusCol = ({ rule }: { rule: CustomRule | DefaultRule }) => (
    <div className="flex items-center justify-center w-8 min-w-8 h-8 md:w-10 md:min-w-10 md:h-10 border border-black group">
      <MinusIcon
        className="w-full h-full px-1 py-2 text-black transition-colors group-hover:text-white group-hover:bg-black"
        onClick={() => setSelectedToRemove(rule)}
      />
    </div>
  );

  return (
    <>
      <div className="relative">
        <div tabIndex={0} className="collapse">
          <input type="checkbox" defaultChecked className="peer" />
          <div className="collapse-title text-sm pe-8 items-center justify-between hidden peer-checked:flex">
            Default Rules ({rules.default.length}) <ChevronUpIcon className={chevronClass} />
          </div>
          <div className="collapse-title text-sm pe-8 items-center justify-between flex peer-checked:hidden">
            Default Rules ({rules.default.length}) <ChevronDownIcon className={chevronClass} />
          </div>
          <div className="collapse-content">
            <table className="border-separate border-spacing-y-4 -my-4 w-full">
              <tbody>
                {rules.default.map((rule) => (
                  <tr key={`default-${rule.name}`} className="bg-white">
                    <td className="pl-8 py-2 border-l border-y border-gray-200 text-sm font-medium">
                      {rule.name}
                    </td>
                    <td className="px-4 py-2 border-y border-gray-200 text-sm">
                      {rule.description}
                    </td>
                    <td className="pr-4 py-2 border-r border-y border-gray-200">
                      <div className="flex justify-end">
                        <MinusCol rule={rule} />
                      </div>
                    </td>
                  </tr>
                ))}
                {/* <tr>
                  <AddRow onClick={() => setAddDialogOpen(true)} />
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>

        <div tabIndex={1} className="collapse">
          <input type="checkbox" defaultChecked className="peer" />
          <div className="collapse-title text-sm pe-8 items-center justify-between hidden peer-checked:flex">
            Custom Rules ({rules.custom.length}) <ChevronUpIcon className={chevronClass} />
          </div>
          <div className="collapse-title text-sm pe-8 items-center justify-between flex peer-checked:hidden">
            Custom Rules ({rules.custom.length}) <ChevronDownIcon className={chevronClass} />
          </div>
          <div className="collapse-content">
            <table className="border-separate border-spacing-y-4 -my-4 w-full">
              <tbody>
                {rules.custom.map((rule) => (
                  <tr key={`${rule.id}`} className="bg-white">
                    <td className="pl-8 py-3 border-l border-y border-gray-200 text-sm font-medium">
                      {rule.category}
                    </td>
                    <td className="px-4 py-3 border-y border-gray-200 text-sm">
                      {rule.description}
                    </td>
                    <td className="pr-4 py-3 border-r border-y border-gray-200">
                      <div className="flex justify-end">
                        <MinusCol rule={rule} />
                      </div>
                    </td>
                  </tr>
                ))}
                {/* <tr>
                  <AddRow onClick={() => setAddDialogOpen(true)} />
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>

        <div className="fixed bottom-10 right-4 md:right-20">
          <div className="p-1 rounded-full backdrop-blur-sm">
            <div
              className="w-[36px] h-[36px] md:w-[50px] md:h-[50px] bg-white rounded-full flex items-center justify-center border-2 border-gray-600 transition-colors hover:bg-black hover:border-black group z-20"
              onClick={() => setAddDialogOpen(true)}
            >
              <PlusIcon className="w-10 h-10 m-2 text-black transition-colors group-hover:text-white" />
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={selectedToRemove !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedToRemove(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Sorting Rule</DialogTitle>
            {/* <DialogDescription>
              Are you sure you want to remove the <b>{getSortingRuleName(selectedToRemove)}</b>{" "}
              sorting rule?
            </DialogDescription> */}
          </DialogHeader>
          <div>
            <RemoveRuleForm
              rule={selectedToRemove}
              onComplete={onActionComplete}
              onCancel={() => setSelectedToRemove(null)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {!isMobile && (
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent desktopOnly>
            <DialogHeader>
              <DialogTitle>Add Sorting Rule</DialogTitle>
              <DialogDescription>Add a new sorting rule to your account.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 min-h-[508px]">
              <FormTabs
                customTabContent={<CustomSortingRuleCreateForm onComplete={onActionComplete} />}
                predefinedTabContent={
                  <PredefinedRuleCreateForm
                    activePredefinedRulesSet={predefinedRuleSet}
                    onComplete={onActionComplete}
                  />
                }
                predefinedTabDisabled={predefinedRuleSet.size === DEFAULT_EMAIL_RULES.length}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      {isMobile && (
        <Drawer open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DrawerContent mobileOnly>
            <DrawerHeader>
              <DialogTitle>Add Sorting Rule</DialogTitle>
              <DrawerDescription>Add a new sorting rule to your account.</DrawerDescription>
            </DrawerHeader>
            <div className="px-6 pb-6">
              <FormTabs
                customTabContent={<CustomSortingRuleCreateForm onComplete={onActionComplete} />}
                predefinedTabContent={
                  <PredefinedRuleCreateForm
                    activePredefinedRulesSet={predefinedRuleSet}
                    onComplete={onActionComplete}
                  />
                }
                predefinedTabDisabled={predefinedRuleSet.size === DEFAULT_EMAIL_RULES.length}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
