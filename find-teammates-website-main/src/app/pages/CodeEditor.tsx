import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Editor from '@monaco-editor/react';
import {
  Play,
  Save,
  Download,
  Users,
  Copy,
  CheckCircle,
  Code2,
  FileCode,
  Terminal,
  Settings,
  Share2,
  MessageCircle,
  Video,
  Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { DashboardLayout } from '../components/DashboardLayout';
import { copyToClipboard } from '../utils/clipboard';

const mockCollaborators = [
  { id: '1', name: 'Rahul Sharma', avatar: 'RS', color: 'bg-blue-500', cursor: { line: 12, col: 25 } },
  { id: '2', name: 'Priya Singh', avatar: 'PS', color: 'bg-purple-500', cursor: { line: 8, col: 15 } },
  { id: '3', name: 'Arjun Patel', avatar: 'AP', color: 'bg-green-500', cursor: { line: 20, col: 5 } },
];

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'cpp', name: 'C++', icon: '⚡' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
];

const codeTemplates = {
  javascript: `// JavaScript Code Editor
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));

// Collaborative coding with your team
// Start building something amazing!`,
  python: `# Python Code Editor
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))

# Collaborative coding with your team
# Start building something amazing!`,
  java: `// Java Code Editor
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Collaborative coding with your team
        // Start building something amazing!
    }
}`,
  cpp: `// C++ Code Editor
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    // Collaborative coding with your team
    // Start building something amazing!
    return 0;
}`,
  typescript: `// TypeScript Code Editor
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));

// Collaborative coding with your team
// Start building something amazing!`,
};

export function CodeEditor() {
  const [code, setCode] = useState(codeTemplates.javascript);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const editorRef = useRef(null);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(codeTemplates[lang as keyof typeof codeTemplates]);
    setOutput('');
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput('Running code...\n');

    // Simulate code execution
    setTimeout(() => {
      const outputs = [
        'Hello, World!\n✓ Code executed successfully',
        'Output:\nHello, World!\n\n✓ Execution completed in 0.45s',
        'Compiling...\nExecuting...\nHello, World!\n\n✓ Process finished with exit code 0',
      ];
      setOutput(outputs[Math.floor(Math.random() * outputs.length)]);
      setIsRunning(false);
    }, 1500);
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : 'ts'}`;
    a.click();
  };

  const copyCode = () => {
    copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Code2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Collaborative Code Editor</h1>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-300">
            <Users className="h-3 w-3 mr-1" />
            {mockCollaborators.length} Online
          </Badge>
        </div>
        <p className="text-gray-600">Code together in real-time with your team</p>
      </div>

      {/* Toolbar */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Language:</span>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.id}
                    variant={language === lang.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleLanguageChange(lang.id)}
                  >
                    <span className="mr-1">{lang.icon}</span>
                    {lang.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyCode}>
                {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="outline" size="sm" onClick={saveCode}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowChat(!showChat)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button onClick={runCode} disabled={isRunning}>
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Code Editor Section */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-20rem)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Code Editor</span>
                <div className="flex items-center gap-2">
                  {mockCollaborators.map((collab) => (
                    <div
                      key={collab.id}
                      className={`h-8 w-8 rounded-full ${collab.color} flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:scale-110 transition-transform`}
                      title={`${collab.name} - Line ${collab.cursor.line}`}
                    >
                      {collab.avatar}
                    </div>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  fontFamily: 'Fira Code, Consolas, Monaco, monospace',
                  fontLigatures: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  smoothScrolling: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  padding: { top: 16, bottom: 16 },
                }}
                loading={
                  <div className="flex items-center justify-center h-full bg-gray-900 text-white">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p>Loading Editor...</p>
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>

          {/* Output Console */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="h-5 w-5 text-green-600" />
                Output Console
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto font-mono text-sm">
                {output ? (
                  <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
                ) : (
                  <p className="text-gray-500 italic">Click "Run Code" to see output here...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Chat & Collaborators */}
        <div className="space-y-4">
          {/* Collaborators */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Active Collaborators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockCollaborators.map((collab) => (
                <div key={collab.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full ${collab.color} flex items-center justify-center text-white font-semibold`}>
                      {collab.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{collab.name}</p>
                      <p className="text-xs text-gray-500">Line {collab.cursor.line}, Col {collab.cursor.col}</p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chat Panel */}
          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card className="h-[400px] flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-purple-600" />
                        Team Chat
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                        ✕
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-4 pt-0">
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">RS</div>
                          <span className="text-sm font-semibold">Rahul</span>
                          <span className="text-xs text-gray-500">2m ago</span>
                        </div>
                        <p className="text-sm text-gray-700">Great code! Let's add error handling.</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">PS</div>
                          <span className="text-sm font-semibold">Priya</span>
                          <span className="text-xs text-gray-500">1m ago</span>
                        </div>
                        <p className="text-sm text-gray-700">I agree! Also, we should optimize the loop. 🚀</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Type a message..." className="flex-1" />
                      <Button size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => copyToClipboard(window.location.href)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Session Link
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={saveCode}>
                <Save className="h-4 w-4 mr-2" />
                Save to Cloud
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Start Video Call
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}