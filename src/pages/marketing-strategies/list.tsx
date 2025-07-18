import { useList, useNavigation, useDelete } from "@refinedev/core";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit, Trash2, Plus, DollarSign, Globe, X } from "lucide-react";
import { FlexBox, GridBox } from "@/components/shared";
import { PaginationSwith } from "@/components/navigation";
import { Lead } from "@/components/reader";

export const MarketingStrategyList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("all");
  const [current, setCurrent] = useState(1);
  const pageSize = 10;

  // Pobierz listę wszystkich analiz (z ID i URL) dla filtra
  const { data: urlsData } = useList({
    resource: "website_analyses",
    meta: {
      select: "id, url, created_at",
    },
    pagination: { pageSize: 1000 }, // Pobierz wszystkie analizy
    sorters: [
      {
        field: "url",
        order: "asc",
      },
      {
        field: "created_at",
        order: "desc",
      },
    ],
  });

  // Reset paginacji gdy zmieniają się filtry
  useEffect(() => {
    setCurrent(1);
  }, [searchTerm, selectedUrl]);

  // Budowanie filtrów
  const filters: any[] = [];
  if (searchTerm) {
    filters.push({
      field: "title",
      operator: "contains" as const,
      value: searchTerm,
    });
  }
  if (selectedUrl && selectedUrl !== "all") {
    filters.push({
      field: "website_analysis_id",
      operator: "eq" as const,
      value: selectedUrl,
    });
  }

  const { data, isLoading, isError } = useList({
    resource: "marketing_strategies",
    pagination: {
      current,
      pageSize,
    },
    filters: filters,
    meta: {
      select: "*, website_analysis:website_analyses(url)",
    },
  });

  const { create, edit, show } = useNavigation();
  const { mutate: deleteStrategy } = useDelete();

  if (isLoading) return <div className="p-6">Ładowanie...</div>;
  if (isError)
    return (
      <div className="p-6 text-red-500">Błąd podczas ładowania strategii</div>
    );

  return (
    <>
      <FlexBox>
        <Lead
          title={`Strategie Marketingowe`}
          description={`Zarządzaj swoimi strategiami marketingowymi`}
        />

        <Button onClick={() => create("marketing_strategies")}>
          <Plus className="w-4 h-4 mr-2" />
          Utwórz Nową Strategię
        </Button>
      </FlexBox>

      <FlexBox variant="start" className="flex-col sm:flex-row sm:items-center">
        <FlexBox variant="start" className="flex-1 max-w-sm">
          <Input
            placeholder="Szukaj strategii..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FlexBox>

        <FlexBox variant="start">
          <Select value={selectedUrl} onValueChange={setSelectedUrl}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtruj według strony..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie strony</SelectItem>
              {urlsData?.data?.map((analysis: any) => (
                <SelectItem key={analysis.id} value={analysis.id}>
                  <FlexBox className="w-full">
                    <FlexBox variant="start">
                      <Globe className="w-4 h-4" />
                      {analysis.url}
                    </FlexBox>
                    <span className="text-xs text-muted-foreground ml-2">
                      #{analysis.id.slice(0, 8)}
                    </span>
                  </FlexBox>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedUrl && selectedUrl !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedUrl("all")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </FlexBox>
      </FlexBox>

      {/* Aktywne filtry */}
      {(searchTerm || (selectedUrl && selectedUrl !== "all")) && (
        <FlexBox variant="start">
          <span className="text-sm font-medium">Aktywne filtry:</span>
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Tytuł: "{searchTerm}"
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => setSearchTerm("")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {selectedUrl && selectedUrl !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Strona:{" "}
              {
                urlsData?.data?.find((analysis) => analysis.id === selectedUrl)
                  ?.url
              }
              <span className="text-xs">#{selectedUrl.slice(0, 8)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => setSelectedUrl("all")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedUrl("all");
            }}
          >
            Wyczyść wszystkie
          </Button>
        </FlexBox>
      )}

      <GridBox variant="1-2-2">
        {data?.data?.map((strategy: any) => (
          <Card key={strategy.id}>
            <CardHeader>
              <FlexBox>
                <Badge variant="secondary" className="mb-2">
                  {strategy.industry_override || "Ogólna"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  #{strategy.id.slice(0, 8)}
                </span>
              </FlexBox>
              <Lead
                title={strategy.title}
                description={`${strategy.target_audience?.substring(
                  0,
                  200
                )}...`}
                variant="card"
              />

              {strategy.website_analysis?.url && (
                <FlexBox variant="start" className="gap-1 mt-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {strategy.website_analysis.url}
                  </span>
                </FlexBox>
              )}
            </CardHeader>

            <CardContent>
              <FlexBox>
                <FlexBox variant="start" className="text-sm font-medium gap-1">
                  <DollarSign className="w-4 h-4" />
                  Rekomendowany Budżet
                </FlexBox>
                <Badge variant="outline">
                  {strategy.budget_recommendation?.toLocaleString("pl-PL")} zł
                </Badge>
              </FlexBox>
              <FlexBox
                variant="start"
                className="text-sm text-muted-foreground"
              >
                {strategy.notes?.substring(0, 80)}...
              </FlexBox>
              <FlexBox
                variant="start"
                className="text-xs text-muted-foreground"
              >
                Utworzono:{" "}
                {new Date(strategy.created_at).toLocaleDateString("pl-PL")}
              </FlexBox>
            </CardContent>

            <CardFooter>
              <FlexBox variant="start" className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => show("marketing_strategies", strategy.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => edit("marketing_strategies", strategy.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </FlexBox>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm("Czy na pewno chcesz usunąć tę strategię?")) {
                    deleteStrategy({
                      resource: "marketing_strategies",
                      id: strategy.id,
                    });
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </GridBox>

      {/* Paginacja */}
      <PaginationSwith
        current={current}
        pageSize={pageSize}
        total={data?.total || 0}
        setCurrent={setCurrent}
        itemName="strategie"
      />
    </>
  );
};
