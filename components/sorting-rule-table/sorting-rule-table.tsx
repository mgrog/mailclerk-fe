"use client";

import {
  RemoveRuleActionState,
  RemoveRuleForm,
} from "@/components/sorting-rule-table/sorting-rule-forms/remove-rule";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader } from "@/components/ui/drawer";
import type { CustomRule, DefaultRule } from "@/lib/db/queries/email-rules";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { FormTabs } from "./form-tabs";
import {
  CustomRuleActionState,
  CustomSortingRuleCreateForm,
} from "./sorting-rule-forms/custom-rule";
import {
  PredefinedRuleActionState,
  PredefinedRuleCreateForm,
} from "./sorting-rule-forms/predefined-rule";

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
    if (state.kind === "create_success") {
      setAddDialogOpen(false);
    }

    if (state.kind === "remove_success") {
      setSelectedToRemove(null);
    }
  };
  const predefinedRuleSet = new Set(rules.default.map((rule) => rule.name));

  const collapseTitleClass =
    "collapse-title text-sm font-medium ps-8 pe-8 items-center justify-between bg-gray-100";
  const chevronClass = "w-6 h-6";
  const tableClass = "w-full table border-separate border-spacing-y-1";
  const collapseContentClass = "collapse-content px-0";

  return (
    <>
      <div className="relative space-y-4 w-full">
        <div tabIndex={0} className="collapse rounded-none">
          <input type="checkbox" defaultChecked className="peer" />
          <div className={cn(collapseTitleClass, "hidden peer-checked:flex")}>
            Default Rules ({rules.default.length}) <ChevronUpIcon className={chevronClass} />
          </div>
          <div className={cn(collapseTitleClass, "flex peer-checked:hidden")}>
            Default Rules ({rules.default.length}) <ChevronDownIcon className={chevronClass} />
          </div>
          <div className={collapseContentClass}>
            <table className={tableClass}>
              <tbody>
                <AnimatePresence>
                  {rules.default.map((rule) => (
                    <TableRow key={rule.name} rule={rule} removeRule={setSelectedToRemove} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        <div tabIndex={1} className="collapse rounded-none">
          <input type="checkbox" defaultChecked className="peer" />
          <div className={cn(collapseTitleClass, "hidden peer-checked:flex")}>
            Custom Rules ({rules.custom.length}) <ChevronUpIcon className={chevronClass} />
          </div>
          <div className={cn(collapseTitleClass, "flex peer-checked:hidden")}>
            Custom Rules ({rules.custom.length}) <ChevronDownIcon className={chevronClass} />
          </div>
          <div className={collapseContentClass}>
            <table className={tableClass}>
              <tbody>
                <AnimatePresence>
                  {rules.custom.map((rule) => (
                    <TableRow key={rule.id} rule={rule} removeRule={setSelectedToRemove} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        <div className="fixed bottom-10 right-4 md:right-20 z-30">
          <div className="p-1 rounded-full bg-base-100">
            <div
              className="w-[36px] h-[36px] md:w-[50px] md:h-[50px] rounded-full flex items-center justify-center border-2 border-gray-200 bg-gray-200 transition-colors hover:bg-black hover:border-black group z-20"
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
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

function TableRow({
  rule,
  removeRule,
}: {
  rule: DefaultRule | CustomRule;
  removeRule: (rule: DefaultRule | CustomRule) => void;
}) {
  const isPresent = useIsPresent();
  const ruleName = rule.name;
  const mailLabel = "mailLabel" in rule ? rule.mailLabel : rule.label;

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{
        position: isPresent ? "relative" : "absolute",
        display: isPresent ? "table-row" : "flex",
        alignItems: isPresent ? "" : "center",
      }}
      className="bg-white group/row w-full"
    >
      <td className="pl-8 py-2 border-b group-last/row:border-0 border-gray-200 text-sm font-medium">
        {ruleName}
      </td>
      <td className="px-4 py-2 border-b group-last/row:border-0 border-gray-200 text-sm">
        {rule.description}
      </td>
      <td className="pr-4 md:pr-1 py-2 border-b group-last/row:border-0 border-gray-200">
        <div className="flex justify-end">
          <div className="flex items-center justify-center w-8 min-w-8 h-8 md:w-10 md:min-w-10 md:h-10 border border-gray-300 bg-gray-300 group/btn">
            <MinusIcon
              className="w-full h-full px-1 py-2 text-black transition-colors group-hover/btn:text-white group-hover/btn:bg-black group-hover/btn:border-black"
              onClick={() => removeRule(rule)}
            />
          </div>
        </div>
      </td>
    </motion.tr>
  );
}
