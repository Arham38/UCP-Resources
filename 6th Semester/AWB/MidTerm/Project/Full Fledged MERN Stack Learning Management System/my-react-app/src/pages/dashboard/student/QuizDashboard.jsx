import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const QuizDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/quizzes/assignments/student', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setAssignments(data.assignments);
      }
    } catch (error) {
      toast.error('Failed to fetch quiz assignments');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (assignment) => {
    try {
      const response = await fetch(`/api/quizzes/${assignment.quiz._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setSelectedQuiz(data.quiz);
        setQuizStarted(true);
        setCurrentQuestion(0);
        setAnswers({});
        setStartTime(new Date());
        
        if (data.quiz.timeLimitMinutes > 0) {
          setTimeLeft(data.quiz.timeLimitMinutes * 60);
        }
      }
    } catch {
      toast.error('Failed to start quiz');
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz || !startTime) return;

    const formattedAnswers = Object.entries(answers).map(([questionIndex, selectedIndex]) => ({
      questionIndex: parseInt(questionIndex),
      selectedIndex
    }));

    try {
      const response = await fetch(`/api/quizzes/${selectedQuiz._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          answers: formattedAnswers,
          startedAt: startTime
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQuizResult(data.result);
        setQuizStarted(false);
        toast.success(`Quiz submitted! Score: ${data.result.score}%`);
        fetchAssignments(); // Refresh to update completion status
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to submit quiz');
      console.error('Submit error:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (assignment) => {
    const now = new Date();
    const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;

    if (assignment.completed) {
      return <span className="badge bg-success">Completed</span>;
    } else if (dueDate && now > dueDate) {
      return <span className="badge bg-danger">Overdue</span>;
    } else {
      return <span className="badge bg-primary">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  // Quiz Taking Interface
  if (quizStarted && selectedQuiz) {
    const question = selectedQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

    return (
      <div className="container-fluid p-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Quiz Header */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-1">{selectedQuiz.title}</h5>
                    <p className="text-muted mb-0">
                      Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                    </p>
                  </div>
                  {timeLeft > 0 && (
                    <div className="text-center">
                      <div className={`fw-bold ${timeLeft < 300 ? 'text-danger' : 'text-primary'}`}>
                        {formatTime(timeLeft)}
                      </div>
                      <small className="text-muted">Time Left</small>
                    </div>
                  )}
                </div>
                
                <div className="progress mt-3" style={{ height: 8 }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question Card */}
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card border-0 shadow-sm mb-4"
            >
              <div className="card-body p-4">
                <h6 className="fw-bold mb-4">{question.question}</h6>
                
                <div className="d-grid gap-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      className={`btn text-start p-3 ${
                        answers[currentQuestion] === index
                          ? 'btn-primary'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                          answers[currentQuestion] === index
                            ? 'bg-white text-primary'
                            : 'bg-light text-muted'
                        }`} style={{ width: 32, height: 32, fontSize: 14, fontWeight: 'bold' }}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-outline-secondary"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                <i className="bi bi-arrow-left me-2" />
                Previous
              </button>

              <div className="d-flex gap-2">
                {selectedQuiz.questions.map((_, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm ${
                      index === currentQuestion
                        ? 'btn-primary'
                        : answers[index] !== undefined
                        ? 'btn-success'
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => setCurrentQuestion(index)}
                    style={{ width: 40, height: 40 }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentQuestion === selectedQuiz.questions.length - 1 ? (
                <button
                  className="btn btn-success"
                  onClick={handleSubmitQuiz}
                >
                  Submit Quiz
                  <i className="bi bi-check-lg ms-2" />
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleNextQuestion}
                >
                  Next
                  <i className="bi bi-arrow-right ms-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Result Display
  if (quizResult) {
    return (
      <div className="container-fluid p-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <i className={`bi ${quizResult.passed ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`} 
                     style={{ fontSize: '4rem' }} />
                </div>
                
                <h3 className="fw-bold mb-3">
                  {quizResult.passed ? 'Congratulations!' : 'Keep Trying!'}
                </h3>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className="bg-light rounded p-3">
                      <div className="fw-bold text-primary fs-4">{quizResult.score}%</div>
                      <small className="text-muted">Your Score</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="bg-light rounded p-3">
                      <div className="fw-bold text-success fs-4">{quizResult.earnedPoints}</div>
                      <small className="text-muted">Points Earned</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="bg-light rounded p-3">
                      <div className="fw-bold text-info fs-4">{quizResult.totalPoints}</div>
                      <small className="text-muted">Total Points</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="bg-light rounded p-3">
                      <div className="fw-bold text-warning fs-4">{formatTime(quizResult.timeTakenSeconds)}</div>
                      <small className="text-muted">Time Taken</small>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setQuizResult(null);
                      setSelectedQuiz(null);
                    }}
                  >
                    <i className="bi bi-arrow-left me-2" />
                    Back to Quizzes
                  </button>
                  {quizResult.detailedResults && (
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-eye me-2" />
                      View Detailed Results
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Assignments List
  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">My Quiz Assignments</h2>
        <p className="text-muted mb-0">Complete your assigned quizzes and track your progress</p>
      </div>

      {/* Assignments Grid */}
      <div className="row g-4">
        {assignments.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-clipboard-check text-muted" style={{ fontSize: '4rem' }} />
              <h4 className="text-muted mt-3">No Quiz Assignments</h4>
              <p className="text-muted">You don't have any quiz assignments at the moment</p>
            </div>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment._id} className="col-lg-6 col-xl-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card h-100 border-0 shadow-sm"
              >
                <div className="card-header bg-white border-0 pb-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{assignment.quiz.title}</h6>
                      <p className="text-muted small mb-2">{assignment.course.title}</p>
                    </div>
                    {getStatusBadge(assignment)}
                  </div>
                </div>

                <div className="card-body pt-2">
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <div className="text-center p-2 bg-light rounded">
                        <div className="fw-bold text-primary">{assignment.quiz.questions?.length || 0}</div>
                        <div className="small text-muted">Questions</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center p-2 bg-light rounded">
                        <div className="fw-bold text-info">{assignment.quiz.timeLimitMinutes || 'No'}</div>
                        <div className="small text-muted">Time Limit</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center p-2 bg-light rounded">
                        <div className="fw-bold text-success">{assignment.quiz.passingScore}%</div>
                        <div className="small text-muted">Pass Score</div>
                      </div>
                    </div>
                  </div>

                  <div className="small text-muted mb-3">
                    <div className="d-flex align-items-center gap-1 mb-1">
                      <i className="bi bi-calendar" />
                      <span>Due: {formatDate(assignment.dueDate)}</span>
                    </div>
                    <div className="d-flex align-items-center gap-1 mb-1">
                      <i className="bi bi-person" />
                      <span>Instructor: {assignment.instructor.name}</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <i className="bi bi-repeat" />
                      <span>Attempts: {assignment.attemptCount}/{assignment.quiz.maxAttempts}</span>
                    </div>
                  </div>

                </div>

                <div className="card-footer bg-white border-0 pt-0">
                  {assignment.completed ? (
                    <button className="btn btn-success w-100" disabled>
                      <i className="bi bi-check-circle me-2" />
                      Completed
                    </button>
                  ) : assignment.attemptCount >= assignment.quiz.maxAttempts ? (
                    <button className="btn btn-danger w-100" disabled>
                      <i className="bi bi-x-circle me-2" />
                      Max Attempts Reached
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleStartQuiz(assignment)}
                    >
                      <i className="bi bi-play-circle me-2" />
                      {assignment.attemptCount > 0 ? 'Retake Quiz' : 'Start Quiz'}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizDashboard;
