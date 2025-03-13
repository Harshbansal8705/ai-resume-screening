"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

interface ResumeResult {
  top_resumes: string[];
  scores: { reason: string; score: number; attrition_risk: number }[];
}

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResumeResult | null>(null);
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const { toast } = useToast();

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobDescription || acceptedFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide both a job description and at least one resume.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("job_description", jobDescription);
    acceptedFiles.forEach((file) => {
      formData.append("resumes", file);
    });

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process resumes");
      }

      const data = await response.json();
      setResults(data);
      setExpandedCards([]);
      toast({
        title: "Success",
        description: "Resumes processed successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process resumes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCard = (index: number) => {
    setExpandedCards(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <>
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI Resume Screening
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Upload resumes and provide a job description to find the best matches
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Job Description
                  </label>
                  <Textarea
                    placeholder="Enter the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Resumes (PDF)
                  </label>
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors"
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Drag & drop PDF resumes here, or click to select files
                    </p>
                  </div>

                  {acceptedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                      <ScrollArea className="h-32">
                        {acceptedFiles.map((file) => (
                          <div
                            key={file.name}
                            className="flex items-center space-x-2 py-2"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Analyze Resumes"}
                </Button>
              </CardContent>
            </Card>
          </form>

          {isLoading && (
            <Card className="mt-8">
              <CardContent className="py-6">
                <Progress value={66} className="mb-2" />
                <p className="text-center text-sm text-gray-600">
                  Analyzing resumes...
                </p>
              </CardContent>
            </Card>
          )}

          {results && (
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-bold mb-4">Results</h2>
              {results.top_resumes.map((resume, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="py-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                              Resume {index + 1}
                            </h3>
                            <div className="flex items-center gap-2">
                              {results.scores[index].score >= 80 ? (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              ) : (
                                <AlertCircle className="h-6 w-6 text-yellow-500" />
                              )}
                              <span className="font-semibold">
                                {results.scores[index].score}%
                              </span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium text-sm mb-2">AI Feedback</h4>
                            <p className="text-sm text-gray-600">
                              {results.scores[index].reason}
                            </p>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium text-sm mb-2">Attrition Risk</h4>
                            <p className="text-sm text-gray-600">
                              {results.scores[index].attrition_risk}%
                            </p>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium text-sm mb-2">Parsed Resume</h4>
                            <p className="text-sm text-gray-600">
                              {truncateText(resume)}
                            </p>
                            {resume.length > 150 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleCard(index)}
                                className="mt-2 h-8 px-2 text-primary"
                              >
                                {expandedCards.includes(index) ? (
                                  <ChevronUp className="h-4 w-4 mr-1" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 mr-1" />
                                )}
                                {expandedCards.includes(index) ? "Show Less" : "Show More"}
                              </Button>
                            )}
                          </div>

                          {expandedCards.includes(index) && (
                            <div className="mt-4 pt-4 border-t">
                              <div>
                                <h4 className="font-medium text-sm">Full Resume Content</h4>
                                <p className="mt-1 text-sm text-gray-600">{resume}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="text-center my-4 pt-4 bg-white">
        &copy;{new Date().getFullYear()} AI Resume Screening. Created by <a href="https://www.harshbansal.in" className="underline">Harsh Bansal</a>
      </footer>
    </>
  );
}