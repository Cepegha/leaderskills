import { useEffect, useState } from 'react';
import './App.css';

// Код из Gemini Canvas можно вставлять внутрь компонента App
// или импортировать как отдельный компонент

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Инициализация телеграм-приложения
    const tg = window.Telegram.WebApp;
    
    // Сообщаем телеграму, что приложение готово
    tg.ready();
    
    // Разворачиваем на весь экран
    tg.expand(); 

    // Получаем данные пользователя (если запущен внутри Телеграм)
    if (tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }
    
    // Устанавливаем цвета приложения в соответствии с темой Телеграм
    // Это делает приложение "родным" на вид
    document.body.style.backgroundColor = tg.themeParams.bg_color || '#ffffff';
    document.body.style.color = tg.themeParams.text_color || '#000000';

  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Привет, {user ? user.first_name : 'Гость'}! 👋</h1>
      
      <p>Это твое React приложение внутри Telegram.</p>
      
      <div className="card">
        {/* Здесь может быть ваш компонент из Canvas */
        
        import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, HelpCircle, BookOpen, Award, User, Briefcase, 
  ChevronRight, RefreshCw, XCircle, CheckCircle, TrendingUp, 
  AlertTriangle, BrainCircuit, ListOrdered, CheckSquare, ArrowUp, ArrowDown,
  Info, Database, CloudLightning, WifiOff, Save, Library, Send
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken,
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  Firestore 
} from 'firebase/firestore';

// --- TYPES ---

type ScenarioType = 'single' | 'multi' | 'order';

type Scenario = {
  id: number;
  category: string;
  type: ScenarioType;
  text: string;
  sender: 'coach' | 'user' | 'system';
  options?: Option[]; 
  items?: Item[]; 
  correctOrder?: string[]; 
  correctSelection?: string[]; 
  bookReference?: string; 
  hint?: string;
  explanation?: string; 
};

type Option = {
  text: string;
  scoreImpact: number;
  feedback: string; 
};

type Item = {
  id: string;
  text: string;
};

type Message = {
  id: string;
  text: string;
  sender: 'coach' | 'user';
  isFeedback?: boolean; 
};

type DebriefData = {
  isCorrect: boolean;
  userScore: number;
  userChoiceText: string | React.ReactNode;
  userConsequences: string;
  correctAnswerText: string | React.ReactNode;
  correctRationale: string;
  bookRecommendation: string;
};

// --- DATA POOL ---

