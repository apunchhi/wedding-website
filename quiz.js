import { QUIZ_DATA } from "./quiz-data.js";

const QUIZ_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzGDYZbrH5mG5OzNTtDghn946OJfFKmaBkbux1Wnrga9_B_ZWfiEBb6jy_uUGyGLbUHBA/exec";
const SCHEMA_VERSION = 1;
const QUIZ_VERSION = 1;

const introScreen = document.querySelector("#quiz-intro-screen");
const title = document.querySelector("#quiz-title");
const introCopy = document.querySelector("#quiz-intro-copy");
const nameForm = document.querySelector("#quiz-name-form");
const nameInput = document.querySelector("#quiz-guest-name");
const questionForm = document.querySelector("#quiz-question-form");
const questionMount = document.querySelector("#quiz-question");
const progressText = document.querySelector("#quiz-progress-text");
const progress = document.querySelector("#quiz-progress");
const status = document.querySelector("#quiz-status");
const previousButton = document.querySelector("#quiz-previous");
const nextButton = document.querySelector("#quiz-next");
const resultScreen = document.querySelector("#quiz-result");
const resultName = document.querySelector("#quiz-result-name");
const resultTitle = document.querySelector("#quiz-result-title");
const resultCopy = document.querySelector("#quiz-result-copy");
const restartButton = document.querySelector("#quiz-restart");

const elements = [
  introScreen,
  title,
  introCopy,
  nameForm,
  nameInput,
  questionForm,
  questionMount,
  progressText,
  progress,
  status,
  previousButton,
  nextButton,
  resultScreen,
  resultName,
  resultTitle,
  resultCopy,
  restartButton,
];

if (elements.every(Boolean)) {
  const state = {
    guestName: "",
    currentQuestion: 0,
    answers: new Map(),
    attemptId: null,
    submissionStarted: false,
  };

  title.textContent = QUIZ_DATA.title;
  introCopy.textContent = QUIZ_DATA.intro;
  progress.max = QUIZ_DATA.questions.length;

  const showScreen = (screen) => {
    introScreen.hidden = screen !== "intro";
    questionForm.hidden = screen !== "question";
    resultScreen.hidden = screen !== "result";
  };

  const selectedAnswer = (question) => state.answers.get(question.id);

  const renderQuestion = () => {
    const question = QUIZ_DATA.questions[state.currentQuestion];
    const questionNumber = state.currentQuestion + 1;
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    const answers = document.createElement("div");

    legend.id = `${question.id}-prompt`;
    legend.tabIndex = -1;
    legend.textContent = question.prompt;
    answers.className = "quiz-answers";

    question.answers.forEach((answer, answerIndex) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      const answerText = document.createElement("span");

      input.type = "radio";
      input.name = "quiz-answer";
      input.value = answer.id;
      input.required = answerIndex === 0;
      input.checked = selectedAnswer(question) === answer.id;
      answerText.textContent = answer.text;

      label.append(input, answerText);
      answers.append(label);
    });

    fieldset.setAttribute("aria-labelledby", legend.id);
    fieldset.append(legend, answers);
    questionMount.replaceChildren(fieldset);

    progressText.textContent = `Question ${questionNumber} of ${QUIZ_DATA.questions.length}`;
    progress.value = questionNumber;
    status.textContent = progressText.textContent;
    previousButton.disabled = state.currentQuestion === 0;
    nextButton.textContent =
      state.currentQuestion === QUIZ_DATA.questions.length - 1
        ? "See result"
        : "Next";

    requestAnimationFrame(() => legend.focus());
  };

  const calculateScore = () =>
    QUIZ_DATA.questions.reduce((total, question) => {
      const answerId = selectedAnswer(question);
      const answer = question.answers.find(({ id }) => id === answerId);
      return total + (answer?.score ?? 0);
    }, 0);

  const resultKeyForScore = (score) => {
    if (score >= 2) return "ananya";
    if (score <= -2) return "amar";
    return "blend";
  };

  const createAttemptId = () => {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    const randomPart = crypto.getRandomValues(new Uint32Array(2)).join("-");
    return `${Date.now()}-${randomPart}`;
  };

  const buildSubmission = (score, resultKey, result) => ({
    schema_version: SCHEMA_VERSION,
    quiz_version: QUIZ_VERSION,
    attempt_id: state.attemptId,
    guest_name: state.guestName,
    completed_at: new Date().toISOString(),
    raw_score: score,
    result_key: resultKey,
    result_label: result.title,
    answers: QUIZ_DATA.questions.map((question) => {
      const answerId = selectedAnswer(question);
      const answer = question.answers.find(({ id }) => id === answerId);

      return {
        question_id: question.id,
        answer_id: answer.id,
        score: answer.score,
      };
    }),
  });

  const submitAttempt = (payload) => {
    if (state.submissionStarted) return;
    state.submissionStarted = true;

    void fetch(QUIZ_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },
      body: JSON.stringify(payload),
    }).catch(() => {});
  };

  const showResult = () => {
    const score = calculateScore();
    const resultKey = resultKeyForScore(score);
    const result = QUIZ_DATA.results[resultKey];

    resultName.textContent = state.guestName;
    resultTitle.textContent = result.title;
    resultCopy.textContent = result.text;
    showScreen("result");
    status.textContent = result.title;
    requestAnimationFrame(() => resultTitle.focus());
    submitAttempt(buildSubmission(score, resultKey, result));
  };

  nameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!nameForm.reportValidity()) return;

    state.guestName = nameInput.value.trim();
    if (!state.guestName) {
      nameInput.setCustomValidity("Please enter your name.");
      nameForm.reportValidity();
      return;
    }

    nameInput.setCustomValidity("");
    state.currentQuestion = 0;
    state.attemptId = createAttemptId();
    state.submissionStarted = false;
    showScreen("question");
    renderQuestion();
  });

  nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));

  questionMount.addEventListener("change", (event) => {
    const input = event.target.closest('input[name="quiz-answer"]');
    if (!input) return;

    const question = QUIZ_DATA.questions[state.currentQuestion];
    state.answers.set(question.id, input.value);
  });

  questionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!questionForm.reportValidity()) return;

    if (state.currentQuestion === QUIZ_DATA.questions.length - 1) {
      showResult();
      return;
    }

    state.currentQuestion += 1;
    renderQuestion();
  });

  previousButton.addEventListener("click", () => {
    if (state.currentQuestion === 0) return;
    state.currentQuestion -= 1;
    renderQuestion();
  });

  restartButton.addEventListener("click", () => {
    state.guestName = "";
    state.currentQuestion = 0;
    state.answers.clear();
    state.attemptId = null;
    state.submissionStarted = false;
    nameForm.reset();
    questionMount.replaceChildren();
    resultName.textContent = "";
    resultTitle.textContent = "";
    resultCopy.textContent = "";
    progress.value = 1;
    progressText.textContent = `Question 1 of ${QUIZ_DATA.questions.length}`;
    previousButton.disabled = true;
    nextButton.textContent = "Next";
    status.textContent = "";
    showScreen("intro");
    requestAnimationFrame(() => nameInput.focus());
  });

  showScreen("intro");
}
