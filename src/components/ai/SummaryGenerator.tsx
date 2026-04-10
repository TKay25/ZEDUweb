// src/components/ai/SummaryGenerator.tsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Input from '../ui/Input'; // Fix: Add missing Input import
import Tabs from '../ui/Tabs';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
// Fix: Use type-only import
import type { Summary } from './types/ai.types';
import aiAPI from '../../api/ai.api';

// Define the generated summary structure (without title, content, keyPoints)
interface GeneratedSummary {
  title?: string;
  content?: string;
  keyPoints?: string[];
  readingTime?: number;
  vocabulary?: Array<{ term: string; definition: string }>;
  source?: { type: string; url?: string };
  difficulty?: string;
}

interface SummaryGeneratorProps {
  onSummaryGenerated?: (summary: Summary) => void;
  className?: string;
}

const SummaryGenerator: React.FC<SummaryGeneratorProps> = ({
  onSummaryGenerated,
  className = '',
}) => {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [inputType, setInputType] = useState<'text' | 'url'>('text');
  const [options, setOptions] = useState({
    length: 'medium' as 'short' | 'medium' | 'detailed',
    format: 'paragraph' as 'bullet' | 'paragraph' | 'outline',
    includeKeyTerms: true,
    language: 'english',
  });

  const [generatedSummary, setGeneratedSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  const lengthOptions = [
    { value: 'short', label: 'Short (1-2 paragraphs)' },
    { value: 'medium', label: 'Medium (3-4 paragraphs)' },
    { value: 'detailed', label: 'Detailed (5+ paragraphs)' },
  ];

  const formatOptions = [
    { value: 'paragraph', label: 'Paragraphs' },
    { value: 'bullet', label: 'Bullet Points' },
    { value: 'outline', label: 'Outline' },
  ];

  const handleGenerateSummary = async () => {
    if (!content && !url) {
      setError('Please enter content or a URL to summarize');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let summaryData: GeneratedSummary;

      if (inputType === 'url' && url) {
        summaryData = await aiAPI.summarizeVideo(url, options);
      } else {
        summaryData = await aiAPI.generateSummary({
          content,
          ...options,
        });
      }

      // Create full Summary object with all required properties
      const fullSummary: Summary = {
        id: `summary_${Date.now()}`,
        title: summaryData.title || 'Generated Summary',
        content: summaryData.content || '',
        keyPoints: summaryData.keyPoints || [],
        readingTime: summaryData.readingTime || 3,
        vocabulary: summaryData.vocabulary || [],
        source: summaryData.source || { type: inputType === 'url' ? 'video' : 'text' },
        difficulty: summaryData.difficulty || 'medium',
        //createdAt: new Date().toISOString(),
      };

      setGeneratedSummary(fullSummary);
      onSummaryGenerated?.(fullSummary);
    } catch (err) {
      console.error('Summary generation error:', err);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedSummary(null);
    setContent('');
    setUrl('');
    setError(null);
  };

  const copyToClipboard = () => {
    if (generatedSummary) {
      navigator.clipboard.writeText(generatedSummary.content);
      // Show success toast
    }
  };

  const downloadSummary = () => {
    if (generatedSummary) {
      const blob = new Blob([generatedSummary.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `summary-${generatedSummary.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (generatedSummary) {
    return (
      <Card className={className}>
        <Card.Header
          title={generatedSummary.title}
          subtitle={`Generated summary • ${generatedSummary.readingTime} min read`}
          action={
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                📋 Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadSummary}>
                📥 Download
              </Button>
              <Button variant="primary" size="sm" onClick={handleReset}>
                New Summary
              </Button>
            </div>
          }
        />

        <div className="p-4">
          {/* Custom tab content instead of using Tabs.Panel */}
          {activeTab === 'summary' && (
            <div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {generatedSummary.content}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'keyPoints' && (
            <div>
              <div className="mt-4">
                <ul className="space-y-2">
                  {generatedSummary.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'vocabulary' && (
            <div>
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedSummary.vocabulary && generatedSummary.vocabulary.map((item, index) => (
                    <Card key={index} variant="outlined" padding="sm">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {item.term}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.definition}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Tabs
            items={[
              { key: 'summary', label: 'Summary' },
              { key: 'keyPoints', label: 'Key Points' },
              { key: 'vocabulary', label: 'Vocabulary' },
            ]}
            activeKey={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <Card.Footer divider>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Source: {generatedSummary.source?.type || 'text'}</span>
            <Badge variant="primary" size="sm">
              {generatedSummary.difficulty}
            </Badge>
          </div>
        </Card.Footer>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Card.Header
        title="AI Summary Generator"
        subtitle="Create concise summaries from text or video content"
      />

      <Card.Body>
        {error && (
          <Alert
            variant="error"
            message={error}
            className="mb-4"
            dismissible
            onDismiss={() => setError(null)}
          />
        )}

        <div className="mb-4">
          <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <button
              onClick={() => setInputType('text')}
              className={`
                px-4 py-2 text-sm font-medium rounded-t-lg
                ${inputType === 'text'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              Text Input
            </button>
            <button
              onClick={() => setInputType('url')}
              className={`
                px-4 py-2 text-sm font-medium rounded-t-lg
                ${inputType === 'url'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              Video URL
            </button>
          </div>
        </div>

        {inputType === 'text' ? (
          <Textarea
            label="Content to Summarize"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder="Paste your article, document, or notes here..."
            rows={8}
            required
            fullWidth
          />
        ) : (
          <Input
            label="Video URL"
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            fullWidth
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Select
            label="Summary Length"
            value={options.length}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOptions({ ...options, length: e.target.value as any })}
            options={lengthOptions}
            fullWidth
          />

          <Select
            label="Output Format"
            value={options.format}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOptions({ ...options, format: e.target.value as any })}
            options={formatOptions}
            fullWidth
          />
        </div>

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="includeKeyTerms"
            checked={options.includeKeyTerms}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOptions({ ...options, includeKeyTerms: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            htmlFor="includeKeyTerms"
            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Include key terms and definitions
          </label>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleGenerateSummary}
            disabled={isLoading || (!content && !url)}
            fullWidth
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Spinner size="sm" color="white" />
                <span>Generating Summary...</span>
              </div>
            ) : (
              'Generate Summary'
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SummaryGenerator;