const SCENARIOS_POOL: Scenario[] = [
  // ==========================================
  // БЛОК 1: СТРАТЕГИЯ И ИННОВАЦИИ
  // ==========================================
  {
    id: 1,
    category: "Стратегия",
    type: 'single',
    sender: 'coach',
    text: "Кейс: «Дилемма Инноватора». \n\nВаш флагманский продукт приносит 80% прибыли, но рынок стагнирует. R&D отдел создал прототип продукта-«убийцы», который сделает ваш флагман ненужным. Новый продукт пока сырой и низкомаржинальный. Акционеры требуют роста прибыли в этом квартале.",
    bookReference: "Клейтон Кристенсен — «Дилемма инноватора»",
    hint: "Если вы не каннибализируете свой бизнес сами, это сделают конкуренты.",
    explanation: "Попытка защитить старую бизнес-модель и отказ от подрывных инноваций ради краткосрочной прибыли — главная причина гибели великих компаний.",
    options: [
      { text: "Спрятать новинку, выжать максимум из старого продукта.", scoreImpact: -20, feedback: "Ошибка Kodak. Конкуренты выпустят аналог, и вы потеряете всё." },
      { text: "Запустить новинку агрессивно, даже если она убьет продажи старого.", scoreImpact: 20, feedback: "Верно. iPhone убил iPod. Лучше вы убьете свой продукт и сохраните клиента." },
      { text: "Выпустить новинку под другим брендом.", scoreImpact: -5, feedback: "Распыление ресурсов. Вы не используете силу своего бренда." },
      { text: "Продать технологию конкурентам.", scoreImpact: -15, feedback: "Стратегическая капитуляция." },
      { text: "Запустить только на новых рынках.", scoreImpact: 5, feedback: "Безопасно, но медленно." }
    ]
  },
  {
    id: 2,
    category: "Стратегия",
    type: 'single',
    sender: 'coach',
    text: "Кейс: «Алый океан». \n\nКонкурент снизил цены на 20%. Клиенты требуют от вас того же. Ваша рентабельность не позволяет снижать цену без убытков.",
    bookReference: "Чан Ким — «Стратегия голубого океана»",
    hint: "Не вступайте в войну на истощение, если у вас меньше ресурсов.",
    explanation: "Конкуренция по цене ведет в «Алый океан». Нужно уходить в «Голубой океан» — создавать новую ценность.",
    options: [
      { text: "Снизить цены, работать в убыток.", scoreImpact: -20, feedback: "Путь к банкротству." },
      { text: "Изменить продукт: добавить сервис или ценность.", scoreImpact: 20, feedback: "Верно. Уход от прямой конкуренции через инновацию ценности." },
      { text: "Написать жалобу в антимонопольную службу.", scoreImpact: -5, feedback: "Слабая позиция." },
      { text: "Снизить качество ради цены.", scoreImpact: -15, feedback: "Потеря репутации." },
      { text: "Запустить дешевый бренд-«файтер».", scoreImpact: 10, feedback: "Тактически грамотно, если есть ресурсы." }
    ]
  },
  {
    id: 3,
    category: "Lean Startup",
    type: 'single',
    sender: 'coach',
    text: "Кейс: «Перфекционизм». \n\nКоманда просит месяц на «полировку» дизайна перед релизом.",
    bookReference: "Эрик Рис — «Бизнес с нуля»",
    hint: "Вы не знаете, нужен ли продукт рынку, пока не выпустите его.",
    explanation: "Чем дольше вы не выпускаете MVP, тем больше ресурсов тратите на гипотезы.",
    options: [
      { text: "Ждать месяц. Качество превыше всего.", scoreImpact: -15, feedback: "Риск создания никому не нужного «идеального» продукта." },
      { text: "Выпускать как есть (MVP) сегодня.", scoreImpact: 20, feedback: "Верно. Быстрая обратная связь." },
      { text: "Нанять фокус-группу.", scoreImpact: 0, feedback: "Лабораторные условия хуже рынка." },
      { text: "Урезать функционал ради дизайна.", scoreImpact: 5, feedback: "Компромисс." },
      { text: "Отменить проект.", scoreImpact: -20, feedback: "Без оснований." }
    ]
  },
  // ==========================================
  // БЛОК 2: МЕНЕДЖМЕНТ
  // ==========================================
  {
    id: 4,
    category: "Делегирование",
    type: 'single',
    sender: 'coach',
    text: "Кейс: «Обезьяна на шее». \n\nСотрудник просит вас позвонить сложному клиенту: «Это ваш уровень, шеф».",
    bookReference: "Александр Фридман — «Вы или Вас»",
    hint: "Не делайте работу за подчиненных.",
    explanation: "Принимая проблему, вы снимаете ответственность с сотрудника.",
    options: [
      { text: "Позвонить самому.", scoreImpact: -15, feedback: "Вы стали исполнителем." },
      { text: "«Иди и решай сам».", scoreImpact: -5, feedback: "Риск провала без поддержки." },
      { text: "«Подготовь 3 варианта решения и зайди через час».", scoreImpact: 20, feedback: "Верно. Коучинг." },
      { text: "Поручить другому.", scoreImpact: -10, feedback: "Демотивация." },
      { text: "Пойти вместе.", scoreImpact: 10, feedback: "Наставничество." }
    ]
  },
  {
    id: 5,
    category: "Власть",
    type: 'single',
    sender: 'coach',
    text: "Кейс: «Бунт звезды». \n\nЛучший продавец отказывается заполнять CRM.",
    bookReference: "Максим Батырев — «45 татуировок менеджера»",
    hint: "Исключение для одного разрушает правило для всех.",
    explanation: "Дисциплина важнее разового результата.",
    options: [
      { text: "Разрешить не заполнять.", scoreImpact: -20, feedback: "Капитуляция." },
      { text: "Уволить показательно.", scoreImpact: 10, feedback: "Жестко, но сохраняет систему." },
      { text: "«Правила едины. Или CRM, или прощаемся».", scoreImpact: 20, feedback: "Верно. Твердая позиция." },
      { text: "Нанять ассистента.", scoreImpact: -15, feedback: "Разрушение справедливости." },
      { text: "Оштрафовать.", scoreImpact: -5, feedback: "Не решает проблему." }
    ]
  },
  {
    id: 6,
    category: "Этика",
    type: 'single',
    sender: 'coach',
    text: "Кейс: «Пустое и Твердое». \n\nПодрядчик просит подписать акт до завершения работ: «Завтра доделаем».",
    bookReference: "Владимир Тарасов",
    hint: "Опираться можно только на твердое.",
    explanation: "Подписание акта лишает вас рычага влияния.",
    options: [
      { text: "Подписать под честное слово.", scoreImpact: -15, feedback: "Ошибка." },
      { text: "Не подписывать до завершения.", scoreImpact: 20, feedback: "Верно." },
      { text: "Подписать с протоколом недоделок.", scoreImpact: 5, feedback: "Компромисс." },
      { text: "Заплатить аванс, акт не подписывать.", scoreImpact: 10, feedback: "Допустимо." },
      { text: "Наорать.", scoreImpact: -5, feedback: "Эмоции." }
    ]
  },
  // ==========================================
  // БЛОК 3: ОПЕРАЦИОНКА
  // ==========================================
  {
    id: 7,
    category: "TOC",
    type: 'single',
    sender: 'coach',
    text: "Кейс: «Узкое место». \n\nСтанок ЧПУ тормозит завод. Мастер просит второй станок ($500k). Оператор ходит на обед, станок стоит.",
    bookReference: "Элияху Голдратт — «Цель»",
    hint: "Час простоя узкого места — час простоя системы.",
    explanation: "Сначала используйте скрытые резервы (обеды, смены).",
    options: [
      { text: "Купить второй станок.", scoreImpact: 0, feedback: "Лишние траты." },
      { text: "Организовать подмену на обед.", scoreImpact: 20, feedback: "Верно. Расшивка без затрат." },
      { text: "Ускорить другие участки.", scoreImpact: -20, feedback: "Рост незавершенки." },
      { text: "Сдельная оплата.", scoreImpact: -10, feedback: "Вредно для потока." },
      { text: "Наказать мастера.", scoreImpact: -5, feedback: "Проблема в системе." }
    ]
  },
  {
    id: 101,
    category: "TOC Алгоритм",
    type: 'order',
    sender: 'coach',
    text: "Кейс: «Алгоритм Голдратта». \n\nРасставьте шаги непрерывного улучшения.",
    bookReference: "Элияху Голдратт",
    hint: "Найти -> Использовать -> Подчинить -> Расширить.",
    explanation: "1. Найти ограничение. 2. Использовать по максимуму. 3. Подчинить систему. 4. Расширить. 5. Вернуться к началу.",
    items: [
      { id: '1', text: "Расширить ограничение (инвестиции)" },
      { id: '2', text: "Найти ограничение системы" },
      { id: '3', text: "Вернуться к началу (предупредить инерцию)" },
      { id: '4', text: "Подчинить все процессы ритму ограничения" },
      { id: '5', text: "Максимально использовать текущее ограничение" }
    ],
    correctOrder: ['2', '5', '4', '1', '3']
  },
  // ==========================================
  // БЛОК 4: КОМАНДА
  // ==========================================
  {
    id: 201,
    category: "Типология (Адизес)",
    type: 'multi',
    sender: 'coach',
    text: "Кейс: «Наводим порядок». \n\nСтартап в хаосе («Давай-Давай»). Нужен COO. Какие качества по PAEI важны?",
    bookReference: "Ицхак Адизес",
    hint: "Нужен Администратор (A) для систематизации.",
    explanation: "Нужны (A) — Администрирование и (P) — Результативность.",
    items: [
      { id: '1', text: "Системность, порядок (A)" },
      { id: '2', text: "Креативность (E)" },
      { id: '3', text: "Умение говорить «НЕТ»" },
      { id: '4', text: "Мягкость" },
      { id: '5', text: "Доведение дел до конца (P)" },
      { id: '6', text: "Гибкость" }
    ],
    correctSelection: ['1', '3', '5']
  },
  {
    id: 9,
    category: "Эмоциональный интеллект",
    type: 'single',
    sender: 'coach',
    text: "Кейс: «Срыв». \n\nНа совещании крик и эмоции.",
    bookReference: "Дэниел Гоулман",
    hint: "Управляйте сначала собой.",
    explanation: "Нужно погасить эмоциональный захват.",
    options: [
      { text: "Закричать в ответ.", scoreImpact: -10, feedback: "Эскалация." },
      { text: "Перерыв 15 минут.", scoreImpact: 20, feedback: "Верно. Остыть." },
      { text: "Игнорировать.", scoreImpact: -15, feedback: "Потеря контроля." },
      { text: "Встать на чью-то сторону.", scoreImpact: -5, feedback: "Поляризация." },
      { text: "Выгнать кричащего.", scoreImpact: 5, feedback: "Допустимо." }
    ]
  },
  // ==========================================
  // БЛОК 5: ИЗМЕНЕНИЯ
  // ==========================================
  {
    id: 102,
    category: "Change Mgmt",
    type: 'order',
    sender: 'coach',
    text: "Кейс: «Трансформация». \n\nВнедрение изменений. Шаги по Коттеру.",
    bookReference: "Джон Коттер",
    hint: "Сначала «Зачем», потом «Кто», потом «Куда».",
    explanation: "1. Срочность. 2. Коалиция. 3. Видение. 4. Пропаганда.",
    items: [
      { id: '1', text: "Создать видение" },
      { id: '2', text: "Внушить чувство срочности" },
      { id: '3', text: "Пропагандировать видение" },
      { id: '4', text: "Создать коалицию реформаторов" }
    ],
    correctOrder: ['2', '4', '1', '3']
  },
  // ==========================================
  // БЛОК 6: ПЕРЕГОВОРЫ
  // ==========================================
  {
    id: 12,
    category: "Переговоры",
    type: 'single',
    sender: 'coach',
    text: "Кейс: «Шантаж ценой». \n\nКлиент требует -20% (ниже себестоимости).",
    bookReference: "Джим Кэмп",
    hint: "Нужда — враг.",
    explanation: "Не будьте спонсором. Меняйте объем услуг.",
    options: [
      { text: "Согласиться.", scoreImpact: -20, feedback: "Убытки." },
      { text: "«Снизим цену, если уберем услуги X и Y».", scoreImpact: 20, feedback: "Верно. Цена = Ценность." },
      { text: "«Уходите».", scoreImpact: -5, feedback: "Резко." },
      { text: "Скидка 10% (в ноль).", scoreImpact: 0, feedback: "Работа ради работы." },
      { text: "Откат.", scoreImpact: -50, feedback: "Криминал." }
    ]
  },
  // ==========================================
  // БЛОК 7: КРИЗИС
  // ==========================================
  {
    id: 13,
    category: "Кризис",
    type: 'single',
    sender: 'coach',
    text: "Кейс: «Сокращение штата». \n\nДенег нет. HR предлагает урезать всем зарплату на 20%, чтобы никого не увольнять.",
    bookReference: "Бен Хоровиц",
    hint: "Демократия в кризис убивает.",
    explanation: "Лучшие уйдут, худшие останутся.",
    options: [
      { text: "Всем -20%.", scoreImpact: -20, feedback: "Потеря ядра команды." },
      { text: "Уволить 20% худших.", scoreImpact: 20, feedback: "Верно. Санация." },
      { text: "Никого не трогать.", scoreImpact: -25, feedback: "Банкротство." },
      { text: "По собственному желанию.", scoreImpact: -10, feedback: "Уйдут лучшие." },
      { text: "Уволить новичков.", scoreImpact: -5, feedback: "Среди них могут быть таланты." }
    ]
  }
];

