"use client";

import {
  RemoveRuleActionState,
  RemoveRuleForm,
} from "@/components/sorting-rule-table/sorting-rule-forms/remove-rule";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CustomRule, DefaultRule } from "@/lib/db/queries/email-rules";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
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
  const [selectedTab, setSelectedTab] = useState("predefined");
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
  const [dialogTitle, dialogDescription] =
    selectedTab === "predefined"
      ? ["Add Predefined Sorting Rule", "Activate a predefined sorting rule."]
      : ["Add Custom Sorting Rule", "Add a custom sorting rule to your account."];

  const tableClass = "w-full table border-separate border-spacing-y-1";
  const emptyRowsContainerClass = "flex flex-col gap-2 items-center justify-center w-full h-[50vh]";

  const ruleLenDisplay = (length: number) => (length > 0 ? `(${length})` : "");

  const THead = () => (
    <thead>
      <tr className="bg-muted">
        <th className="pl-8 py-2 text-sm">Rule Name</th>
        <th className="px-4 py-2 text-sm">Description</th>
        <th className="pr-4 md:pr-1 py-2"></th>
      </tr>
    </thead>
  );

  return (
    <>
      <div className="relative space-y-4 w-full">
        <Tabs defaultValue="predefined" onValueChange={setSelectedTab}>
          <TabsList className="px-4 md:px-0">
            <TabsTrigger value="predefined" tabIndex={0}>
              Predefined {ruleLenDisplay(rules.default.length)}
            </TabsTrigger>
            <TabsTrigger value="custom" tabIndex={1}>
              Custom {ruleLenDisplay(rules.custom.length)}
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-3" value="predefined">
            {rules.default.length === 0 ? (
              <div className={emptyRowsContainerClass}>
                No active predefined rules found.{" "}
                <Button variant="link" className="text-black font-bold">
                  Activate Rules
                </Button>
              </div>
            ) : (
              <table className={tableClass}>
                <THead />
                <tbody>
                  <AnimatePresence>
                    {rules.default.map((rule) => (
                      <TableRow key={rule.name} rule={rule} removeRule={setSelectedToRemove} />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </TabsContent>
          <TabsContent className="mt-3" value="custom">
            {rules.custom.length === 0 ? (
              <div className={emptyRowsContainerClass}>
                No custom rules found.{" "}
                <Button variant="link" className="text-black font-bold">
                  Create Custom Rule
                </Button>
              </div>
            ) : (
              <table className={tableClass}>
                <THead />
                <tbody>
                  <AnimatePresence>
                    {rules.custom.map((rule) => (
                      <TableRow key={rule.id} rule={rule} removeRule={setSelectedToRemove} />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}{" "}
          </TabsContent>
        </Tabs>

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
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {selectedTab === "predefined" ? (
                <PredefinedRuleCreateForm
                  activePredefinedRulesSet={predefinedRuleSet}
                  onComplete={onActionComplete}
                />
              ) : selectedTab === "custom" ? (
                <CustomSortingRuleCreateForm onComplete={onActionComplete} />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      )}
      {isMobile && (
        <Drawer open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DrawerContent mobileOnly>
            <DrawerHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DrawerDescription>{dialogDescription}</DrawerDescription>
            </DrawerHeader>
            <div className="px-6 pb-6">
              {selectedTab === "predefined" ? (
                <PredefinedRuleCreateForm
                  activePredefinedRulesSet={predefinedRuleSet}
                  onComplete={onActionComplete}
                />
              ) : selectedTab === "custom" ? (
                <CustomSortingRuleCreateForm onComplete={onActionComplete} />
              ) : null}
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
      <td className="pl-8 py-2 border-b border-gray-200 text-sm font-medium">{ruleName}</td>
      <td className="px-4 py-2 border-b border-gray-200 text-sm">{rule.description}</td>
      <td className="pr-4 md:pr-1 py-2 border-b border-gray-200">
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
