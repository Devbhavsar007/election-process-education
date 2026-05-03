import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle, Loader2, Trophy } from 'lucide-react';
import { getQuiz, submitQuiz } from '../services/api.js';
import './KnowledgeQuiz.css';

const KnowledgeQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuiz().then(res => setQuestions(res.data.questions || []))
      .catch(() => {
        setQuestions([
          { id: 1, question: 'What is the minimum voting age in India?', options: ['16','18','21','25'], correct: 1 },
          { id: 2, question: 'Which body conducts elections in India?', options: ['Supreme Court','Parliament','Election Commission of India','NITI Aayog'], correct: 2 },
          { id: 3, question: 'What does EVM stand for?', options: ['Electronic Voting Machine','Electoral Vote Management','Election Verification Module','Electronic Vote Monitor'], correct: 0 },
          { id: 4, question: 'What is NOTA?', options: ['A political party','None Of The Above option','A voter ID type','An election law'], correct: 1 },
          { id: 5, question: 'How many Lok Sabha constituencies are there?', options: ['435','543','620','500'], correct: 1 },
        ]);
      }).finally(() => setLoading(false));
  }, []);

  const handleAnswer = (qi, oi) => { if (!submitted) setAnswers(prev => ({ ...prev, [qi]: oi })); };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      const res = await submitQuiz(answers);
      setScore(res.data.score);
    } catch {
      let correct = 0;
      questions.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
      setScore(Math.round((correct / questions.length) * 100));
    }
  };

  if (loading) return <section className="quiz-section"><div className="journey-loading"><Loader2 size={32} className="spin" /><p>Loading quiz...</p></div></section>;
  if (!questions.length) return <section className="quiz-section"><p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No quiz available</p></section>;

  const q = questions[current];

  return (
    <section className="quiz-section">
      <div className="quiz-container">
        <motion.div className="quiz-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <BookOpen size={28} style={{ color: 'var(--accent-secondary)' }} />
          <h1>Knowledge Quiz</h1>
          <p>Test your understanding of Indian elections</p>
        </motion.div>
        {submitted && score !== null ? (
          <motion.div className="quiz-results" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Trophy size={48} style={{ color: score >= 70 ? 'var(--success)' : 'var(--accent-secondary)' }} />
            <h2>{score}%</h2>
            <p>{score >= 80 ? 'Excellent! You\'re a democracy champion!' : score >= 50 ? 'Good effort! Keep learning!' : 'Keep exploring CivicVerse to improve!'}</p>
          </motion.div>
        ) : (
          <>
            <div className="quiz-progress">
              <div className="quiz-progress-bar" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
              <span>{current + 1} / {questions.length}</span>
            </div>
            <motion.div className="quiz-card" key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3>{q.question}</h3>
              <div className="quiz-options">
                {q.options.map((opt, oi) => (
                  <motion.button key={oi} className={`quiz-option ${answers[current] === oi ? 'selected' : ''}`}
                    onClick={() => handleAnswer(current, oi)} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                    <span className="opt-letter">{String.fromCharCode(65 + oi)}</span>{opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
            <div className="quiz-nav">
              {current > 0 && <button className="quiz-nav-btn" onClick={() => setCurrent(c => c - 1)}>Previous</button>}
              {current < questions.length - 1 ? (
                <button className="quiz-nav-btn primary" onClick={() => setCurrent(c => c + 1)} disabled={answers[current] === undefined}>Next</button>
              ) : (
                <button className="quiz-nav-btn primary" onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length}>Submit Quiz</button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
export default KnowledgeQuiz;