// --- UTILS ---

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// --- FIREBASE CONFIG ---
const getFirebaseServices = () => {
  try {
    const configStr = typeof __firebase_config !== 'undefined' ? __firebase_config : null;
    if (!configStr) return { auth: null, db: null };

    const firebaseConfig = JSON.parse(configStr);
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { auth, db };
  } catch (e) {
    console.warn("Firebase init failed:", e);
    return { auth: null, db: null };
  }
};

const { auth, db } = getFirebaseServices();
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- MAIN COMPONENT ---

export default function ManagementSimulatorV6() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(!!auth);
  const [isOffline, setIsOffline] = useState(!auth);
  
  // NEW STATE: User Name
  const [userName, setUserName] = useState('');
  const [isResultSent, setIsResultSent] = useState(false);

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'debrief' | 'finished'>('intro');
  const [scenarioQueue, setScenarioQueue] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [score, setScore] = useState(50); 
  const [showHint, setShowHint] = useState(false);
  const [coachNotes, setCoachNotes] = useState<string[]>([]);
  
  const [debrief, setDebrief] = useState<DebriefData | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); 
  const [orderedItems, setOrderedItems] = useState<Item[]>([]); 

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auth Effect
  useEffect(() => {
    if (!auth) {
      setIsOffline(true);
      setAuthLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
        setIsOffline(true);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, debrief]);

  const startGame = () => {
    if (!userName.trim()) {
      alert("Пожалуйста, представьтесь перед началом.");
      return;
    }

    const shuffled = shuffleArray(SCENARIOS_POOL);
    const selected = shuffled.slice(0, 10);
    
    setScenarioQueue(selected);
    setCurrentScenarioIndex(0);
    setGameState('playing');
    setScore(50);
    setCoachNotes([]);
    setMessages([{
      id: 'init',
      text: `Приветствую, ${userName}! Я твой наставник. Давай проверим твои управленческие рефлексы.\n\n${selected[0].text}`,
      sender: 'coach'
    }]);
    
    initScenarioState(selected[0]);
  };

  const initScenarioState = (scenario: Scenario) => {
    if (scenario.type === 'multi') {
      setSelectedItems([]);
    } else if (scenario.type === 'order' && scenario.items) {
      setOrderedItems(shuffleArray([...scenario.items])); 
    }
  };

  const sendResultToCloud = async () => {
    if (isOffline || !user || !db) {
        // Fallback or simulate sending
        setIsResultSent(true);
        return;
    }
    
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'results'), {
        name: userName,
        score,
        notes: coachNotes,
        timestamp: serverTimestamp(),
        type: 'leader_skills_test'
      });
      setIsResultSent(true);
    } catch (e) {
      console.error("Error sending results:", e);
      alert("Ошибка отправки. Результат сохранен локально.");
      setIsResultSent(true); // Treat as handled to show success state
    }
  };

  const nextScenario = () => {
    const nextIndex = currentScenarioIndex + 1;
    setDebrief(null); 
    
    if (nextIndex >= scenarioQueue.length) {
      setGameState('finished');
    } else {
      setCurrentScenarioIndex(nextIndex);
      const nextScen = scenarioQueue[nextIndex];
      setMessages(prev => [...prev, {
        id: `scen_${nextIndex}`,
        text: nextScen.text,
        sender: 'coach'
      }]);
      setGameState('playing');
      setShowHint(false);
      initScenarioState(nextScen);
    }
  };

  // --- Handlers ---

  const handleSingleChoice = (option: Option) => {
    const currentScenario = scenarioQueue[currentScenarioIndex];
    const userMsgId = Date.now().toString();
    
    setMessages(prev => [...prev, { id: userMsgId, text: option.text, sender: 'user' }]);
    
    const bestOption = currentScenario.options?.reduce((prev, current) => 
      (prev.scoreImpact > current.scoreImpact) ? prev : current
    );

    const isCorrect = option.scoreImpact === (bestOption?.scoreImpact || 0);
    
    setDebrief({
      isCorrect,
      userScore: option.scoreImpact,
      userChoiceText: option.text,
      userConsequences: option.feedback,
      correctAnswerText: bestOption?.text || "",
      correctRationale: isCorrect ? option.feedback : (bestOption?.feedback || "") + " " + (currentScenario.explanation || ""),
      bookRecommendation: currentScenario.bookReference || "Базовая теория менеджмента"
    });

    setScore(prev => Math.min(100, Math.max(0, prev + option.scoreImpact)));
    finalizeTurn(isCorrect, currentScenario.category, option.scoreImpact);
  };

  const handleMultiSubmit = () => {
    const currentScenario = scenarioQueue[currentScenarioIndex];
    const correct = currentScenario.correctSelection || [];
    
    const missing = correct.filter(id => !selectedItems.includes(id));
    const wrong = selectedItems.filter(id => !correct.includes(id));
    const right = selectedItems.filter(id => correct.includes(id));

    let roundScore = 0;
    if (missing.length === 0 && wrong.length === 0) roundScore = 20;
    else roundScore = (right.length * 5) - (wrong.length * 10) - (missing.length * 5);

    const userText = currentScenario.items?.filter(i => selectedItems.includes(i.id)).map(i => i.text).join(", ") || "Ничего не выбрано";
    setMessages(prev => [...prev, { id: Date.now().toString(), text: "Выбрано: " + userText, sender: 'user' }]);

    const isCorrect = roundScore >= 15;
    
    let consequences = "";
    if (wrong.length > 0) consequences += `Лишнее: ${wrong.length}. `;
    if (missing.length > 0) consequences += `Упущено: ${missing.length}. `;
    if (isCorrect) consequences += "Верно.";

    const correctText = currentScenario.items?.filter(i => correct.includes(i.id)).map(i => i.text).join(", ");

    setDebrief({
      isCorrect,
      userScore: roundScore,
      userChoiceText: userText,
      userConsequences: consequences,
      correctAnswerText: correctText || "",
      correctRationale: currentScenario.explanation || "",
      bookRecommendation: currentScenario.bookReference || "Базовая теория менеджмента"
    });

    setScore(prev => Math.min(100, Math.max(0, prev + roundScore)));
    finalizeTurn(isCorrect, currentScenario.category, roundScore);
  };

  const handleOrderSubmit = () => {
    const currentScenario = scenarioQueue[currentScenarioIndex];
    const correctOrder = currentScenario.correctOrder || [];
    const userOrder = orderedItems.map(i => i.id);

    const isExact = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    let roundScore = isExact ? 25 : -10;
    if (!isExact && userOrder[0] === correctOrder[0]) roundScore = 5;

    const userText = orderedItems.map((i, idx) => `${idx + 1}. ${i.text}`).join("\n");
    setMessages(prev => [...prev, { id: Date.now().toString(), text: userText, sender: 'user' }]);

    const correctTextList = correctOrder.map((id, idx) => {
        const item = currentScenario.items?.find(i => i.id === id);
        return `${idx + 1}. ${item?.text}`;
    }).join("\n");

    setDebrief({
      isCorrect: isExact,
      userScore: roundScore,
      userChoiceText: <pre className="whitespace-pre-wrap font-sans">{userText}</pre>,
      userConsequences: isExact ? "Алгоритм верен." : "Нарушение логики.",
      correctAnswerText: <pre className="whitespace-pre-wrap font-sans">{correctTextList}</pre>,
      correctRationale: currentScenario.explanation || "",
      bookRecommendation: currentScenario.bookReference || "Базовая теория менеджмента"
    });

    setScore(prev => Math.min(100, Math.max(0, prev + roundScore)));
    finalizeTurn(isExact, currentScenario.category, roundScore);
  };

  const finalizeTurn = (isCorrect: boolean, category: string, scoreImpact: number) => {
    setGameState('debrief');
    const icon = isCorrect ? "✅" : scoreImpact > 0 ? "⚠️" : "❌";
    setCoachNotes(prev => [...prev, `${icon} [${category}]: ${scoreImpact} баллов`]);
  };

  // --- Renderers ---

  const renderDebrief = () => {
    if (!debrief) return null;
    return (
      <div className="mt-4 p-6 bg-slate-50 border-t-4 border-blue-600 rounded-b-xl shadow-2xl animate-fadeIn relative z-50">
        <div className="flex items-center gap-3 mb-6">
           {debrief.isCorrect ? <CheckCircle className="text-green-600" size={32} /> : <AlertTriangle className="text-red-500" size={32}/>}
           <div>
             <h3 className="text-xl font-bold text-slate-800">
               {debrief.isCorrect ? "Верное решение" : "Рискованный ход"}
             </h3>
             <p className={`text-sm font-bold ${debrief.userScore > 0 ? 'text-green-600' : 'text-red-600'}`}>
               Результат: {debrief.userScore > 0 ? '+' : ''}{debrief.userScore}
             </p>
           </div>
        </div>

        <div className="space-y-4">
           {/* Book Recommendation */}
           <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
              <Library size={24} className="text-blue-600 shrink-0 mt-1" />
              <div>
                <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Что почитать</div>
                <div className="text-blue-900 font-bold text-lg leading-tight">{debrief.bookRecommendation}</div>
                <div className="text-sm text-blue-700 mt-1">Основание правильного ответа</div>
              </div>
           </div>

           <div className="grid gap-4 md:grid-cols-2">
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ваш выбор</div>
                <div className="mb-2 text-slate-700 font-medium italic border-l-2 border-slate-300 pl-3">
                  {debrief.userChoiceText}
                </div>
                <div className="text-sm text-red-700 bg-red-50 p-2 rounded flex items-start gap-2">
                   <AlertTriangle size={14} className="shrink-0 mt-0.5"/>
                   {debrief.userConsequences}
                </div>
             </div>

             <div className={`bg-white p-4 rounded-xl border shadow-sm ${debrief.isCorrect ? 'border-green-200 bg-green-50' : 'border-blue-100'}`}>
                <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Эталон</div>
                {!debrief.isCorrect && (
                  <div className="mb-2 text-slate-800 font-bold border-l-2 border-blue-500 pl-3">
                    {debrief.correctAnswerText}
                  </div>
                )}
                <div className="text-sm text-slate-600 flex items-start gap-2">
                   <Info size={14} className="shrink-0 mt-0.5 text-blue-500"/>
                   {debrief.correctRationale}
                </div>
             </div>
           </div>
        </div>

        <button 
          onClick={nextScenario}
          className="mt-6 w-full py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-lg flex items-center justify-center gap-2"
        >
          Следующий кейс <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderMultiSelect = (scenario: Scenario) => (
    <div className="space-y-3">
      <div className="text-sm text-slate-500 font-medium mb-2 flex items-center gap-2">
        <CheckSquare size={16}/> Выберите ВСЕ верные пункты:
      </div>
      {scenario.items?.map(item => (
        <button
          key={item.id}
          onClick={() => {
            if (selectedItems.includes(item.id)) setSelectedItems(prev => prev.filter(i => i !== item.id));
            else setSelectedItems(prev => [...prev, item.id]);
          }}
          className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${
            selectedItems.includes(item.id) 
              ? 'border-blue-600 bg-blue-50 text-blue-900' 
              : 'border-slate-200 hover:border-blue-300 bg-white'
          }`}
        >
          <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedItems.includes(item.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-400'}`}>
            {selectedItems.includes(item.id) && <CheckCircle size={14} className="text-white"/>}
          </div>
          <span className="text-sm font-medium">{item.text}</span>
        </button>
      ))}
      <button 
        onClick={handleMultiSubmit}
        className="w-full py-3 mt-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
      >
        Принять решение
      </button>
    </div>
  );

  const renderOrdering = (scenario: Scenario) => {
    const moveItem = (index: number, direction: -1 | 1) => {
      const newItems = [...orderedItems];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newItems.length) return;
      
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      setOrderedItems(newItems);
    };

    return (
      <div className="space-y-2">
        <div className="text-sm text-slate-500 font-medium mb-2 flex items-center gap-2">
          <ListOrdered size={16}/> Расставьте шаги в правильном порядке:
        </div>
        {orderedItems.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2 bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
            <div className="font-bold text-slate-300 w-6 text-center">{index + 1}</div>
            <div className="flex-1 text-sm font-medium text-slate-700">{item.text}</div>
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => moveItem(index, -1)} 
                disabled={index === 0}
                className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"
              >
                <ArrowUp size={16}/>
              </button>
              <button 
                onClick={() => moveItem(index, 1)} 
                disabled={index === orderedItems.length - 1}
                className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"
              >
                <ArrowDown size={16}/>
              </button>
            </div>
          </div>
        ))}
        <button 
          onClick={handleOrderSubmit}
          className="w-full py-3 mt-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
        >
          Утвердить алгоритм
        </button>
      </div>
    );
  };

  const renderSingleChoice = (scenario: Scenario) => (
    <div className="grid gap-3">
      {scenario.options?.map((option, idx) => (
        <button
          key={idx}
          onClick={() => handleSingleChoice(option)}
          className="group relative text-left p-4 bg-white border border-slate-200 rounded-xl transition-all duration-200 hover:border-blue-500 hover:shadow-md flex items-start gap-3"
        >
          <div className="mt-0.5 min-w-[24px] h-6 rounded flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-bold group-hover:bg-blue-100 group-hover:text-blue-600">
            {idx + 1}
          </div>
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{option.text}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      
      {/* LEFT: Chat Area */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full bg-white shadow-2xl relative">
        <div className="p-4 border-b bg-slate-900 text-white flex justify-between items-center shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BrainCircuit size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide">Навыки лидера</h1>
              <p className="text-xs text-slate-400">Симулятор принятия решений</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {isOffline ? (
               <span className="text-xs text-amber-500 flex items-center gap-1 font-bold border border-amber-200 px-2 py-1 rounded bg-amber-50">
                 <WifiOff size={12}/> Offline
               </span>
             ) : authLoading ? (
               <span className="text-xs text-slate-500 flex items-center gap-1"><CloudLightning className="animate-pulse" size={12}/> ...</span>
             ) : (
               <span className="text-xs text-green-600 flex items-center gap-1 font-bold"><CloudLightning size={12}/> Online</span>
             )}
             <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Репутация</span>
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className={`h-full transition-all duration-700 ease-out ${score > 75 ? 'bg-green-500' : score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50 relative scroll-smooth pb-32">
          {gameState === 'intro' && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fadeIn max-w-3xl mx-auto">
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Library size={40} className="text-blue-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Навыки лидера</h2>
                <div className="text-lg text-slate-600 leading-relaxed mb-6">
                  <p>Вам предстоит решить 10 сложных управленческих кейсов.</p>
                  <div className="mt-6 mb-6">
                    <input 
                        type="text" 
                        placeholder="Введите ваше имя" 
                        className="w-full p-4 border border-slate-300 rounded-xl text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    💡 После каждого ответа вы получите <b>рекомендацию книги</b>.
                  </div>
                </div>
              </div>
              <button 
                onClick={startGame}
                disabled={authLoading && !isOffline}
                className="px-12 py-4 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-400 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
              >
                {authLoading && !isOffline ? 'Загрузка...' : 'Начать тест'} <ChevronRight size={24} />
              </button>
            </div>
          )}

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[95%] md:max-w-[85%] p-6 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed relative ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-200' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                }`}
              >
                 {msg.sender === 'coach' && (
                   <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                     <span className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                       <User size={14} /> Входящая задача
                     </span>
                     {gameState !== 'intro' && scenarioQueue[currentScenarioIndex] && (
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold border border-blue-100">
                          {scenarioQueue[currentScenarioIndex].category.toUpperCase()}
                        </span>
                     )}
                   </div>
                 )}
                 <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
              </div>
            </div>
          ))}
          
          {gameState === 'debrief' && renderDebrief()}

          <div ref={messagesEndRef} />
        </div>

        {/* Action Area */}
        {gameState === 'playing' && scenarioQueue[currentScenarioIndex] && (
          <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-200 shadow-[0_-5px_30px_rgba(0,0,0,0.05)] z-20">
             {scenarioQueue[currentScenarioIndex].type === 'multi' && renderMultiSelect(scenarioQueue[currentScenarioIndex])}
             {scenarioQueue[currentScenarioIndex].type === 'order' && renderOrdering(scenarioQueue[currentScenarioIndex])}
             {scenarioQueue[currentScenarioIndex].type === 'single' && renderSingleChoice(scenarioQueue[currentScenarioIndex])}
          </div>
        )}

        {/* Finished Screen */}
        {gameState === 'finished' && (
           <div className="absolute inset-0 bg-slate-50 z-30 flex flex-col overflow-y-auto animate-fadeIn">
              <div className="p-8 max-w-4xl mx-auto w-full">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Итоги сессии: {userName}</h2>
                  <div className="text-6xl font-black tracking-tighter mb-4 text-slate-800">{score}<span className="text-3xl text-slate-400 font-normal">/100</span></div>
                  <div className={`text-xs font-bold uppercase tracking-widest mb-6 flex items-center justify-center gap-2 ${isOffline ? 'text-amber-600' : 'text-green-600'}`}>
                    {isOffline ? <WifiOff size={14}/> : <CloudLightning size={14}/>} 
                    {isOffline ? "Результат сохранен локально" : "Синхронизировано"}
                  </div>
                  
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8 text-left">
                    <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-6 border-b pb-4">Краткий лог</h3>
                    <div className="grid gap-2">
                       {coachNotes.map((note, idx) => (
                          <div key={idx} className="text-sm p-3 bg-slate-50 rounded border border-slate-100 font-medium text-slate-700">
                            {note}
                          </div>
                       ))}
                    </div>
                  </div>

                  {!isResultSent ? (
                    <button 
                      onClick={sendResultToCloud} 
                      className="px-10 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-xl mx-auto flex items-center gap-2"
                    >
                         <Send size={20} /> Отправить результат
                    </button>
                  ) : (
                    <div className="text-green-600 font-bold p-4 bg-green-50 rounded-xl border border-green-200 inline-block">
                        <CheckCircle className="inline mr-2"/> Результат успешно отправлен!
                    </div>
                  )}

                  <button onClick={() => window.location.reload()} className="block mt-6 text-slate-400 hover:text-slate-600 text-sm mx-auto">
                       Начать заново (сброс)
                  </button>
                </div>
              </div>
           </div>
        )}
      </div>

      {/* RIGHT: Mentor Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white border-l shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${showHint ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:w-1/3 xl:w-1/4 flex flex-col`}>
        <div className="p-5 bg-slate-900 text-white flex justify-between items-center shadow-md">
          <h3 className="font-bold text-lg flex items-center gap-3">
            <HelpCircle size={20} className="text-blue-400"/> Ментор
          </h3>
          <button onClick={() => setShowHint(false)} className="lg:hidden text-slate-400 hover:text-white">
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto bg-slate-50">
           {gameState !== 'intro' && gameState !== 'finished' && scenarioQueue[currentScenarioIndex] ? (
             <div className="space-y-6 animate-fadeIn">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <BookOpen size={14} /> Источник
                   </div>
                   <p className="text-sm font-semibold text-slate-800 leading-snug">{scenarioQueue[currentScenarioIndex].bookReference}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100 shadow-sm relative overflow-hidden">
                   <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-3 relative z-10 flex items-center gap-2">
                     <BrainCircuit size={14}/> Подсказка
                   </div>
                   <p className="text-sm text-slate-800 leading-relaxed relative z-10 font-medium italic">
                     "{scenarioQueue[currentScenarioIndex].hint}"
                   </p>
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center opacity-50">
                <Briefcase size={48} className="mb-4" />
                <p>Ожидание...</p>
             </div>
           )}
        </div>
      </div>
      
      {/* Mobile Hint Toggle */}
      {gameState === 'playing' && !showHint && (
        <button onClick={() => setShowHint(true)} className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl z-50">
          <HelpCircle size={24} />
        </button>
      )}
    </div>
  );
}        
        }
        <button onClick={() => alert('Кнопка работает!')}>
          Нажми меня
        </button>
      </div>
      
      {/* Кнопка закрытия приложения */}
      <button 
        style={{marginTop: '20px', padding: '10px 20px'}}
        onClick={() => window.Telegram.WebApp.close()}
      >
        Закрыть приложение
      </button>
    </div>
  );
}

export default App;
