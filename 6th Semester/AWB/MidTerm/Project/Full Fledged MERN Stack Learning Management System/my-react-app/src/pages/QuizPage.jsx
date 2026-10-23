import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCourseQuizzes, getQuiz, submitQuiz, getMyAttempts } from '../services/quizService';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

// ─── Quiz List (pick a quiz) ──────────────────────────────────────────────────
const QuizList = ({ courseId, onSelect }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourseQuizzes(courseId)
      .then(({ data }) => setQuizzes(data.quizzes || []))
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <Loader />;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <h3 className="fw-bold mb-4">Course Quizzes</h3>
          {quizzes.length === 0 ? (
            <div className="card border-0 shadow-sm text-center py-5">
              <div className="card-body">
                <i className="bi bi-pencil-square display-4 text-muted mb-3 d-block" />
                <p className="text-muted">No quizzes available for this course yet.</p>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="card border-0 shadow-sm">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">{quiz.title}</h6>
                      {quiz.description && <p className="text-muted small mb-1">{quiz.description}</p>}
                      <div className="d-flex gap-3 small text-muted">
                        <span><i className="bi bi-question-circle me-1" />{quiz.questions?.length || 0} questions</span>
                        {quiz.timeLimitMinutes > 0 && (
                          <span><i className="bi bi-clock me-1" />{quiz.timeLimitMinutes} min</span>
                        )}
                        <span><i className="bi bi-trophy me-1" />Pass: {quiz.passingScore}%</span>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => onSelect(quiz._id)}>
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Quiz Taker ───────────────────────────────────────────────────────────────
const QuizTaker = ({ quizId, onBack }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [pastAttempts, setPastAttempts] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [startedAt] = useState(new Date().toISOString());
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [quizRes, attemptsRes] = await Promise.all([
          getQuiz(quizId),
          getMyAttempts(quizId),
        ]);
        setQuiz(quizRes.data.quiz);
        setPastAttempts(attemptsRes.data.attempts || []);
        if (quizRes.data.quiz.timeLimitMinutes > 0) {
          setTimeLeft(quizRes.data.quiz.timeLimitMinutes * 60);
        }
      } catch {
        toast.error('Failed to load quiz');
        onBack();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [quizId]);

  const handleSubmit = useCallback(async () => {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const answersArray = Object.entries(answers).map(([qi, si]) => ({
        questionIndex: parseInt(qi),
        selectedIndex: si,
      }));
      const { data } = await submitQuiz(quizId, { answers: answersArray, startedAt });
      setResult(data.result);
      toast.success(`Quiz submitted! Score: ${data.result.score}%`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }, [answers, quizId, startedAt, submitting, result]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || result) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result, handleSubmit]);

  if (loading) return <Loader />;
  if (!quiz) return null;

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <button className="btn btn-link p-0 text-muted small mb-1" onClick={onBack}>
                <i className="bi bi-arrow-left me-1" />Back to quizzes
              </button>
              <h4 className="fw-bold mb-0">{quiz.title}</h4>
            </div>
            {timeLeft !== null && !result && (
              <div className={`badge fs-5 px-3 py-2 ${timeLeft < 60 ? 'bg-danger' : 'bg-primary'}`}>
                ⏱ {formatTime(timeLeft)}
              </div>
            )}
          </div>

          {/* Progress */}
          {!result && (
            <div className="mb-4">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Question {currentQuestion + 1} of {totalQuestions}</span>
                <span>{answeredCount} answered</span>
              </div>
              <div className="progress" style={{ height: 6 }}>
                <div className="progress-bar" style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }} />
              </div>
            </div>
          )}

          {/* Result */}
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card border-0 shadow text-center p-5"
            >
              <div className="display-1 mb-3">{result.passed ? '🎉' : '😔'}</div>
              <h3 className="fw-bold">{result.passed ? 'Passed!' : 'Not Passed'}</h3>
              <div
                className="display-4 fw-bold my-3"
                style={{ color: result.passed ? '#198754' : '#dc3545' }}
              >
                {result.score}%
              </div>
              <p className="text-muted">
                {result.earnedPoints} / {result.totalPoints} points ·{' '}
                {Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s
              </p>
              <p className="text-muted small">Passing score: {quiz.passingScore}%</p>

              {/* Review */}
              <div className="text-start mt-4">
                <h6 className="fw-bold mb-3">Answer Review</h6>
                {result.gradedAnswers.map((ga, idx) => (
                  <div key={idx} className={`card mb-2 border-${ga.isCorrect ? 'success' : 'danger'}`}>
                    <div className="card-body py-2 px-3">
                      <p className="mb-1 fw-semibold small">{quiz.questions[idx].question}</p>
                      <p className="mb-0 small">
                        Your answer:{' '}
                        <span className={ga.isCorrect ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                          {ga.selectedIndex >= 0
                            ? quiz.questions[idx].options[ga.selectedIndex]
                            : 'Not answered'}
                        </span>
                        {!ga.isCorrect && (
                          <>
                            {' '}· Correct:{' '}
                            <span className="text-success fw-semibold">
                              {quiz.questions[idx].options[ga.correctIndex]}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary mt-4" onClick={onBack}>
                Back to Quizzes
              </button>
            </motion.div>
          ) : (
            /* Question */
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="card border-0 shadow p-4"
              >
                <h5 className="fw-semibold mb-4">
                  {currentQuestion + 1}. {quiz.questions[currentQuestion].question}
                </h5>
                <div className="d-flex flex-column gap-2">
                  {quiz.questions[currentQuestion].options.map((option, optIdx) => (
                    <button
                      key={optIdx}
                      className={`btn text-start py-3 px-4 ${
                        answers[currentQuestion] === optIdx ? 'btn-primary' : 'btn-outline-secondary'
                      }`}
                      onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion]: optIdx }))}
                    >
                      <span className="me-2 fw-bold">{String.fromCharCode(65 + optIdx)}.</span>
                      {option}
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="d-flex justify-content-between mt-4">
                  <button
                    className="btn btn-outline-secondary"
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion((q) => q - 1)}
                  >
                    ← Previous
                  </button>
                  {currentQuestion < totalQuestions - 1 ? (
                    <button className="btn btn-primary" onClick={() => setCurrentQuestion((q) => q + 1)}>
                      Next →
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting
                        ? 'Submitting...'
                        : `Submit (${answeredCount}/${totalQuestions} answered)`}
                    </button>
                  )}
                </div>

                {/* Dot navigator */}
                <div className="d-flex flex-wrap gap-1 mt-3 justify-content-center">
                  {quiz.questions.map((_, idx) => (
                    <button
                      key={idx}
                      className={`btn btn-sm rounded-circle p-0 ${
                        idx === currentQuestion
                          ? 'btn-primary'
                          : answers[idx] !== undefined
                          ? 'btn-success'
                          : 'btn-outline-secondary'
                      }`}
                      style={{ width: 28, height: 28, fontSize: 11 }}
                      onClick={() => setCurrentQuestion(idx)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Past attempts */}
          {pastAttempts.length > 0 && !result && (
            <div className="mt-4">
              <h6 className="fw-bold text-muted small">
                Past Attempts ({pastAttempts.length}/{quiz.maxAttempts})
              </h6>
              {pastAttempts.map((a, i) => (
                <div key={i} className="d-flex justify-content-between small text-muted border-bottom py-1">
                  <span>Attempt {i + 1}</span>
                  <span className={a.passed ? 'text-success' : 'text-danger'}>
                    {a.score}% — {a.passed ? 'Passed ✓' : 'Failed ✗'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main QuizPage (router) ───────────────────────────────────────────────────
const QuizPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  if (selectedQuizId) {
    return (
      <QuizTaker
        quizId={selectedQuizId}
        onBack={() => setSelectedQuizId(null)}
      />
    );
  }

  return (
    <QuizList
      courseId={courseId}
      onSelect={setSelectedQuizId}
    />
  );
};

export default QuizPage;
