import { useForm } from "@refinedev/react-hook-form";
import { useNavigation } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { 
  FlexBox, 
  GridBox, 
} from "@/components/shared";
import { Lead } from "@/components/reader";
import { Form, FormActions, FormField } from "@/components/form";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Education",
  "Real Estate",
  "Food & Beverage",
  "Travel",
  "Fashion",
  "Automotive",
];

export const WebsiteAnalysisCreate = () => {
  const { list } = useNavigation();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      const newKeywords = [...keywords, keywordInput.trim()];
      setKeywords(newKeywords);
      setValue("keywords", newKeywords);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const newKeywords = keywords.filter((k) => k !== keywordToRemove);
    setKeywords(newKeywords);
    setValue("keywords", newKeywords);
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => list("website_analyses")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to List
      </Button>

      <FlexBox>
        <Lead
          title="Create Website Analysis"
          description="Add a new website for analysis"
        />
      </FlexBox>

      <Card>
        <CardHeader>
          <CardTitle>Website Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit(onFinish)}>
            <GridBox variant="1-2-2">
              <FormField 
                label="Website URL" 
                htmlFor="url" 
                error={errors.url?.message as string}
                required
              >
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  {...register("url", {
                    required: "URL is required",
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Please enter a valid URL",
                    },
                  })}
                />
              </FormField>

              <FormField 
                label="Industry" 
                error={errors.industry?.message as string}
                required
              >
                <Select 
                  onValueChange={(value) => setValue("industry", value)}
                  {...register("industry", { required: "Industry is required" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </GridBox>

            <FormField 
              label="Description" 
              htmlFor="description" 
              error={errors.description?.message as string}
              required
            >
              <Textarea
                id="description"
                placeholder="Describe the website's purpose, target audience, and main features..."
                rows={4}
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 20,
                    message: "Description must be at least 20 characters",
                  },
                })}
              />
            </FormField>

            <FormField 
              label="Keywords" 
              error={keywords.length === 0 ? "At least one keyword is required" : undefined}
              required
            >
              <FlexBox variant="start">
                <Input
                  placeholder="Add a keyword..."
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={handleKeywordKeyPress}
                  className="flex-1"
                />
                <Button type="button" onClick={addKeyword} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </FlexBox>

              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </FormField>

            <FormActions>
              <Button
                type="button"
                variant="outline"
                onClick={() => list("website_analyses")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || keywords.length === 0}
              >
                {isSubmitting ? "Creating..." : "Create Analysis"}
              </Button>
            </FormActions>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};