// src/components/ai/PerformancePredictor.tsx
import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';
// Fix: Use type-only import
import type { PerformancePrediction } from './types/ai.types';
// Fix: Comment out unused import or use it if needed
// import aiAPI from '../../api/ai.api'; // TODO: Uncomment when API is ready

interface PerformancePredictorProps {
  studentId?: string;
  subject?: string;
  onPredict?: (prediction: PerformancePrediction) => void;
  className?: string;
}

const PerformancePredictor: React.FC<PerformancePredictorProps> = ({
  studentId: _studentId, // Fix: Prefix with underscore to indicate intentionally unused
  subject,
  onPredict,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PerformancePrediction | null>(null);
  const [selectedSubject, setSelectedSubject] = useState(subject || '');

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'History',
    'Literature',
    'Geography',
  ];

  useEffect(() => {
    if (subject) {
      fetchPrediction(subject);
    }
    // Fix: Add eslint disable comment if needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  const fetchPrediction = async (subjectName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // This would typically call an API endpoint
      // TODO: Replace with actual API call when backend is ready
      // const response = await aiAPI.getPerformancePrediction(_studentId, subjectName);
      // setPrediction(response.data);
      
      // For demo, we'll generate mock data
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockPrediction: PerformancePrediction = {
        subject: subjectName,
        currentScore: 72,
        predictedScore: 85,
        confidence: 0.85,
        recommendations: [
          'Focus on advanced topics in algebra',
          'Complete practice problems daily',
          'Review fundamental concepts',
          'Join study groups for collaborative learning',
          'Use interactive learning tools',
        ],
        weakAreas: ['Calculus', 'Trigonometry', 'Complex Numbers'],
        strongAreas: ['Algebra', 'Geometry', 'Statistics'],
        timeToImprove: '3 months',
      };

      setPrediction(mockPrediction);
      onPredict?.(mockPrediction);
    } catch (err) {
      setError('Failed to generate prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  const handlePredict = () => {
    if (selectedSubject) {
      fetchPrediction(selectedSubject);
    }
  };

  if (isLoading) {
    return (
      <Card className={`text-center py-8 ${className}`}>
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Analyzing your performance data...
        </p>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Card.Header
        title="Performance Predictor"
        subtitle="AI-powered analysis and predictions"
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

        {!prediction ? (
          <div className="space-y-4">
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a subject</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>

            <Button
              onClick={handlePredict}
              disabled={!selectedSubject}
              fullWidth
              size="lg"
            >
              Generate Prediction
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current vs Predicted */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {prediction.subject}
              </h3>
              <div className="flex items-center justify-center space-x-4">
                <div>
                  <p className="text-sm text-gray-500">Current</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {prediction.currentScore}%
                  </p>
                </div>
                <span className="text-2xl text-gray-400">→</span>
                <div>
                  <p className="text-sm text-gray-500">Predicted</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {prediction.predictedScore}%
                  </p>
                </div>
              </div>
            </div>

            {/* Confidence indicator */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prediction Confidence
                </span>
                <Badge variant="primary">
                  {Math.round(prediction.confidence * 100)}%
                </Badge>
              </div>
              <ProgressBar
                value={prediction.confidence * 100}
                color="blue"
                size="md"
              />
              <p className="text-xs text-gray-500 mt-2">
                Estimated time to achieve: {prediction.timeToImprove}
              </p>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Strong Areas
                </h4>
                <div className="space-y-1">
                  {prediction.strongAreas.map((area, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                      {area}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <span className="text-yellow-500 mr-2">⚠</span>
                  Need Improvement
                </h4>
                <div className="space-y-1">
                  {prediction.weakAreas.map((area, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2" />
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Recommended Actions
              </h4>
              <div className="space-y-2">
                {prediction.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded"
                  >
                    <span className="text-blue-600 dark:text-blue-400 font-bold">→</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setPrediction(null)}
                fullWidth
              >
                New Prediction
              </Button>
              <Button variant="primary" fullWidth>
                Create Study Plan
              </Button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PerformancePredictor;