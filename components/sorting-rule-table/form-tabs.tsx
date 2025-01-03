import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormTabsProps {
  customTabContent: JSX.Element;
  predefinedTabContent: JSX.Element;
  predefinedTabDisabled: boolean;
}

export function FormTabs({
  customTabContent,
  predefinedTabContent,
  predefinedTabDisabled,
}: FormTabsProps) {
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="custom">Custom</TabsTrigger>
        <TabsTrigger disabled={predefinedTabDisabled} value="predefined">
          Predefined
        </TabsTrigger>
      </TabsList>
      <TabsContent value="custom">{customTabContent}</TabsContent>
      <TabsContent value="predefined">{predefinedTabContent}</TabsContent>
    </Tabs>
  );
}
