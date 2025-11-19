"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Loader2, 
  Code2, 
  CheckCircle, 
  AlertCircle, 
  FileUp, 
  Sparkles,
  Trash2
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function CodeReviewer() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle AI Review
  const handleReview = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setReview("");

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      if (data.review) {
        setReview(data.review);
      }
    } catch (error) {
      console.error("Error fetching review:", error);
      setReview("Error analyzing code. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
    };
    reader.readAsText(file);
  };

  // Trigger hidden input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 text-zinc-900 dark:text-zinc-100 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-zinc-900 rounded-xl text-white shadow-lg shadow-zinc-900/20">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI Code Reviewer</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                Upload a file or paste code for instant feedback
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          
          {/* LEFT: Input Section */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle>Source Code</CardTitle>
                <CardDescription>Paste or upload your file.</CardDescription>
              </div>
              
              <div className="flex gap-2">
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.html,.css,.json"
                />
                
                {/* Upload Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={triggerFileInput}
                  className="text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                >
                  <FileUp className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
                
                {/* Clear Button (only shows if code exists) */}
                {code && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setCode("")}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>

            <Separator className="bg-zinc-200 dark:bg-zinc-800" />
            
            <CardContent className="flex-1 p-0">
              <Textarea
                placeholder="Paste your code here or click 'Upload File'..."
                className="w-full h-full min-h-[300px] p-6 font-mono text-sm bg-transparent border-0 focus-visible:ring-0 resize-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </CardContent>
            
            <Separator className="bg-zinc-200 dark:bg-zinc-800" />

            <CardFooter className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
              {/* MAGIC REVIEW BUTTON */}
              <Button 
                onClick={handleReview} 
                disabled={loading || !code}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 text-yellow-400 animate-pulse" />
                    Review Code
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* RIGHT: Output Section */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full overflow-hidden">
            <CardHeader className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <CardTitle className="flex items-center gap-2">
                AI Review
                {review && !loading && <CheckCircle className="w-4 h-4 text-green-500" />}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 overflow-hidden relative">
              <ScrollArea className="h-full p-6 w-full">
                {loading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-sm z-10">
                    <div className="flex items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-full shadow-xl">
                      <Loader2 className="w-8 h-8 animate-spin text-zinc-900 dark:text-zinc-100" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">Analyzing syntax & logic...</p>
                  </div>
                ) : review ? (
                  <div className="prose prose-zinc dark:prose-invert max-w-none text-sm">
                    <ReactMarkdown>{review}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-400 space-y-4">
                    <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-full">
                      <Sparkles className="w-12 h-12 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">Ready to work some magic</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}