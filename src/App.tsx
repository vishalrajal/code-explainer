import { useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
//import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
//import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { CodeIcon, CopyIcon, MoonIcon, SunIcon, CheckIcon, BrainCircuitIcon, GithubIcon, BookOpenIcon, TrashIcon, LightbulbIcon } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { php } from '@codemirror/lang-php';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { rust } from '@codemirror/lang-rust';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';

function App() {
  const { theme, setTheme } = useTheme();
  const [code, setCode] = useState('// Paste your code here to get an AI explanation');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const { toast } = useToast();
  
  const MISTRAL_API_KEY = 'WDg5mLLUFi3PomdYQ3FfRvAm8CMR9PNn';

  const languageExtensions: Record<string, any> = {
    javascript,
    python,
    java,
    cpp,
    php,
    html,
    css,
    json,
    markdown,
    rust,
  };

  const handleExplain = async () => {
    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "Please enter some code to explain.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setExplanation('');
    
    try {
      // Actual Mistral API call
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: [
            {
              role: 'system',
              content: 'You are an expert programmer who explains code in a clear, concise manner. Format your response with clear headings and bullet points for easy readability. Use markdown formatting with ## for main headings and * for bullet points. Organize your explanation into distinct sections like "Purpose", "Key Components", "Notable Features", and "Potential Issues". Make your explanations concise and easy to scan.'
            },
            {
              role: 'user',
              content: `Please explain this ${language} code in a point-by-point format with clear headings:\n\n${code}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      setExplanation(data.choices[0].message.content);
    } catch (error) {
      console.error('Error calling Mistral AI:', error);
      
      // Fallback to simulated responses if API fails
      const explanations: Record<string, string> = {
        javascript: `## Code Overview
        
This JavaScript code implements a data processing function with modern ES6 features.

### Key Components:
* **Arrow Functions**: Uses modern ES6 syntax for concise function definitions
* **Template Literals**: Employs \`\${variable}\` syntax for string interpolation
* **Data Transformation**: Takes input and returns processed results

### Notable Features:
* **Efficient Implementation**: Code is optimized for performance
* **Modern Practices**: Follows current JavaScript best practices
* **Clean Structure**: Well-organized with logical flow

### Potential Issues:
* Error handling could be improved
* Some edge cases might not be covered`,
        python: `## Code Overview

This Python code demonstrates object-oriented programming with data processing capabilities.

### Class Structure:
* **Main Class**: Defines the primary object model
* **Methods**: Implements various data handling functions
* **List Comprehensions**: Uses Python's efficient data transformation syntax

### Notable Features:
* **PEP 8 Compliance**: Follows Python style guidelines
* **Efficient Data Handling**: Optimized for performance
* **Clean Implementation**: Well-structured and maintainable

### Potential Improvements:
* Type hints could enhance code clarity
* Additional documentation would benefit future developers`,
        java: `## Java Implementation Analysis

This Java code implements an interface and extends a class for robust object modeling.

### Structure:
* **Class Hierarchy**: Extends a base class and implements interfaces
* **Encapsulation**: Uses private fields with public accessor methods
* **Exception Handling**: Properly manages potential runtime issues

### Key Strengths:
* **Standard Conventions**: Follows Java naming patterns
* **Robust Design**: Well-structured object model
* **Error Management**: Handles exceptions appropriately

### Optimization Opportunities:
* Consider using newer Java features if available
* Performance could be improved in specific methods`,
        default: `## Code Analysis

This code demonstrates effective implementation of the intended functionality.

### Key Components:
* **Structure**: Well-organized with logical flow
* **Naming**: Clear, descriptive variable and function names
* **Algorithm**: Appropriate solution for the problem domain

### Notable Features:
* **Readability**: Easy to understand and maintain
* **Performance**: Optimized for efficient execution
* **Best Practices**: Follows standard coding conventions

### Potential Improvements:
* Additional comments would enhance documentation
* Some edge cases might need additional handling`
      };

      setExplanation(explanations[language] || explanations.default);
      
      toast({
        title: "API Error",
        description: "Could not connect to Mistral AI. Using fallback explanation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Explanation copied to clipboard",
    });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };
  
  const clearCode = () => {
    setCode('');
    toast({
      title: "Code Cleared",
      description: "The code editor has been cleared",
    });
  };

  const codingTips = [
    "Write code that is easy to understand, not clever.",
    "Comment your code, but prefer self-documenting code.",
    "Test early and test often.",
    "Use consistent naming conventions.",
    "Don't repeat yourself (DRY principle).",
    "Keep functions small and focused on a single task.",
    "Learn keyboard shortcuts for your IDE.",
    "Optimize code for readability first, then performance.",
  ];

  // Function to format markdown-like text with HTML
  const formatExplanation = (text: string) => {
    if (!text) return '';
    
    // Replace markdown headings with HTML headings
    let formatted = text
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-5 mb-2">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>');
    
    // Replace bullet points with styled list items
    formatted = formatted.replace(/^\* (.*$)/gim, '<li class="ml-5 mb-2 flex items-start"><span class="text-primary font-bold mr-2">•</span><span>$1</span></li>');
    
    // Wrap adjacent list items in ul tags
    const lines = formatted.split('\n');
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('<li') && !inList) {
        lines[i] = '<ul class="my-3">' + lines[i];
        inList = true;
      } else if (!lines[i].startsWith('<li') && inList) {
        lines[i-1] = lines[i-1] + '</ul>';
        inList = false;
      }
    }
    
    if (inList) {
      lines[lines.length-1] = lines[lines.length-1] + '</ul>';
    }
    
    // Join lines back together
    formatted = lines.join('\n');
    
    // Replace newlines with <br> tags for proper HTML rendering
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
      <header className="container mx-auto py-4 sm:py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BrainCircuitIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold">CodeExplainer AI</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </Button>
      </header>

      <main className="container mx-auto flex-1 px-4 pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto">
          <Card className="mb-6 sm:mb-8 border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-center">Paste Code & Get AI Explanation</CardTitle>
              <CardDescription className="text-center text-base sm:text-lg">
                Our AI will analyze your code and explain it in simple terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                  <label className="text-sm font-medium">Select Language:</label>
                  <div className="flex items-center gap-2">
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-[140px] sm:w-[180px]">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="php">PHP</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="css">CSS</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="markdown">Markdown</SelectItem>
                        <SelectItem value="rust">Rust</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={clearCode}
                      title="Clear code"
                      aria-label="Clear code"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="rounded-md overflow-hidden border">
                  <CodeMirror
                    value={code}
                    height="300px"
                    extensions={[languageExtensions[language]()]}
                    onChange={(value) => setCode(value)}
                    theme={theme === 'dark' ? vscodeDark : xcodeLight}
                    className="text-sm"
                  />
                </div>
              </div>
              <Button 
                onClick={handleExplain} 
                className="w-full py-5 sm:py-6 text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                disabled={isLoading}
              >
                <CodeIcon className="mr-2 h-5 w-5" />
                {isLoading ? 'Analyzing Code...' : 'Explain This Code'}
              </Button>
            </CardContent>
          </Card>

          {(isLoading || explanation) && (
            <Card className="mb-6 sm:mb-8 border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>AI Explanation</CardTitle>
                {explanation && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Mistral AI is analyzing your code...</p>
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: formatExplanation(explanation) }} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="tips" className="mb-6 sm:mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tips">Coding Tips</TabsTrigger>
              <TabsTrigger value="about">About CodeExplainer</TabsTrigger>
            </TabsList>
            <TabsContent value="tips">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LightbulbIcon className="h-5 w-5" />
                    Tips to Improve Your Coding Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {codingTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpenIcon className="h-5 w-5" />
                    About CodeExplainer AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    CodeExplainer AI is a powerful tool that uses advanced artificial intelligence to analyze and explain code in simple terms. Whether you're a beginner trying to understand complex code or an experienced developer reviewing unfamiliar code, our AI assistant makes comprehension faster and easier.
                  </p>
                  <p>
                    Our tool supports multiple programming languages and provides detailed explanations that highlight key concepts, potential issues, and best practices. Powered by Mistral AI, CodeExplainer delivers accurate and insightful code analysis to help you become a better programmer.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t py-4 sm:py-6 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BrainCircuitIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">CodeExplainer AI</span>
              <span className="text-xs text-muted-foreground">developed by Vishalraja</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Powered by Mistral AI © {new Date().getFullYear()}
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/vishalrajal" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

export default App;